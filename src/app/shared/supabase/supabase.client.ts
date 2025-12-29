import { InjectionToken, Provider } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export const SUPABASE = new InjectionToken<SupabaseClient>('SUPABASE_CLIENT');

export function provideSupabase(): Provider[] {
  return [
    {
      provide: SUPABASE,
      useFactory: () =>
        createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
          auth: {
            persistSession: false,        // ✅ SSR friendly (no localStorage)
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        }),
    },
  ];
}
