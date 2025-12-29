// src/app/features/servicios/servicios-list/servicios-list.ts
import { Component, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, shareReplay } from 'rxjs';

import { Servicio, ServiciosApi } from '../data/servicios.api';

type Category = 'all' | 'brain' | 'spine' | 'pain' | 'consult';

@Component({
  selector: 'app-servicios-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './servicios-list.html',
  styleUrls: ['./servicios-list.css'],
})
export class ServiciosList {
  private api = inject(ServiciosApi);

  // UI state
  loading = signal(true);
  error = signal<string | null>(null);
  skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  // Filtros (funcionales)
  searchTerm = signal('');
  activeCategory = signal<Category>('all');

  private serviciosStream$ = this.api.listPublished().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
    catchError((err) => {
      console.error(err);
      this.error.set('No se pudieron cargar los servicios. Intenta de nuevo.');
      return of([] as Servicio[]);
    }),
    finalize(() => this.loading.set(false)),
  );

  servicios = toSignal(this.serviciosStream$, { initialValue: [] as Servicio[] });

  serviciosSorted = computed(() =>
    [...this.servicios()].sort((a, b) => (a.card_title ?? '').localeCompare(b.card_title ?? '')),
  );

  // ✅ Lista final: orden + categoría + búsqueda
  filteredServicios = computed(() => {
    const term = this.normalize(this.searchTerm()).trim();
    const cat = this.activeCategory();

    return this.serviciosSorted().filter((s) => {
      const title = this.normalize(s.card_title ?? '');
      const desc = this.normalize(s.card_description ?? '');
      const haystack = `${title} ${desc}`;

      const matchSearch = !term || haystack.includes(term);
      const matchCategory = cat === 'all' || this.guessCategory(haystack) === cat;

      return matchSearch && matchCategory;
    });
  });

  // Events
  onSearch(value: string) {
    this.searchTerm.set(value ?? '');
  }

  setCategory(cat: Category) {
    this.activeCategory.set(cat);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.activeCategory.set('all');
  }

  // Helpers
  private normalize(v: string) {
    return (v ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // quita acentos
  }

  /**
   * Heurística (sin campo en DB). Si luego agregas `category` al servicio,
   * reemplazamos esto por el campo real y listo.
   */
  private guessCategory(text: string): Exclude<Category, 'all'> {
    // consult
    if (/(consulta|valoracion|evaluacion|segunda opinion|seguimiento)/.test(text)) return 'consult';

    // spine
    if (/(columna|cervical|lumbar|dorsal|hernia|disco|ciatica|escoliosis|estenosis|radiculopatia)/.test(text))
      return 'spine';

    // brain
    if (/(cerebro|tumor|aneurisma|hidrocefalia|epilepsia|meningioma|glioma|neurovascular|craneo)/.test(text))
      return 'brain';

    // pain / nerves
    if (/(dolor|nervio|neuralgia|neuropatia|hormigueo|entumecimiento)/.test(text)) return 'pain';

    // default razonable
    return 'brain';
  }
}
