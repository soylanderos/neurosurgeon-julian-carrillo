import { Injectable, inject } from '@angular/core';
import { SUPABASE } from '../../../shared/supabase/supabase.client';

export type AppointmentInsert = {
  full_name: string;
  phone: string;
  email?: string | null;
  preferred_date?: string | null; // 'YYYY-MM-DD'
  preferred_time?: string | null; // 'HH:mm' o texto
  reason: string;
  notes?: string | null;
  source?: string | null;
};

@Injectable({ providedIn: 'root' })
export class AppointmentsApi {
  private sb = inject(SUPABASE);

  async create(payload: AppointmentInsert) {
    const { error } = await this.sb.from('appointments').insert({
      ...payload,
      source: payload.source ?? 'website',
    });

    if (error) throw error;
    return true;
  }
}
