export type DoctoraliaParsed = {
  id: string | number;
  author: string;
  rating: number; // 0..5
  comment: string;
  dateText?: string;
  datetime?: string;
  clinic?: string;
  service?: string;
  isVerified: boolean;
  sourceUrl?: string | null;
};

export function parseDoctoraliaRawSafe(
  row: { id: any; raw_html: string | null; source_url?: string | null },
  opts: { isBrowser: boolean },
): DoctoraliaParsed {
  const html = row.raw_html ?? '';

  // ✅ SSR fallback (sin DOMParser)
  if (!opts.isBrowser) {
    // súper básico: intenta sacar algo de texto para que al menos haya contenido
    const comment = stripTags(html).trim();
    return {
      id: row.id,
      author: 'Paciente',
      rating: 0,
      comment: comment.slice(0, 320), // evita mega strings
      isVerified: html.includes('Cita verificada'),
      sourceUrl: row.source_url ?? null,
    };
  }

  // ✅ Browser parse con DOMParser
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const author =
    doc.querySelector('[itemprop="author"] [itemprop="name"]')?.textContent?.trim() || 'Paciente';

  const ratingEl = doc.querySelector('#rating-as-stars .rating') as Element | null;
  const rating = clampInt(Number(ratingEl?.getAttribute('data-score') ?? 0), 0, 5);

  const comment = doc.querySelector('[itemprop="reviewBody"]')?.textContent?.trim() || '';

  const timeEl = doc.querySelector('time[itemprop="datePublished"]') as HTMLTimeElement | null;
  const datetime = timeEl?.getAttribute('datetime') ?? undefined;
  const dateText = timeEl?.textContent?.trim() ?? undefined;

  const metaLine =
    Array.from(doc.querySelectorAll('span.small.text-muted'))
      .map((n) => (n.textContent ?? '').replace(/\s+/g, ' ').trim())
      .find((t) => t.includes('•')) ?? '';

  const parts = metaLine.split('•').map((s) => s.trim()).filter(Boolean);
  const clinic = parts[0];
  const service = parts[1];

  const isVerified =
    !!doc.querySelector('.badge.bg-success-light') ||
    doc.body.textContent?.includes('Cita verificada') === true;

  return {
    id: row.id,
    author,
    rating,
    comment,
    dateText,
    datetime,
    clinic,
    service,
    isVerified,
    sourceUrl: row.source_url ?? null,
  };
}

function clampInt(n: number, min: number, max: number) {
  const x = Number.isFinite(n) ? Math.round(n) : 0;
  return Math.max(min, Math.min(max, x));
}

function stripTags(s: string) {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}
