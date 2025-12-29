import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, map, of, shareReplay } from 'rxjs';

import {
  LucideAngularModule,
  Quote,
  BadgeCheck,
  ExternalLink,
} from 'lucide-angular';

import { DoctoraliaOpinionsApi } from '../../../features/testimonios/data/doctoralia-opinions.api';
import {
  DoctoraliaParsed,
  parseDoctoraliaRawSafe,
} from '../../../features/testimonios/utils/doctoralia.parser';

@Component({
  selector: 'app-testimonials-preview',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './testimonials-preview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsPreviewComponent {
  private api = inject(DoctoraliaOpinionsApi);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  loading = signal(true);
  error = signal<string | null>(null);

  skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  readonly doctorId = 87771;
  readonly max = 10;

  iQuote = Quote;
  iVerified = BadgeCheck;
  iExternal = ExternalLink;

  private stream$ = this.api.listLatest({ doctorId: this.doctorId, max: this.max }).pipe(
    map((rows) =>
      rows
        .map((r) => parseDoctoraliaRawSafe(r, { isBrowser: this.isBrowser }))
        .filter((x) => (x.comment ?? '').trim().length > 0)
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
    catchError((err) => {
      console.error(err);
      this.error.set('No se pudieron cargar los testimonios.');
      return of([] as DoctoraliaParsed[]);
    }),
    finalize(() => this.loading.set(false))
  );

  // Signal con data final
  testimonials = toSignal(this.stream$, { initialValue: [] as DoctoraliaParsed[] });

  stars(rating: number) {
    const n = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return Array.from({ length: 5 }, (_, i) => i < n);
  }

  trackById = (_: number, item: DoctoraliaParsed) => item.id;
}
