import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export type TestimonioRow = {
  id: number;
  name: string;
  condition: string;
  text: string;
  rating: number;
  published_at: string; // ISO date
  is_published: boolean;
  sort_order: number;
};

@Injectable({ providedIn: 'root' })
export class TestimoniosApi {
  private http = inject(HttpClient);

  private baseUrl = `${environment.supabaseUrl}/rest/v1/testimonios`;
  private headers = new HttpHeaders({
    apikey: environment.supabaseAnonKey,
    Authorization: `Bearer ${environment.supabaseAnonKey}`,
  });

  listPublished() {
    const params = new HttpParams()
      .set('select', 'id,name,condition,text,rating,published_at,sort_order')
      .set('is_published', 'eq.true')
      .set('order', 'sort_order.asc,published_at.desc');

    return this.http.get<TestimonioRow[]>(this.baseUrl, { headers: this.headers, params });
  }
}
