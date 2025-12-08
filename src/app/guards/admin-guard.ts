import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar si está logueado
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const userRole = authService.getUserRole();

  // Verificar rol permitido
  if (userRole === 'Administrador' || userRole === 'Coach') {
    return true;
  }

  // Redirección para usuarios no autorizados
  router.navigate(['/area-privada/dashboard']);
  return false;
};
