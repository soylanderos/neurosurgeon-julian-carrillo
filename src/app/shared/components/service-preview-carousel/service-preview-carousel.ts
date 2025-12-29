import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, shareReplay } from 'rxjs';

import {
  LucideAngularModule,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Activity,
  Brain,
} from 'lucide-angular';
import { Servicio, ServiciosApi } from '../../../features/servicios/data/servicios.api';

type CardVM = {
  title: string;
  description: string;
  slug: string;
  icon: 'activity' | 'brain';
  tone: 'sky' | 'sand'; // para alternar colores como en tu referencia
};

@Component({
  selector: 'app-service-preview-carousel',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './service-preview-carousel.html',
  styleUrls: ['./service-preview-carousel.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePreviewCarouselComponent {
  private api = inject(ServiciosApi);

  // inputs
  perView = input<number>(2); // desktop default
  max = input<number>(8);

  // state
  loading = signal(true);
  error = signal<string | null>(null);
  index = signal(0);

  // icons
  iLeft = ChevronLeft;
  iRight = ChevronRight;
  iArrow = ArrowRight;
  iActivity = Activity;
  iBrain = Brain;

  private servicios$ = this.api.listPublished().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
    catchError((err) => {
      console.error(err);
      this.error.set('No se pudieron cargar los servicios.');
      return of([] as Servicio[]);
    }),
    finalize(() => this.loading.set(false))
  );

  servicios = toSignal(this.servicios$, { initialValue: [] as Servicio[] });

  cards = computed<CardVM[]>(() => {
    const rows = [...(this.servicios() ?? [])];

    const sorted = rows.sort((a, b) => (a.card_title ?? '').localeCompare(b.card_title ?? ''));

    const take = Math.max(1, this.max());
    return sorted.slice(0, take).map((s, i) => ({
      title: s.card_title ?? 'Servicio',
      description: s.card_description ?? '',
      slug: s.slug ?? '',
      icon: (s.card_icon === 'brain' ? 'brain' : 'activity') as 'brain' | 'activity',
      tone: i % 2 === 0 ? 'sky' : 'sand',
    }));
  });

  // responsive perView (mobile = 1)
  perViewActual = signal(2);

  constructor() {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia?.('(max-width: 1023px)');
    const apply = () => this.perViewActual.set(mq?.matches ? 1 : this.perView());
    apply();
    mq?.addEventListener?.('change', apply);
  }

  maxIndex = computed(() => {
    const pv = Math.max(1, this.perViewActual());
    const len = this.cards().length;
    return Math.max(0, len - pv);
  });

  visibleCards = computed(() => {
    const start = Math.min(this.index(), this.maxIndex());
    const pv = Math.max(1, this.perViewActual());
    return this.cards().slice(start, start + pv);
  });

  canPrev = computed(() => this.index() > 0);
  canNext = computed(() => this.index() < this.maxIndex());

  prev() {
    this.index.update((x) => Math.max(0, x - 1));
  }

  next() {
    this.index.update((x) => Math.min(this.maxIndex(), x + 1));
  }

  trackBySlug = (_: number, c: CardVM) => c.slug || c.title;
}
