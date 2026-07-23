import { Routes } from '@angular/router';

import { ROLES } from './core/constants/roles.constants';
import { authGuard } from './core/guards/auth.guard';
import { redirectAuthenticatedGuard } from './core/guards/redirect-authenticated.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    canActivate: [redirectAuthenticatedGuard],
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      )
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(
            (m) => m.DashboardPageComponent
          )
      },
      {
        path: 'tickets',
        data: {
          view: 'board'
        },
        loadComponent: () =>
          import('./features/tickets/pages/tickets-page/tickets-page.component').then(
            (m) => m.TicketsPageComponent
          )
      },

      {
        path: 'usuarios',
        canActivate: [roleGuard],
        data: {
          roles: [ROLES.admin]
        },
        loadComponent: () =>
          import('./features/users/pages/users-page/users-page.component').then(
            (m) => m.UsersPageComponent
          )
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./features/settings/pages/settings-page/settings-page.component').then(
            (m) => m.SettingsPageComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
