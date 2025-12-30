import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { BlogApi } from '../data/blog.api';

// lucide
import { LucideAngularModule, Clock, Calendar, Tag, ArrowLeft, Link as LinkIcon } from 'lucide-angular';

type BlogPost = {
  slug: string;
  title: string;
  excerpt?: string;
  tag: string;
  read_time: string;
  published_at: string; // ISO
  // Ajusta estos campos a lo que te devuelva el backend:
  content_html?: string;     // ideal si tu backend ya entrega HTML sanitizado
  content?: string;          // si te entrega texto/markdown (en ese caso conviene render markdown)
  cover_image_url?: string;  // opcional
};

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail {
  private api = inject(BlogApi);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  // icons
  readonly iClock = Clock;
  readonly iCalendar = Calendar;
  readonly iTag = Tag;
  readonly iBack = ArrowLeft;
  readonly iLink = LinkIcon;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly slug = signal<string>('');
  readonly post = signal<BlogPost | null>(null);

  // Para “Más artículos”
  readonly allPosts = signal<BlogPost[]>([]);

  readonly safeHtml = computed<SafeHtml>(() => {
    const p = this.post();
    const html =
      p?.content_html ??
      (p?.content ? `<p>${this.escapeHtml(p.content).replace(/\n\n+/g, '</p><p>')}</p>` : '');
    // OJO: bypassSecurityTrustHtml asume que tu HTML es confiable/sanitizado.
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  readonly related = computed(() => {
    const p = this.post();
    if (!p) return [];
    return this.allPosts()
      .filter(x => x.slug !== p.slug && x.tag === p.tag)
      .slice(0, 3);
  });

  constructor() {
    // escucha cambios de slug en la ruta
    this.route.paramMap.subscribe((pm) => {
      const slug = pm.get('slug') ?? '';
      this.slug.set(slug);
      this.load(slug);
    });

    // carga lista para “Más artículos” (y fallback si no hay getBySlug)
    this.api.listPublished().subscribe({
      next: (rows) => this.allPosts.set(rows as BlogPost[]),
      error: () => {
        // no bloqueamos el detail por esto, pero ayuda a related
        this.allPosts.set([]);
      },
    });

    // si cambias slug, limpia estado visual rápido
    effect(() => {
      this.slug();
      this.error.set(null);
      this.post.set(null);
      this.loading.set(true);
    });
  }

  private load(slug: string) {
    if (!slug) {
      this.error.set('Slug inválido.');
      this.loading.set(false);
      return;
    }

    // Si tu BlogApi ya tiene getBySlug / getPublishedBySlug / etc, úsalo aquí.
    const apiAny = this.api as any;
    const getter =
      apiAny.getBySlug?.bind(this.api) ??
      apiAny.getPublishedBySlug?.bind(this.api) ??
      apiAny.detail?.bind(this.api);

    if (getter) {
      getter(slug).subscribe({
        next: (row: BlogPost) => {
          this.post.set(row);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar este artículo.');
          this.loading.set(false);
        },
      });
      return;
    }

    // Fallback: usa listPublished y filtra en cliente
    this.api.listPublished().subscribe({
      next: (rows) => {
        const found = (rows as BlogPost[]).find(p => p.slug === slug) ?? null;
        if (!found) this.error.set('Artículo no encontrado.');
        this.post.set(found);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar este artículo.');
        this.loading.set(false);
      },
    });
  }

  formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // mini feedback “sin drama”
      this.toast('Link copiado ✅');
    } catch {
      this.toast('No se pudo copiar el link 😅');
    }
  }

  // mini toast ultra simple (sin lib)
  private toast(msg: string) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.className =
      'fixed left-1/2 top-6 -translate-x-1/2 z-[9999] rounded-full bg-[#0E2859] text-white px-4 py-2 text-sm font-extrabold shadow-lg';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  private escapeHtml(s: string) {
    return s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
