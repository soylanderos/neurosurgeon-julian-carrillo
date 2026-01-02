import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  LucideAngularModule,
  MapPin,
  Navigation,
  Phone,
  Clock,
  CheckCircle2,
  X,
  MessageCircle,
} from 'lucide-angular';

import { AppointmentsApi } from './data/appointments.api';

type ContactInfo = {
  officeName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postal?: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeHours: string;
  mapsUrl: string;

  /** Opcional: pega aquí un embed de Google Maps (iframe src) */
  mapsEmbedSrc?: string;
};

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private fb = inject(FormBuilder);
  private appointmentsApi = inject(AppointmentsApi);

  // =========================================================
  // ✅ Pega aquí tus datos NUEVOS y correctos (1 sola vez)
  // =========================================================
  readonly CONTACT: ContactInfo = {
    officeName: '',
    addressLine1: 'Av. Campos Eliseos No. 9371 Fracc. Campos Eliseos',
    addressLine2: 'Piso 6, Consultorio 675 ',
    city: 'Cd. Juárez',
    state: 'Chihuahua',
    postal: 'C.P. 32420',
    phone: '+52 656 638 9017',
    whatsapp: '526566389017',
    email: 'jucarrillo@hotmail.com',
    officeHours: 'Lun–Vie 10:00–13:00 · Sáb 10:00–14:00',
    mapsUrl: 'https://maps.app.goo.gl/y3LLNxPW2osvtZ5a8',

    // Si tienes embed (src del iframe) pégalo aquí:
    mapsEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d108673.46056521045!2d-106.4955776!3d31.659971!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86e75d6a0412e8df%3A0xf2bd928c444ce59f!2sDr.%20Juli%C3%A1n%20Octavio%20Carrillo%20Gonz%C3%A1lez%2C%20Neurocirujano!5e0!3m2!1ses-419!2smx!4v1767319609311!5m2!1ses-419!2smx'
  };

  // ===== Derivados para template
  get phone() {
    return this.CONTACT.phone;
  }
  get email() {
    return this.CONTACT.email;
  }
  get officeHours() {
    return this.CONTACT.officeHours;
  }
  get mapsUrl() {
    return this.CONTACT.mapsUrl;
  }

  get fullAddress() {
    const p1 = this.CONTACT.addressLine1;
    const p2 = this.CONTACT.addressLine2 ? `, ${this.CONTACT.addressLine2}` : '';
    const postal = this.CONTACT.postal ? `, ${this.CONTACT.postal}` : '';
    return `${this.CONTACT.officeName} ${p1}${p2}, ${this.CONTACT.city}, ${this.CONTACT.state}${postal}`;
  }

  get telUrl() {
    const digits = this.CONTACT.phone.replace(/[^\d+]/g, '');
    return `tel:${digits}`;
  }

  get whatsappUrl() {
    const digits = this.CONTACT.whatsapp.replace(/[^\d]/g, '');
    const msg = 'Hola, me gustaría agendar una consulta. ¿Me pueden apoyar por favor?';
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  }

  get mapEmbedUrl(): SafeResourceUrl | null {
    if (!this.CONTACT.mapsEmbedSrc) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.CONTACT.mapsEmbedSrc);
  }

  // ===== Toast
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('Listo');
  readonly toastDesc = signal('Acción completada.');

  // ===== Form state
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly form = this.fb.group({
    full_name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    phone: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
    email: this.fb.nonNullable.control('', [Validators.email]),
    preferred_date: this.fb.nonNullable.control(''),
    preferred_time: this.fb.nonNullable.control(''),
    reason: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
    notes: this.fb.nonNullable.control(''),
  });

  // ===== Icons
  readonly iMapPin = MapPin;
  readonly iNav = Navigation;
  readonly iPhone = Phone;
  readonly iClock = Clock;
  readonly iOk = CheckCircle2;
  readonly iX = X;
  readonly iWhatsapp = MessageCircle;

  showErr(name: keyof typeof this.form.controls) {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  async submit() {
    this.submitError.set(null);
    if (!this.isBrowser) return;

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    try {
      this.submitting.set(true);

      const v = this.form.getRawValue();
      const payload = {
        full_name: v.full_name.trim(),
        phone: v.phone.trim(),
        email: (v.email || '').trim() || null,
        preferred_date: v.preferred_date || null,
        preferred_time: v.preferred_time || null,
        reason: v.reason.trim(),
        notes: (v.notes || '').trim() || null,
        source: 'website',
      };

      await this.appointmentsApi.create(payload);

      this.form.reset({
        full_name: '',
        phone: '',
        email: '',
        preferred_date: '',
        preferred_time: '',
        reason: '',
        notes: '',
      });

      this.openToast('Solicitud enviada', 'Te contactaremos para confirmar disponibilidad.');
    } catch (e: any) {
      console.error(e);
      this.submitError.set(e?.message ?? 'Ocurrió un error inesperado.');
    } finally {
      this.submitting.set(false);
    }
  }

  openToast(title: string, desc: string) {
    this.toastTitle.set(title);
    this.toastDesc.set(desc);
    this.toastOpen.set(true);

    if (this.isBrowser) {
      window.clearTimeout((this as any)._toastTimer);
      (this as any)._toastTimer = window.setTimeout(() => this.toastOpen.set(false), 2600);
    }
  }

  closeToast() {
    this.toastOpen.set(false);
  }

  async copyText(text: string) {
    try {
      if (!this.isBrowser) return;

      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      this.openToast('Copiado', 'Se copió correctamente.');
    } catch (err) {
      console.error(err);
      this.openToast('No se pudo copiar', 'Intenta de nuevo.');
    }
  }
}
