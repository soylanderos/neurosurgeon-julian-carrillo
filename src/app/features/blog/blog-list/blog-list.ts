import { Component, computed, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BlogApi } from '../data/blog.api';

// lucide (si lo tienes)
import { LucideAngularModule, Clock, Calendar, Tag } from 'lucide-angular';

type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  read_time: string;
  published_at: string; // ISO
};

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './blog-list.html',
  styleUrls: ['./blog-list.css'],
})
export class BlogList {
  private api = inject(BlogApi);

  // icons
  readonly iClock = Clock;
  readonly iCalendar = Calendar;
  readonly iTag = Tag;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly posts = signal<BlogListItem[]>([]);
  readonly selectedTag = signal<string>('Todos');

  readonly tags = computed(() => {
    const uniq = Array.from(new Set(this.posts().map(p => p.tag))).sort();
    return ['Todos', ...uniq];
  });

  readonly filteredPosts = computed(() => {
    const tag = this.selectedTag();
    if (tag === 'Todos') return this.posts();
    return this.posts().filter(p => p.tag === tag);
  });

  constructor() {
    // carga inicial
    this.api.listPublished().subscribe({
      next: (rows) => {
        this.posts.set(rows as BlogListItem[]);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('No se pudieron cargar los artículos.');
        this.loading.set(false);
        console.error(e);
      },
    });

    // Si el tag seleccionado deja de existir (por cambio de data), resetea
    effect(() => {
      const tag = this.selectedTag();
      const list = this.tags();
      if (!list.includes(tag)) this.selectedTag.set('Todos');
    });
  }

  setTag(tag: string) {
    this.selectedTag.set(tag);
  }

  trackBySlug(_: number, item: BlogListItem) {
    return item.slug;
  }

  formatDate(iso: string) {
    // simple: puedes cambiar por DatePipe si quieres
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
