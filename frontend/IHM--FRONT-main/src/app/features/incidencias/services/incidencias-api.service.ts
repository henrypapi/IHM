import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../../../core/constants/api.config';
import { IncidenciaFilter } from '../models/incidencia-filter.model';
import { Incidencia } from '../models/incidencia.model';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasApiService {
  private readonly http = inject(HttpClient);
  private readonly incidenciasUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.incidencias}`;

  list(filters: IncidenciaFilter): Observable<Incidencia[]> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    if (filters.estado) {
      params = params.set('estado', filters.estado);
    }

    return this.http.get<Incidencia[]>(this.incidenciasUrl, { params });
  }
}
