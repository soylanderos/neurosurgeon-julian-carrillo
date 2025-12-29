// src/app/shared/layout/footer/footer.ts
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';

import { ServiciosApi } from '../../features/servicios/data/servicios.api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  private api = inject(ServiciosApi);
  private destroyRef = inject(DestroyRef);

  // year helper
  currentYear = () => new Date().getFullYear();

  // contacto (ajusta a tus datos reales)
  whatsappUrl = 'https://wa.me/52XXXXXXXXXX';
  phoneUrl = 'tel:+52XXXXXXXXXX';
  phoneLabel = '+52 (XXX) XXX-XXXX';
  email = 'contacto@tudominio.com';

  // socials (ajusta)
  facebookUrl = 'https://facebook.com';
  instagramUrl = 'https://instagram.com';

  // servicios
  loadingServicios = signal(true);
  serviciosError = signal<string | null>(null);

  private servicios$ = this.api.listNav().pipe(
    catchError((err) => {
      console.error(err);
      this.serviciosError.set('No se pudieron cargar los servicios.');
      return of([] as any[]);
    }),
    finalize(() => this.loadingServicios.set(false)),
    takeUntilDestroyed(this.destroyRef),
  );

  serviciosNav = toSignal(this.servicios$, { initialValue: [] as any[] });

  // footer: muestra máximo 6 y ordena por title
  serviciosFooter = computed(() =>
    [...this.serviciosNav()]
      .sort((a, b) => (a.card_title ?? '').localeCompare(b.card_title ?? ''))
      .slice(0, 6),
  );
}
