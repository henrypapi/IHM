import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { API_CONFIG } from '../constants/api.config';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesApiService {
  private readonly http = inject(HttpClient);

  list() {
    return this.http.get<Category[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.categorias}`);
  }
}
