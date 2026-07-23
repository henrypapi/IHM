import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import { IncidenciasFilterComponent } from '../../components/incidencias-filter/incidencias-filter.component';
import { IncidenciasTableComponent } from '../../components/incidencias-table/incidencias-table.component';
import { IncidenciaFilter } from '../../models/incidencia-filter.model';
import { Incidencia } from '../../models/incidencia.model';
import { IncidenciasApiService } from '../../services/incidencias-api.service';

@Component({
  selector: 'app-incidencias-list-page',
  standalone: true,
  imports: [CommonModule, IncidenciasFilterComponent, IncidenciasTableComponent],
  templateUrl: './incidencias-list-page.component.html',
  styleUrl: './incidencias-list-page.component.scss'
})
export class IncidenciasListPageComponent {
  private readonly incidenciasApiService = inject(IncidenciasApiService);

  protected readonly incidencias = signal<Incidencia[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadIncidencias({});
  }

  protected onFiltersChanged(filters: IncidenciaFilter): void {
    this.loadIncidencias(filters);
  }

  private loadIncidencias(filters: IncidenciaFilter): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.incidenciasApiService.list(filters).subscribe({
      next: (response) => {
        this.incidencias.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'No fue posible cargar incidencias. Verifica el endpoint y el token JWT.'
        );
        this.loading.set(false);
      }
    });
  }
}
