import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está logueado
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const userRole = authService.getUserRole();

  // ✔️ CORRECCIÓN: El backend y tu AuthService devuelven "Administrador"
  if (userRole === 'Administrador') {
    return true;
  } else {
    router.navigate(['/area-privada/dashboard']);
    return false;
  }
};
