// src/app/features/about/about.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LucideAngularModule, Brain, GraduationCap, Award, Heart, Languages, Building2, BookOpen } from 'lucide-angular';
import { SeoService } from '../../../shared/seo/seo.service';
import type { DoctorProfile } from '../data/doctor-profile.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  // icons
  iBrain = Brain;
  iGraduationCap = GraduationCap;
  iAward = Award;
  iHeart = Heart;
  iLanguages = Languages;
  iBuilding2 = Building2;
  iBookOpen = BookOpen;

  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

  profile = signal<DoctorProfile>(this.route.snapshot.data['profile']);

  constructor() {
    const p = this.profile();

    // JSON-LD (puedes afinarlo luego)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Physician',
      name: p.name,
      medicalSpecialty: 'Neurosurgery',
      description: p.seo_description,
      areaServed: 'Ciudad Juárez, Chihuahua',
      availableLanguage: p.languages ?? 'Español',
      url: p.canonical ?? undefined,
    };

    this.seo.set({
      title: p.seo_title,
      description: p.seo_description,
      canonical: p.canonical ?? undefined,
      og: {
        title: p.og_title ?? p.seo_title,
        description: p.og_description ?? p.seo_description,
        image: p.og_image ?? undefined,
        type: 'profile',
        locale: 'es_MX',
      },
      twitter: { card: p.og_image ? 'summary_large_image' : 'summary' },
      jsonLd,
    });
  }
}
