import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ROLES } from '../../core/constants/roles.constants';
import { AuthStateService } from '../../core/services/auth-state.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthApiService } from '../../features/auth/services/auth-api.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  private readonly authStateService = inject(AuthStateService);
  private readonly authApiService = inject(AuthApiService);
  private readonly themeService = inject(ThemeService); // Triggers theme service initialization
  private readonly router = inject(Router);

  protected readonly currentUser = this.authStateService.currentUser;
  protected readonly isAdmin = computed(() => this.authStateService.hasAnyRole([ROLES.admin]));
  protected readonly isTech = computed(() => this.authStateService.hasAnyRole([ROLES.soporte]));
  protected readonly isUser = computed(() => this.authStateService.hasAnyRole([ROLES.usuario]));
  protected readonly canCreateTicket = computed(() => this.isUser() || this.isAdmin());
  
  protected readonly fullName = computed(() => {
    const user = this.currentUser();
    const firstName = user?.nombre ?? '';
    const lastName = user?.apellido ?? '';
    const value = `${firstName} ${lastName}`.trim();
    return value || user?.email || 'Usuario';
  });

  constructor() {
    this.authApiService.getCurrentUser().subscribe({
      next: (user) => this.authStateService.setCurrentUser(user),
      error: () => {
        if (this.authStateService.getCurrentUser()) {
          return;
        }

        this.authStateService.clearSession();
        void this.router.navigateByUrl('/login');
      }
    });
  }

  protected logout(): void {
    this.authStateService.clearSession();
    void this.router.navigateByUrl('/login');
  }
}
