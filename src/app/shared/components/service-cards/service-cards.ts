import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, shareReplay } from 'rxjs';

import { LucideAngularModule, Activity, Brain, ArrowRight } from 'lucide-angular';
import { Servicio, ServiciosApi } from '../../../features/servicios/data/servicios.api';

type CardVM = {
  title: string;
  description: string;
  slug: string;
  icon: 'activity' | 'brain';
};

@Component({
  selector: 'app-service-cards',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './service-cards.html',
  styleUrls: ['./service-cards.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCardsComponent {
  private api = inject(ServiciosApi);

  // Inputs sin @Input (Angular moderno)
  max = input<number>(6);

  // UI state
  loading = signal(true);
  error = signal<string | null>(null);
  skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  // icons
  iActivity = Activity;
  iBrain = Brain;
  iArrowRight = ArrowRight;

  private servicios$ = this.api.listPublished().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
    catchError((err) => {
      console.error(err);
      this.error.set('No se pudieron cargar los servicios.');
      return of([] as Servicio[]);
    }),
    finalize(() => this.loading.set(false)),
  );

  servicios = toSignal(this.servicios$, { initialValue: [] as Servicio[] });

  cards = computed<CardVM[]>(() => {
    const rows = this.servicios() ?? [];

    // Si tu API ya viene ordenada, puedes quitar el sort.
    const sorted = [...rows].sort((a, b) =>
      (a.card_title ?? '').localeCompare(b.card_title ?? ''),
    );

    const take = Math.max(1, this.max());
    return sorted.slice(0, take).map((s) => ({
      title: s.card_title ?? 'Servicio',
      description: s.card_description ?? '',
      slug: s.slug ?? '',
      icon: (s.card_icon === 'brain' ? 'brain' : 'activity') as 'brain' | 'activity',
    }));
  });

  trackBySlug = (_: number, c: CardVM) => c.slug || c.title;
}
