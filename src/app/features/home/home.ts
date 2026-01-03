// home.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

// Ajusta el import al path real de tu componente
// Si tu ServiceCards es standalone, esto jala perfecto.
import { LucideAngularModule, CalendarCheck, MessageCircle, ChevronRight } from 'lucide-angular';
import { Hero } from '../../shared/components/hero/hero';
import { TrustStripComponent } from '../../shared/components/trust-strip/trust-strip';
import { ServicePreview } from '../../shared/components/service-preview/service-preview';
import { Symptoms } from '../../shared/components/symptoms/symptoms';
import { AboutPreview } from '../../shared/components/about-preview/about-preview';
import { Process } from '../../shared/components/process/process';
import { TestimonialsPreviewComponent } from '../../shared/components/testimonials-preview/testimonials-preview';
import { CtaSection } from '../../shared/components/cta-section/cta-section';

export type TrustItem = {
  key: 'cedula' | 'cert' | 'hosp' | 'exp';
  label: string;
  value: string; // headline (lo grande)
  icon: 'award' | 'graduation' | 'shield' | 'filecheck';
  href?: string;
  hrefLabel?: string;

  // NUEVO: lista de valores (chips)
  details?: string[];
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LucideAngularModule,
    Hero,
    TrustStripComponent,
    ServicePreview,
    Symptoms,
    AboutPreview,
    Process,
    TestimonialsPreviewComponent,
    CtaSection,
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

  trustItems: TrustItem[] = [
    {
      key: 'cedula',
      label: 'Cédulas',
      value: '3 registros',
      icon: 'filecheck',
      href: 'https://www.cedulaprofesional.sep.gob.mx/',
      hrefLabel: 'Verificar en SEP',
      details: ['Cédula Profesional: 1793525', 'Certificado CMCN No. 492', 'Céd. Esp. AECM-14225'],
    },
    {
      key: 'cert',
      label: 'Consejos / Certificaciones',
      value: 'CMCN',
      icon: 'award',
      href: 'https://wa.me/526566389017?text=Hola%2C%20%C2%BFme%20pueden%20compartir%20la%20constancia%20de%20certificaci%C3%B3n%20del%20Dr.%20Juli%C3%A1n%20Carrillo%20(Consejo%20/CMCN)%20y%20vigencia%3F',
      hrefLabel: 'Solicitar constancia',
      details: [
        'Certificado por el CMCN',
        'Asistencia continua a congresos nacionales e internacionales',
      ],
    },
    {
      key: 'hosp',
      label: 'Hospitales / Sedes',
      value: 'Hospital Ángeles',
      icon: 'shield',
      href: '#locations',
      hrefLabel: 'Ver ubicaciones',
      details: [
        'Hospital Ángeles Cd. Juárez (Consultorio 675)',
         'Hospital General de la Zona No. 6 IMSS (experiencia)',
      ],
    },
    {
      key: 'exp',
      label: 'Experiencia',
      value: '27 años',
      icon: 'graduation',
      details: [
        'Enfoque: Neurocirugía Cerebro & Columna',
        'Técnicas: abordajes mínimamente invasivos + neuronavegación',
      ],
    },
  ];

  ngOnInit() {
    // Equivalente a Next metadata
    this.title.setTitle(this.pageTitle);
    this.meta.updateTag({ name: 'description', content: this.pageDescription });

    // OG tags básicos
    this.meta.updateTag({
      property: 'og:title',
      content: 'Dr. Julián Carrillo - Neurocirujano Especialista',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Atención profesional en neurocirugía de cerebro y columna vertebral en Ciudad Juárez.',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_MX' });
  }

  trackByIndex = (i: number) => i;
}
