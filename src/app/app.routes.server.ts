import { RenderMode, ServerRoute, PrerenderFallback } from '@angular/ssr';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ServiciosApi } from './features/servicios/data/servicios.api';
import { BlogApi } from './features/blog/data/blog.api';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'dr-julian-carrillo', renderMode: RenderMode.Prerender },

  { path: 'servicios', renderMode: RenderMode.Prerender },
  {
    path: 'servicios/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const api = inject(ServiciosApi);
      const rows: { slug: string }[] = await firstValueFrom(api.listSlugs());
      return rows.map((r: { slug: string }) => ({ slug: r.slug }));
    },
    fallback: PrerenderFallback.Server,
  },

  { path: 'blog', renderMode: RenderMode.Prerender },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const api = inject(BlogApi);
      const rows: { slug: string }[] = await firstValueFrom(api.listSlugs());
      return rows.map((r: { slug: string }) => ({ slug: r.slug }));
    },
    fallback: PrerenderFallback.Server,
  },

  { path: 'testimonios', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server },
];
