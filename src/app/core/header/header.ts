// src/app/shared/layout/header/header.ts
import { Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { ServiciosApi } from '../../features/servicios/data/servicios.api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Menu,
  X,
  ChevronDown,
  CalendarCheck,
  Phone,
  MessageCircle,
} from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  private api = inject(ServiciosApi);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  mobileMenuOpen = signal(false);
  servicesOpen = signal(false);

  loadingServicios = signal(true);
  serviciosError = signal<string | null>(null);

  // ✅ señal con data del dropdown
  serviciosNav = toSignal(
    this.api.listNav().pipe(
      catchError((err) => {
        this.serviciosError.set('No se pudieron cargar los servicios.');
        return of([]); // fallback vacío
      }),
      finalize(() => this.loadingServicios.set(false)),
    ),
    { initialValue: [] },
  );

  constructor() {
    // ✅ UX: al navegar, cierra menús (evita “menú atorado” y glitches)
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeMobileMenu());
  }

  // SSR safe
  @HostListener('window:resize')
  onResize() {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 1024) this.closeMobileMenu();
  }

  // lucide icons
  iMenu = Menu;
  iX = X;
  iChevron = ChevronDown;
  iCalendar = CalendarCheck;
  iPhone = Phone;
  iWhats = MessageCircle;

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
    if (!this.mobileMenuOpen()) this.servicesOpen.set(false);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    this.servicesOpen.set(false);
  }

  toggleServices() {
    this.servicesOpen.update(v => !v);
  }

  // Opcional: CTA links
  whatsappUrl = 'https://wa.me/52XXXXXXXXXX';
  phoneUrl = 'tel:+52XXXXXXXXXX';
}
