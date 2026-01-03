import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideSupabase } from './shared/supabase/supabase.client';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { noTransferCacheInterceptor } from './core/interceptor/no-transfer-cache.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([noTransferCacheInterceptor])),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includeRequestsWithAuthHeaders: false,
        // si tu Angular lo soporta, esto es oro:
        filter: (req) => {
          // evita cachear llamadas a Supabase/PostgREST
          const url = req.url.toLowerCase();
          return !url.includes('supabase') && !url.includes('/rest/v1/');
        },
      })
    ),

    ...provideSupabase(),
  ],
};
