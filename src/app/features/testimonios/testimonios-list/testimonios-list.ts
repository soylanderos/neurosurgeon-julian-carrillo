import { Component, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Quote, Star, BadgeCheck, ExternalLink } from 'lucide-angular';

import { GoogleReviewsApi, GoogleReviewsResponse } from '../data/google-reviews.api';
import { DoctoraliaOpinionsApi } from '../data/doctoralia-opinions.api';
import { DoctoraliaParsed, parseDoctoraliaRawSafe } from '../utils/doctoralia.parser';

type Tab = 'doctoralia' | 'google';

// Ajusta esto si tu tipo real de review Google es distinto
type GoogleReview = {
  author: string;
  authorPhoto?: string | null;
  rating?: number | null;
  text?: string | null;
  relativeTime?: string | null;
  publishTime?: string | null;
  googleMapsUri?: string | null;
};

@Component({
  selector: 'app-testiomonios-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './testimonios-list.html',
  styleUrl: './testimonios-list.css',
})
export class TestiomoniosList {
  private googleReviewsApi = inject(GoogleReviewsApi);
  private doctoraliaApi = inject(DoctoraliaOpinionsApi);

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Doctor id fijo
  readonly doctorId = 87771;

  // UI
  readonly activeTab = signal<Tab>('doctoralia');

  // paging
  private readonly PAGE_SIZE = 15;
  readonly visibleCount = signal<number>(this.PAGE_SIZE);

  // Google Reviews
  readonly loadingGoogle = signal(true);
  readonly errorGoogle = signal<string | null>(null);
  readonly data = signal<GoogleReviewsResponse | null>(null);

  // Doctoralia
  readonly loadingDoctoralia = signal(true);
  readonly errorDoctoralia = signal<string | null>(null);
  readonly doctoralia = signal<DoctoraliaParsed[]>([]);

  // icons
  readonly iQuote = Quote;
  readonly iStar = Star;
  readonly iBadgeCheck = BadgeCheck;
  readonly iExternal = ExternalLink;

  // skeletons
  readonly skeletonItems = Array.from({ length: 9 }, (_, i) => i);

  // ---- Derived: google normalized list
  readonly googleReviews = computed<GoogleReview[]>(() => {
    const d = this.data();
    const arr = (d?.reviews ?? []) as any[];
    return arr.map((r) => ({
      author: r.author ?? 'Paciente',
      authorPhoto: r.authorPhoto ?? null,
      rating: r.rating ?? null,
      text: r.text ?? null,
      relativeTime: r.relativeTime ?? null,
      publishTime: r.publishTime ?? null,
      googleMapsUri: r.googleMapsUri ?? null,
    }));
  });

  // ---- Active list + totals
  readonly totalActive = computed(() => {
    return this.activeTab() === 'doctoralia'
      ? this.doctoralia().length
      : this.googleReviews().length;
  });

  readonly hasMore = computed(() => this.visibleCount() < this.totalActive());

  readonly visibleDoctoralia = computed(() => this.doctoralia().slice(0, this.visibleCount()));
  readonly visibleGoogle = computed(() => this.googleReviews().slice(0, this.visibleCount()));

  constructor() {
    // SSR friendly: deja skeletons
    if (!this.isBrowser) return;

    // ✅ Doctoralia (pedimos MUCHAS para que “load more” sea real sin recargar)
    this.doctoraliaApi.listLatest({ doctorId: this.doctorId, max: 12 }).subscribe({
      next: (rows) => {
        const parsed = rows
          .map((r) => parseDoctoraliaRawSafe(r, { isBrowser: this.isBrowser }))
          .filter((x) => (x.comment ?? '').trim().length > 0);

        this.doctoralia.set(parsed);
        this.loadingDoctoralia.set(false);
      },
      error: (e) => {
        console.error(e);
        this.errorDoctoralia.set('No se pudieron cargar reseñas de Doctoralia.');
        this.loadingDoctoralia.set(false);
      },
    });

    // ✅ Google Reviews (subimos el límite para que sí haya “más y más”)
    this.googleReviewsApi.getReviews({ lang: 'es', max: 120, ttlHours: 12 }).subscribe({
      next: (res) => {
        this.data.set(res);
        this.loadingGoogle.set(false);
      },
      error: (e) => {
        console.error(e);
        this.errorGoogle.set('No se pudieron cargar las reseñas en este momento.');
        this.loadingGoogle.set(false);
      },
    });
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
    this.resetVisible();
  }

  loadMore() {
    this.visibleCount.update((v) => v + this.PAGE_SIZE);
  }

  resetVisible() {
    this.visibleCount.set(this.PAGE_SIZE);

    // micro “scroll to top” del panel (opcional, se siente premium)
    if (typeof window !== 'undefined') {
      queueMicrotask(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }

  starsFilled(rating: number | null | undefined) {
    const n = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
    return Array.from({ length: 5 }, (_, i) => i < n);
  }

  // tracks
  trackDoctoralia = (_: number, r: DoctoraliaParsed) => `${r.id}-${r.datetime ?? ''}-${r.author}`;
  trackGoogle = (_: number, r: GoogleReview) => `${r.author}-${r.publishTime ?? r.relativeTime ?? ''}`;
  trackSkeleton = (_: number, i: number) => i;
}
