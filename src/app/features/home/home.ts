// home.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

// Ajusta el import al path real de tu componente
// Si tu ServiceCards es standalone, esto jala perfecto.
import { ServiceCardsComponent } from '../../shared/components/service-cards/service-cards';
import { LucideAngularModule, CalendarCheck, MessageCircle, ChevronRight } from 'lucide-angular';
import { Hero } from "../../shared/components/hero/hero";
import { TrustStripComponent } from '../../shared/components/trust-strip/trust-strip';
import { ServicePreview } from '../../shared/components/service-preview/service-preview';
import { ServicePreviewCarouselComponent } from '../../shared/components/service-preview-carousel/service-preview-carousel';
import { Symptoms } from "../../shared/components/symptoms/symptoms";
import { AboutPreview } from "../../shared/components/about-preview/about-preview";
import { Process } from "../../shared/components/process/process";
import {  TestimonialsPreviewComponent } from "../../shared/components/testimonials-preview/testimonials-preview";
import { CtaSection } from '../../shared/components/cta-section/cta-section';





type TrustItem = {
  key: string;
  label: string;
  value: string;
  icon: 'award' | 'graduation' | 'shield' | 'filecheck';
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule,
    Hero,
    TrustStripComponent,
    ServicePreview,
    Symptoms,
    AboutPreview,
    Process,
    TestimonialsPreviewComponent, CtaSection
],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private title = inject(Title);
  private meta = inject(Meta);

  doctorId = 87771;

  iCalendar = CalendarCheck;
  iWhatsapp = MessageCircle;
  iChevronRight = ChevronRight;


  readonly pageTitle =
    'Dr. Julián Carrillo - Neurocirujano Especialista en Cerebro y Columna | Ciudad Juárez';

  readonly pageDescription =
    'Neurocirujano certificado en Ciudad Juárez especializado en tratamiento de columna vertebral y cerebro. Atención personalizada para hernia de disco, ciática y más. Agenda tu consulta hoy.';




  readonly consultationCards = [
    { title: 'Consulta Especializada', desc: 'Evaluación completa y diagnóstico preciso' },
    { title: 'Segunda Opinión', desc: 'Análisis profesional de tu caso' },
    { title: 'Plan Personalizado', desc: 'Tratamiento adaptado a tus necesidades' },
  ];

  readonly trustItems: TrustItem[] = [
    { key: 'cedula', label: 'Cédula Profesional', value: '[Número]', icon: 'award' },
    { key: 'cert', label: 'Certificaciones', value: '[Consejos]', icon: 'graduation' },
    { key: 'hosp', label: 'Hospitales', value: '[Nombres]', icon: 'shield' },
    { key: 'exp', label: 'Experiencia', value: '[X] años', icon: 'filecheck' },
  ];

  ngOnInit() {
    // Equivalente a Next metadata
    this.title.setTitle(this.pageTitle);
    this.meta.updateTag({ name: 'description', content: this.pageDescription });

    // OG tags básicos
    this.meta.updateTag({ property: 'og:title', content: 'Dr. Julián Carrillo - Neurocirujano Especialista' });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Atención profesional en neurocirugía de cerebro y columna vertebral en Ciudad Juárez.',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_MX' });
  }

  trackByIndex = (i: number) => i;
}
