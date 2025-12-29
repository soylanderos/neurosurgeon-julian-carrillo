import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ServiciosApi } from './features/servicios/data/servicios.api';
import { BlogApi } from './features/blog/data/blog.api';

export const serverRoutes: ServerRoute[] = [
  // Home
  { path: '', renderMode: RenderMode.Prerender },


  // About Dr. Julian Carrillo
  { path: 'dr-julian-carrillo', renderMode: RenderMode.Prerender },

  // Servicios
  { path: 'servicios', renderMode: RenderMode.Prerender },
  {
    path: 'servicios/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const api = inject(ServiciosApi);
      const rows = await firstValueFrom(api.listSlugs());
      return rows.map(r => ({ slug: r.slug }));
    },
    fallback: PrerenderFallback.Server,
  },

  // Blog
  { path: 'blog', renderMode: RenderMode.Prerender },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const api = inject(BlogApi);
      const rows = await firstValueFrom(api.listSlugs());
      return rows.map(r => ({ slug: r.slug }));
    },
    fallback: PrerenderFallback.Server,
  },

  // Testimonios
  { path: 'testimonios', renderMode: RenderMode.Prerender },

  // Todo lo demás SSR
  { path: '**', renderMode: RenderMode.Server },
];
