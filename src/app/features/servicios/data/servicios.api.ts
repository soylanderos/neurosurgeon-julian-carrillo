import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { from, map } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE } from '../../../shared/supabase/supabase.client';

export type FAQ = { question: string; answer: string };

export type Servicio = {
  slug: string;
  seo_title: string;
  seo_description: string;

  breadcrumb: string;
  title: string;
  subtitle: string;
  description: string;

  symptoms_title?: string | null;
  symptoms: string[];

  treatments_title?: string | null;
  treatments: string[];

  warning_text: string;
  faqs: FAQ[];

  card_title: string;
  card_description: string;
  card_icon: 'activity' | 'brain';
};

export type ServicioNavItem = {
  slug: string;
  card_title: string;
};


@Injectable({ providedIn: 'root' })
export class ServiciosApi {
  private http = inject(HttpClient);
  private base = `${environment.supabaseUrl}/rest/v1/servicios`;
  private sb = inject(SUPABASE) as SupabaseClient;

  private headers() {
    // Supabase REST requiere apikey. :contentReference[oaicite:6]{index=6}
    // Authorization Bearer también es común. :contentReference[oaicite:7]{index=7}
    return new HttpHeaders({
      apikey: environment.supabaseAnonKey,
      Authorization: `Bearer ${environment.supabaseAnonKey}`,
    });
  }

  listPublished() {
    const url =
      `${this.base}?select=slug,card_title,card_description,card_icon,seo_title,seo_description,breadcrumb,title,subtitle,description,symptoms_title,symptoms,treatments_title,treatments,warning_text,faqs` +
      `&published=eq.true&order=created_at.asc`;

    return this.http.get<Servicio[]>(url, { headers: this.headers() });
  }

  getBySlug(slug: string) {
    const url =
      `${this.base}?select=slug,seo_title,seo_description,breadcrumb,title,subtitle,description,symptoms_title,symptoms,treatments_title,treatments,warning_text,faqs` +
      `&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`;

    return this.http.get<Servicio[]>(url, { headers: this.headers() });
  }

  listSlugs() {
    const url = `${this.base}?select=slug&published=eq.true`;
    return this.http.get<Array<{ slug: string }>>(url, { headers: this.headers() });
  }

  listNav() {
    return from(
      this.sb
        .from('servicios')
        .select('slug, card_title')
        .order('card_title', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as ServicioNavItem[];
      }),
    );
  }
}
