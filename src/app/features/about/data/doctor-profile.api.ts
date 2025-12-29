// src/app/features/about/data/doctor-profile.api.ts
import { Injectable, TransferState, inject, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import type { DoctorProfile } from './doctor-profile.model';

const PROFILE_KEY = (slug: string) => makeStateKey<DoctorProfile>(`doctor_profile:${slug}`);

@Injectable({ providedIn: 'root' })
export class DoctorProfileApi {
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  private sb: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

  getBySlug(slug: string): Observable<DoctorProfile> {
    const key = PROFILE_KEY(slug);

    // ✅ Si ya está en TransferState (SSR -> cliente), no vuelvas a pedir
    if (this.transferState.hasKey(key)) {
      const cached = this.transferState.get(key, null as any);
      return of(cached);
    }

    return from(
      this.sb
        .from('doctor_profile')
        .select('*')
        .eq('slug', slug)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as DoctorProfile;
      }),
      tap((profile) => {
        // ✅ Solo guardamos cuando viene del server, para hidratar sin refetch
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(key, profile);
        }
      })
    );
  }
}
