import { inject, Injectable } from '@angular/core';
import { from, map, of } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE } from '../../../shared/supabase/supabase.client';

export type DoctoraliaOpinionRow = {
  id: string | number;
  raw_html: string | null;
  source_url: string | null;
  date_published: string | null;
};

@Injectable({ providedIn: 'root' })
export class DoctoraliaOpinionsApi {
  private db = inject(SUPABASE) as SupabaseClient;

  listLatest(params: { doctorId: number; max?: number }) {
    const max = params.max ?? 900;

    // ✅ Guard: evita "undefined" / NaN
    const doctorIdNum = Number(params.doctorId);
    if (!Number.isFinite(doctorIdNum)) return of([] as DoctoraliaOpinionRow[]);

    return from(
      this.db
        .from('doctor_opinions')
        .select('id, raw_html, source_url, date_published')
        .eq('doctor_id', doctorIdNum)
        .order('date_published', { ascending: false })
        .limit(max)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as DoctoraliaOpinionRow[];
      })
    );
  }
}
