/// <reference lib="deno.ns" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.49/deno-dom-wasm.ts";

type Opinion = {
  external_id: number;
  author_name: string | null;
  rating: number | null;
  comment: string | null;
  date_published: string | null; // YYYY-MM-DD
  clinic: string | null;
  service: string | null;
  is_verified: boolean | null;
  source_url: string | null;
  raw_html: string | null;
};

function toInt(v: unknown, fallback: number) {
  const n = typeof v === "string" ? parseInt(v, 10) : typeof v === "number" ? Math.trunc(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function normalizeText(s?: string | null) {
  if (!s) return null;
  const t = s.replace(/\s+/g, " ").trim();
  return t.length ? t : null;
}

function parseRatingFromText(text: string | null): number | null {
  if (!text) return null;
  // intenta encontrar "5" o "4.5" en texto
  const m = text.match(/(\d(?:\.\d)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function parseDateISO(value: string | null): string | null {
  if (!value) return null;
  // si ya viene como YYYY-MM-DD
  const iso = value.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (iso) return iso[1];
  // intenta extraer de datetime tipo 2025-12-01T00:00:00Z
  const dt = value.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (dt) return dt[1];
  return null;
}

function parseOpinionsFromHtml(html: string, doctorId: number): Opinion[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return [];

  // Heurísticas: Doctoralia puede cambiar markup. Buscamos nodos con data-id o similares.
  // 1) Elementos con data-id numérico
  const candidates = Array.from(doc.querySelectorAll("[data-id]"))
    .filter((el) => /^\d+$/.test(el.getAttribute("data-id") ?? ""));

  const opinions: Opinion[] = [];

  for (const el of candidates) {
    const externalId = Number(el.getAttribute("data-id"));
    if (!Number.isFinite(externalId)) continue;

    const blockHtml = el.outerHTML ?? null;

    // Autor (heurística)
    const author =
      normalizeText(el.querySelector(".opinion-card__author, .opinion-author, [data-test='opinion-author'], .author")?.textContent) ??
      normalizeText(el.querySelector("strong, b")?.textContent);

    // Comentario (heurística)
    const comment =
      normalizeText(el.querySelector(".opinion-card__comment, .opinion-card__description, [data-test='opinion-comment'], .comment, p")?.textContent);

    // Rating (heurística)
    // a veces viene como aria-label en estrellas, o texto "5/5"
    const ratingText =
      el.querySelector("[aria-label*='5'], [aria-label*='4'], [data-test='opinion-rating']")?.getAttribute("aria-label") ??
      normalizeText(el.querySelector(".opinion-card__rating, .rating, [data-test='rating-value']")?.textContent);

    const rating = parseRatingFromText(ratingText);

    // Fecha (heurística)
    const dateText =
      el.querySelector("time")?.getAttribute("datetime") ??
      normalizeText(el.querySelector("time")?.textContent) ??
      null;

    const date_published = parseDateISO(dateText);

    // Clínica / servicio (heurística)
    const clinic =
      normalizeText(el.querySelector("[data-test='opinion-clinic'], .clinic, .opinion-card__clinic")?.textContent);

    const service =
      normalizeText(el.querySelector("[data-test='opinion-service'], .service, .opinion-card__service")?.textContent);

    // Verificada (heurística)
    const verifiedText =
      normalizeText(el.querySelector("[data-test='opinion-verified'], .verified, .opinion-card__verified")?.textContent);
    const is_verified =
      verifiedText ? /verificad|verified|cita verificada/i.test(verifiedText) : null;

    // source_url (si hay link)
    const link = el.querySelector("a[href]")?.getAttribute("href") ?? null;
    const source_url = link ? (link.startsWith("http") ? link : null) : null;

    opinions.push({
      external_id: externalId,
      author_name: author,
      rating,
      comment,
      date_published,
      clinic,
      service,
      is_verified,
      source_url,
      raw_html: blockHtml,
    });
  }

  // Si no encontramos nada con DOM, fallback regex (súper básico)
  if (opinions.length === 0) {
    const ids = [...html.matchAll(/data-id="(\d+)"/g)].map((m) => Number(m[1])).filter(Number.isFinite);
    const uniq = Array.from(new Set(ids)).slice(0, 50);
    for (const externalId of uniq) {
      opinions.push({
        external_id: externalId,
        author_name: null,
        rating: null,
        comment: null,
        date_published: null,
        clinic: null,
        service: null,
        is_verified: null,
        source_url: null,
        raw_html: null,
      });
    }
  }

  return opinions;
}

Deno.serve(async (req) => {
  // CORS básico
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type, x-refresh-secret",
      },
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Use POST" }), { status: 405 });
    }

    const refreshSecret = Deno.env.get("REFRESH_SECRET") ?? "";
    const incomingSecret = req.headers.get("x-refresh-secret") ?? "";
    if (refreshSecret && incomingSecret !== refreshSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const doctorId = toInt(body.doctorId, 0);
    const page = toInt(body.page, 1);

    if (!doctorId || doctorId <= 0) {
      return new Response(JSON.stringify({ error: "doctorId inválido" }), { status: 400 });
    }
    if (page < 1 || page > 50) {
      return new Response(JSON.stringify({ error: "page inválida" }), { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    const endpoint = `https://www.doctoralia.com.mx/ajax/mobile/doctor-opinions/${doctorId}/${page}`;

    const resp = await fetch(endpoint, {
      headers: {
        "accept": "application/json, text/plain, */*",
        "user-agent": Deno.env.get("SCRAPER_USER_AGENT") ??
          "Mozilla/5.0 (compatible; SupabaseEdgeBot/1.0; +https://supabase.com)",
        "x-requested-with": "XMLHttpRequest",
        "referer": "https://www.doctoralia.com.mx/",
      },
    });

    const status = resp.status;

    if (!resp.ok) {
      await sb.from("fetch_logs").insert({
        doctor_id: doctorId,
        page,
        ok: false,
        status,
        message: `Fetch failed: ${status}`,
      });
      return new Response(JSON.stringify({ error: "Fetch failed", status }), { status: 502 });
    }

    const data = await resp.json() as { limit?: number; numRows?: number; html?: string };
    const html = typeof data.html === "string" ? data.html : "";

    const parsed = parseOpinionsFromHtml(html, doctorId);

    // Upsert
    if (parsed.length > 0) {
      const rows = parsed.map((o) => ({
        doctor_id: doctorId,
        external_id: o.external_id,
        author_name: o.author_name,
        rating: o.rating,
        comment: o.comment,
        date_published: o.date_published,
        clinic: o.clinic,
        service: o.service,
        is_verified: o.is_verified,
        source_url: o.source_url,
        raw_html: o.raw_html,
        fetched_at: new Date().toISOString(),
      }));

      const { error: upsertErr } = await sb
        .from("doctor_opinions")
        .upsert(rows, { onConflict: "doctor_id,external_id" });

      if (upsertErr) {
        await sb.from("fetch_logs").insert({
          doctor_id: doctorId,
          page,
          ok: false,
          status: 500,
          message: `Upsert error: ${upsertErr.message}`,
        });
        return new Response(JSON.stringify({ error: "DB upsert error", details: upsertErr.message }), { status: 500 });
      }
    }

    await sb.from("fetch_logs").insert({
      doctor_id: doctorId,
      page,
      ok: true,
      status,
      message: `ok; parsed=${parsed.length}; numRows=${data.numRows ?? null}`,
    });

    // opcional: actualizar last_refresh_at
    await sb.from("doctor_sources")
      .upsert({
        doctor_id: doctorId,
        source: "doctoralia",
        last_refresh_at: new Date().toISOString(),
      }, { onConflict: "doctor_id" });

    return new Response(JSON.stringify({
      ok: true,
      doctorId,
      page,
      parsedCount: parsed.length,
      remote: { limit: data.limit ?? null, numRows: data.numRows ?? null },
    }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      },
    });

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: "Unhandled error", message: msg }), {
      status: 500,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
    });
  }
});
