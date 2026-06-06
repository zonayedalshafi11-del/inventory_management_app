import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { UserPermissions } from '../../shared/models/user.model';

export const permissionGuard = (permission: keyof UserPermissions): CanActivateFn => {
  return () => {
    const tokenStorage = inject(TokenStorageService);
    const router = inject(Router);
    const user = tokenStorage.getUser();

    if (user?.permissions?.[permission]) {
      return true;
    }

    return router.createUrlTree(['/dashboard']);
  };
};
