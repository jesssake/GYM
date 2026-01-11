import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar login
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const userRole = authService.getUserRole();

  // 2. SOLO admin o coach
  if (userRole === 'admin' || userRole === 'coach') {
    return true;
  }

  // 3. Usuario sin permisos
  router.navigate(['/area-privada/dashboard']);
  return false;
};
