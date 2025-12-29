// src/app/features/about/data/doctor-profile.model.ts
export type DoctorProfile = {
  slug: string;

  seo_title: string;
  seo_description: string;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  canonical?: string | null;

  name: string;
  professional_title: string;
  intro: string;

  cedula?: string | null;
  university?: string | null;
  certifications?: string | null;

  academic_background?: string | null;
  care_approach?: string | null;
  hospitals?: string | null;
  languages?: string | null;

  specializations: string[];
};
