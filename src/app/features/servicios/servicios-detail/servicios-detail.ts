// src/app/features/servicios/servicios-detail/servicios-detail.ts
import { Component, inject, signal, effect, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of, finalize, shareReplay, tap } from 'rxjs';

import { Servicio, ServiciosApi } from '../data/servicios.api';

@Component({
  standalone: true,
  selector: 'app-servicios-detail',
  imports: [RouterLink],
  templateUrl: './servicios-detail.html',
})
export class ServicioDetail {
  private route = inject(ActivatedRoute);
  private api = inject(ServiciosApi);
  private title = inject(Title);
  private meta = inject(Meta);

  loading = signal(true);
  error = signal<string | null>(null);

  skeletonLines = Array.from({ length: 6 }, (_, i) => i);

  // ✅ fragment observable como signal (para scroll al cargar/cambiar)
  fragment = toSignal(this.route.fragment, { initialValue: null as string | null });

  private servicioStream$ = this.route.paramMap.pipe(
    map((pm) => pm.get('slug') || ''),
    tap(() => {
      // 🔥 importante para navegación entre slugs
      this.loading.set(true);
      this.error.set(null);
    }),
    switchMap((slug) =>
      this.api.getBySlug(slug).pipe(
        map((rows) => rows?.[0] ?? null),
        catchError((err) => {
          console.error(err);
          this.error.set('No se pudo cargar el servicio. Intenta de nuevo.');
          return of(null as Servicio | null);
        }),
        finalize(() => this.loading.set(false)),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  servicio = toSignal(this.servicioStream$, { initialValue: null as Servicio | null });

  // Defaults seguros (por si vienen null)
  symptomsTitle = computed(() => this.servicio()?.symptoms_title || 'Síntomas comunes');
  treatmentsTitle = computed(() => this.servicio()?.treatments_title || 'Opciones de tratamiento');

  constructor() {
    // ✅ SEO reactivo
    effect(() => {
      const s = this.servicio();
      if (!s) return;

      const seoTitle = s.seo_title || s.title || 'Servicio';
      const seoDesc = s.seo_description || s.subtitle || '';

      this.title.setTitle(seoTitle);
      this.meta.updateTag({ name: 'description', content: seoDesc });

      this.meta.updateTag({ property: 'og:title', content: seoTitle });
      this.meta.updateTag({ property: 'og:description', content: seoDesc });
    });

    // ✅ Scroll a fragment (cuando cambie, o cuando cargas la ruta con #)
    effect(() => {
      const frag = this.fragment();
      if (!frag) return;

      // SSR-safe
      if (typeof document === 'undefined') return;

      // esperamos el render del DOM (micro delay)
      queueMicrotask(() => {
        const el = document.getElementById(frag);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
}
