import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { BlogApi } from '../data/blog.api';
import {
  LucideAngularModule,
  Clock,
  Calendar,
  Tag,
  ArrowLeft,
  Link as LinkIcon,
} from 'lucide-angular';

import { marked } from 'marked';
import DOMPurify from 'dompurify';

type BlogPost = {
  slug: string;
  title: string;
  excerpt?: string;
  tag: string;
  read_time: string;
  published_at: string;
  content_md: string; // ✅ viene de la DB
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

  // ✅ por ahora: convierte markdown simple a párrafos (sin librería)
  readonly safeHtml = computed<SafeHtml>(() => {
    const md = this.post()?.content_md ?? '';
    const raw = marked.parse(md, { breaks: true }) as string; // ✅
    const clean = DOMPurify.sanitize(raw);
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  });

  readonly related = computed(() => {
    const p = this.post();
    if (!p) return [];
    return this.allPosts()
      .filter((x) => x.slug !== p.slug && x.tag === p.tag)
      .slice(0, 3);
  });

  constructor() {
    // ✅ importante: primero carga lista para “related”
    this.api.listPublished().subscribe({
      next: (rows) => this.allPosts.set(rows as unknown as BlogPost[]),
      error: () => this.allPosts.set([]),
    });

    this.route.paramMap.subscribe((pm) => {
      const slug = pm.get('slug') ?? '';
      this.slug.set(slug);
      this.load(slug);
    });

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

    this.api.getBySlug(slug).subscribe({
      next: (row) => {
        if (!row) {
          this.error.set('Artículo no encontrado.');
          this.loading.set(false);
          return;
        }

        this.post.set({
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          tag: row.tag,
          read_time: row.read_time,
          published_at: row.published_at,
          content_md: row.content_md,
        });

        this.loading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.error.set('No se pudo cargar este artículo.');
        this.loading.set(false);
      },
    });
  }

  formatDate(iso: string) {
    // fuerza a mediodía UTC para evitar brincar de día
    const d = new Date(iso + 'T12:00:00Z');
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.toast('Link copiado ✅');
    } catch {
      this.toast('No se pudo copiar el link 😅');
    }
  }

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
