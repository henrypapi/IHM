import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { API_CONFIG } from '../../../core/constants/api.config';
import { User } from '../../../core/models/user.model';
import { CreateUserPayload, UpdateUserPayload } from '../models/user-payload.model';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.usuarios}`;

  list() {
    return this.http.get<unknown[]>(this.usersUrl).pipe(map((users) => users.map((user) => this.mapUser(user))));
  }

  create(payload: CreateUserPayload) {
    return this.http.post<unknown>(this.usersUrl, payload).pipe(map((user) => this.mapUser(user)));
  }

  update(userId: number, payload: UpdateUserPayload) {
    return this.http.put<unknown>(`${this.usersUrl}/${userId}`, payload).pipe(map((user) => this.mapUser(user)));
  }

  delete(userId: number) {
    return this.http.delete<void>(`${this.usersUrl}/${userId}`);
  }

  private mapUser(source: unknown): User {
    const value = this.asRecord(source);

    return {
      id: this.asNumber(value['id']),
      nombre: this.asString(value['nombre']),
      apellido: this.asString(value['apellido']),
      email: this.asString(value['email']),
      celular: this.asOptionalString(value['celular']),
      roles: this.asRoles(value['roles'] ?? value['authorities'] ?? value['rol'] ?? value['role'])
    };
  }

  private asRecord(source: unknown): Record<string, unknown> {
    return source && typeof source === 'object' ? (source as Record<string, unknown>) : {};
  }

  private asString(source: unknown): string {
    return typeof source === 'string' ? source : '';
  }

  private asOptionalString(source: unknown): string | undefined {
    return typeof source === 'string' ? source : undefined;
  }

  private asNumber(source: unknown): number {
    return typeof source === 'number' ? source : 0;
  }

  private asRoles(source: unknown): string[] {
    if (Array.isArray(source)) {
      return source.map((role) => String(role).toUpperCase());
    }

    if (typeof source === 'string' && source.length > 0) {
      return [source.toUpperCase()];
    }

    return [];
  }
}
