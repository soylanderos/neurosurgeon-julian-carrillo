// src/app/features/servicios/service-landing-template/service-landing-template.ts
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { FAQ } from '../data/servicios.data';

@Component({
  selector: 'app-service-landing-template',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-landing-template.html',
  styleUrls: ['./service-landing-template.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceLandingTemplateComponent {
  @Input({ required: true }) breadcrumb!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) subtitle!: string;
  @Input({ required: true }) description!: string;

  @Input() symptomsTitle = 'Síntomas comunes';
  @Input() symptoms: string[] = [];

  @Input() treatmentsTitle = 'Opciones de tratamiento';
  @Input() treatments: string[] = [];

  @Input() warningText = '';
  @Input() faqs: FAQ[] = [];

  @Input() whatsappLink = 'https://wa.me/526566389017';
  @Input() phoneLink = 'tel:+52XXXXXXXXXX';
}
