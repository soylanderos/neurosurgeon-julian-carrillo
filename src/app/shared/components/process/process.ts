import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  CalendarCheck,
  ClipboardList,
  Stethoscope,
  Activity,
  ChevronRight,
} from 'lucide-angular';

type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: 'calendar' | 'clipboard' | 'stethoscope' | 'followup';
};

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './process.html',
  styleUrl: './process.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Process {
  iCalendar = CalendarCheck;
  iClipboard = ClipboardList;
  iStetho = Stethoscope;
  iFollow = Activity;
  iChevron = ChevronRight;

  readonly processSteps: ProcessStep[] = [
    {
      number: '1',
      title: 'Agenda tu cita',
      description: 'WhatsApp o teléfono para tu primera consulta.',
      icon: 'calendar',
    },
    {
      number: '2',
      title: 'Evaluación inicial',
      description: 'Revisión completa de síntomas y estudios previos.',
      icon: 'clipboard',
    },
    {
      number: '3',
      title: 'Plan de tratamiento',
      description: 'Opciones claras adaptadas a tu caso.',
      icon: 'stethoscope',
    },
    {
      number: '4',
      title: 'Seguimiento continuo',
      description: 'Acompañamiento durante tu recuperación.',
      icon: 'followup',
    },
  ];

  trackByKey = (_: number, s: ProcessStep) => s.number;
}
