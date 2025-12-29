import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule, MapPin, Navigation, Phone, Mail, Clock, CheckCircle2, X, ExternalLink, ArrowRight, MessageCircle } from 'lucide-angular';

import { AppointmentsApi } from './data/appointments.api';

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

  // ====== Datos (ajusta)
  readonly addressLine1 = 'Consultorio de Neurocirugía';
  readonly city = 'Ciudad Juárez, Chihuahua';
  readonly postal = 'C.P. 00000';
  readonly phone = '+52 000 000 0000';
  readonly whatsapp = '+52 000 000 0000';
  readonly email = 'contacto@tudominio.com';
  readonly mapsUrl = 'https://maps.app.goo.gl/y3LLNxPW2osvtZ5a8';

  // Si luego consigues embed real:
  readonly mapEmbedUrl: SafeResourceUrl | null = null;

  // ====== Toast
  readonly toastOpen = signal(false);
  readonly toastTitle = signal('Listo');
  readonly toastDesc = signal('Acción completada.');

  // ====== Form state
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly form = this.fb.group({
    full_name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    phone: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
    email: this.fb.nonNullable.control('', [Validators.email]),
    preferred_date: this.fb.nonNullable.control(''), // YYYY-MM-DD
    preferred_time: this.fb.nonNullable.control(''), // HH:mm
    reason: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
    notes: this.fb.nonNullable.control(''),
  });

  // ====== Links derivados
  get telUrl() {
    const digits = this.phone.replace(/[^\d+]/g, '');
    return `tel:${digits}`;
  }

  get whatsappUrl() {
    const digits = this.whatsapp.replace(/[^\d]/g, '');
    return `https://wa.me/${digits}?text=${encodeURIComponent('Hola, me gustaría agendar una consulta. ¿Me pueden apoyar por favor?')}`;
  }

  get mailtoUrl() {
    const subject = encodeURIComponent('Solicitud de cita');
    const body = encodeURIComponent('Hola, me gustaría agendar una consulta. Comparto mi nombre y motivo de consulta:');
    return `mailto:${this.email}?subject=${subject}&body=${body}`;
  }

  get fullAddress() {
    return `${this.addressLine1} — ${this.city} — ${this.postal}`;
  }

  // ====== Icons
  readonly iMapPin = MapPin;
  readonly iNav = Navigation;
  readonly iPhone = Phone;
  readonly iMail = Mail;
  readonly iClock = Clock;
  readonly iOk = CheckCircle2;
  readonly iX = X;
  readonly iExternal = ExternalLink;
  readonly iArrow = ArrowRight;
  readonly iWhats = MessageCircle;

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

      // Normaliza opcionales
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
