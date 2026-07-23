import { Injectable, signal } from '@angular/core';

import { CurrentUser } from '../models/current-user.model';
import { TokenService } from './token.service';

interface StoredSession {
  user: CurrentUser | null;
}

interface SessionUserInput {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  roles?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly sessionStorageKey = 'auth_session';
  private readonly currentUserSignal;
  readonly currentUser;

  constructor(private readonly tokenService: TokenService) {
    this.currentUserSignal = signal<CurrentUser | null>(this.readStoredUser());
    this.currentUser = this.currentUserSignal.asReadonly();
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUserSignal();
  }

  hasAnyRole(expectedRoles: string[]): boolean {
    if (expectedRoles.length === 0) {
      return true;
    }

    const user = this.currentUserSignal();
    if (!user) {
      return false;
    }

    const normalizedExpectedRoles = expectedRoles.map((role) => this.normalizeRoleKey(role));
    return user.roles.some((role) => normalizedExpectedRoles.includes(this.normalizeRoleKey(role)));
  }

  setSession(token: string, user?: SessionUserInput | null): void {
    this.tokenService.saveToken(token);

    const resolvedUser = this.buildCurrentUser(token, user);
    this.currentUserSignal.set(resolvedUser);

    if (typeof localStorage !== 'undefined') {
      const session: StoredSession = { user: resolvedUser };
      localStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
    }
  }

  setCurrentUser(user: SessionUserInput | null): void {
    const resolvedUser = this.buildCurrentUser(this.tokenService.getToken(), user, this.currentUserSignal());
    this.currentUserSignal.set(resolvedUser);

    if (typeof localStorage !== 'undefined') {
      const session: StoredSession = { user: resolvedUser };
      localStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
    }
  }

  clearSession(): void {
    this.tokenService.clearToken();
    this.currentUserSignal.set(null);

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.sessionStorageKey);
    }
  }

  private readStoredUser(): CurrentUser | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const rawSession = localStorage.getItem(this.sessionStorageKey);
    if (!rawSession) {
      return this.buildCurrentUser(this.tokenService.getToken());
    }

    try {
      const parsed = JSON.parse(rawSession) as StoredSession;
      return parsed.user ?? this.buildCurrentUser(this.tokenService.getToken());
    } catch {
      return this.buildCurrentUser(this.tokenService.getToken());
    }
  }

  private buildCurrentUser(token: string | null, user?: SessionUserInput | null, fallbackUser?: CurrentUser | null): CurrentUser | null {
    if (!token && !user) {
      return null;
    }

    const decodedPayload = this.decodeJwtPayload(token);
    const roles = this.normalizeRoles(
      user?.roles ??
        decodedPayload?.['roles'] ??
        decodedPayload?.['authorities'] ??
        decodedPayload?.['rol'] ??
        decodedPayload?.['role']
    );
    const resolvedRoles = roles.length > 0 ? roles : (fallbackUser?.roles ?? []);

    return {
      id: user?.id ?? this.readNumber(decodedPayload?.['id']),
      nombre: user?.nombre ?? this.readString(decodedPayload?.['nombre']) ?? this.readString(decodedPayload?.['name']),
      apellido: user?.apellido ?? this.readString(decodedPayload?.['apellido']),
      email: user?.email ?? this.readString(decodedPayload?.['email']) ?? this.readString(decodedPayload?.['sub']),
      roles: resolvedRoles
    };
  }

  private decodeJwtPayload(token: string | null): Record<string, unknown> | null {
    if (!token) {
      return null;
    }

    const sections = token.split('.');
    if (sections.length < 2) {
      return null;
    }

    try {
      const normalized = sections[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
      const json = atob(padded);
      return JSON.parse(json) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private normalizeRoles(source: unknown): string[] {
    if (Array.isArray(source)) {
      return source.map((role) => String(role).toUpperCase());
    }

    if (typeof source === 'string' && source.trim().length > 0) {
      return [source.toUpperCase()];
    }

    return [];
  }

  private normalizeRoleKey(role: string): string {
    const normalized = role.trim().toUpperCase();
    const compact = normalized.startsWith('ROLE_') ? normalized.slice(5) : normalized;

    switch (compact) {
      case 'USER':
      case 'USUARIO':
        return 'USER';
      case 'ADMIN':
      case 'ADMINISTRADOR':
        return 'ADMIN';
      case 'TI':
      case 'TECH':
      case 'TECNICO':
      case 'SOPORTE':
      case 'SUPPORT':
        return 'SUPPORT';
      default:
        return compact;
    }
  }

  private readNumber(source: unknown): number | undefined {
    return typeof source === 'number' ? source : undefined;
  }

  private readString(source: unknown): string | undefined {
    return typeof source === 'string' ? source : undefined;
  }
}
