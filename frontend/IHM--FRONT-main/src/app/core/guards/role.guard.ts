import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStateService } from '../services/auth-state.service';

export const roleGuard: CanActivateFn = (route) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  const expectedRoles = (route.data?.['roles'] as string[] | undefined) ?? [];

  if (authState.hasAnyRole(expectedRoles)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
