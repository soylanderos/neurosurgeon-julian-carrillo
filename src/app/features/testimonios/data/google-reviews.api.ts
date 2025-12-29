import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export type GoogleReviewItem = {
  author: string;
  authorUrl: string | null;
  authorPhoto: string | null;
  rating: number | null;
  relativeTime: string | null;
  publishTime: string | null;
  text: string;
  googleMapsUri: string | null;
};

export type GoogleReviewsResponse = {
  source: 'cache' | 'google';
  name: string | null;
  rating: number | null;
  userRatingCount: number | null;
  reviews: GoogleReviewItem[];
};

@Injectable({ providedIn: 'root' })
export class GoogleReviewsApi {
  private http = inject(HttpClient);

  getReviews(params: { lang?: string; max?: number; ttlHours?: number; placeId?: string }) {
    const url = `${environment.supabaseUrl}/functions/v1/google-reviews`;

    const headers = new HttpHeaders({
      'x-site-key': environment.siteKey, // 🔥 esto elimina el 401
    });

    return this.http.get<GoogleReviewsResponse>(url, { headers, params });
  }
}
