import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { DoctorProfileApi } from './features/about/data/doctor-profile.api';
import { firstValueFrom } from 'rxjs';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layout/layout').then(m => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then(m => m.Home),
        title: 'Home',
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/blog/blog-list/blog-list').then(m => m.BlogList),
        title: 'Blog',
      },
      {
        path: 'blog/:slug',
        loadComponent: () => import('./features/blog/blog-detail/blog-detail').then(m => m.BlogDetail),
        title: 'Artículo',
      },

      {
        path: 'contacto',
        loadComponent: () => import('./features/contacto/contacto').then(m => m.Contacto),
        title: 'Contacto',
      },
      {
        path: 'dr-julian-carrillo',
        loadComponent: () => import('./features/about/about/about').then(m => m.About),
        title: 'Sobre Mí',
        resolve: {
          profile: async () => {
            const api = inject(DoctorProfileApi);
            return firstValueFrom(api.getBySlug('dr-julian-carrillo'));
          },
        },
      },
      {
        path: 'servicios',
        children: [
          { path: '', loadComponent: () => import('./features/servicios/servicios-list/servicios-list').then(m => m.ServiciosList) },
          { path: ':slug', loadComponent: () => import('./features/servicios/servicios-detail/servicios-detail').then(m => m.ServicioDetail) },
        ],
      },
      {
        path: 'testimonios',
        loadComponent: () => import('./features/testimonios/testimonios-list/testimonios-list').then(m => m.TestiomoniosList),
        title: 'Testimonios',
      },

      // opcional: 404
      // {
      //   path: '**',
      //   loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound),
      //   title: 'Página no encontrada',
      // },
    ],
  },
];
