// home.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

// Ajusta el import al path real de tu componente
// Si tu ServiceCards es standalone, esto jala perfecto.
import {
  LucideAngularModule,
  CalendarCheck,
  Phone,
  MapPin,
  Brain,
  BadgeCheck,
  ChevronDown,
  Stethoscope,
  User,
  Plus,
  Activity,
  ArrowBigRight
} from 'lucide-angular';

// Si no existe "Bone" en tu versión, usa "Bone" si está o "Backpack" no; mejor:
// en lucide suele ser "Bone" o "BoneIcon" dependiendo wrapper.
// Si no te compila, cámbialo por "Activity" o "HeartPulse".
import { Bone } from 'lucide-angular';
@Component({
  selector: 'app-hero',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private title = inject(Title);
  private meta = inject(Meta);

  phoneUrl = 'tel:+52XXXXXXXXXX';

  iCalendar = CalendarCheck;
  iPhone = Phone;
  iWhatsapp = Activity; // cámbialo por icono WhatsApp si usas uno custom
  iMapPin = MapPin;
  iBrain = Brain;
  iBone = Bone;
  iBadgeCheck = BadgeCheck;
  iChevronDown = ChevronDown;
  iStethoscope = Stethoscope;
  iUser = User;
  iPlus = Plus;
  iPulse = Activity; // o HeartPulse si lo tienes
  iArrowRight = ArrowBigRight
  readonly pageTitle =
    'Dr. Julián Carrillo - Neurocirujano Especialista en Cerebro y Columna | Ciudad Juárez';

  readonly pageDescription =
    'Neurocirujano certificado en Ciudad Juárez especializado en tratamiento de columna vertebral y cerebro. Atención personalizada para hernia de disco, ciática y más. Agenda tu consulta hoy.';

  readonly processSteps: ProcessStep[] = [
    {
      number: '1',
      title: 'Agenda tu cita',
      description: 'Contacta por WhatsApp o teléfono para agendar tu primera consulta.',
    },
    {
      number: '2',
      title: 'Evaluación inicial',
      description: 'Revisión completa de tu caso, síntomas y estudios previos.',
    },
    {
      number: '3',
      title: 'Plan de tratamiento',
      description: 'Explicación clara de opciones de tratamiento adaptadas a tu caso.',
    },
    {
      number: '4',
      title: 'Seguimiento continuo',
      description: 'Acompañamiento durante todo el proceso de recuperación.',
    },
  ];

  readonly symptoms: string[] = [
    'Dolor de espalda que no mejora con reposo',
    'Hormigueo o entumecimiento en brazos o piernas',
    'Debilidad en extremidades',
    'Dolor que se irradia hacia las piernas (ciática)',
    'Dolor de cuello persistente',
    'Dolores de cabeza intensos o frecuentes',
  ];

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

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

type TrustItem = {
  key: string;
  label: string;
  value: string;
  icon: 'award' | 'graduation' | 'shield' | 'filecheck';
};
