import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

export type BlogPostRow = {
  id: number;
  slug: string;
  seo_title: string;
  seo_description: string;
  title: string;
  excerpt: string;
  content_md: string;
  tag: string;
  read_time: string;
  published_at: string; // ISO date
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

@Injectable({ providedIn: 'root' })
export class BlogApi {
  private http = inject(HttpClient);

  private baseUrl = `${environment.supabaseUrl}/rest/v1/blog_posts`;
  private headers = new HttpHeaders({
    apikey: environment.supabaseAnonKey,
    Authorization: `Bearer ${environment.supabaseAnonKey}`,
  });

  listPublished() {
    const params = new HttpParams()
      .set('select', 'slug,title,excerpt,tag,read_time,published_at')
      .set('is_published', 'eq.true')
      .set('order', 'published_at.desc');

    return this.http.get<
      Pick<BlogPostRow, 'slug' | 'title' | 'excerpt' | 'tag' | 'read_time' | 'published_at'>[]
    >(this.baseUrl, { headers: this.headers, params });
  }

  listSlugs() {
    const params = new HttpParams()
      .set('select', 'slug')
      .set('is_published', 'eq.true');

    return this.http.get<Pick<BlogPostRow, 'slug'>[]>(
      this.baseUrl,
      { headers: this.headers, params }
    );
  }

  // ✅ Devuelve 1 post o null
  getBySlug(slug: string) {
    const params = new HttpParams()
      .set('select', 'slug,title,excerpt,tag,read_time,published_at,content_md')
      .set('slug', `eq.${slug}`)
      .set('is_published', 'eq.true')
      .set('limit', '1');

    return this.http
      .get<Pick<BlogPostRow,
        'slug'|'title'|'excerpt'|'tag'|'read_time'|'published_at'|'content_md'
      >[]>(this.baseUrl, { headers: this.headers, params })
      .pipe(map(rows => rows?.[0] ?? null));
  }
}
