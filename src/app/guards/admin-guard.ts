import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

/**
 * 🛡️ AdminGuard: Impide el acceso si el rol del usuario no es 'Admin'.
 * Redirige al dashboard del cliente si el usuario está logueado pero no es Admin.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar si hay sesión activa (opcional, pero buena práctica)
  if (!authService.isLoggedIn()) {
    // Si no está logueado, se le pedirá iniciar sesión (el authGuard principal ya debería manejar esto,
    // pero es un buen respaldo para rutas anidadas).
    router.navigate(['/login']);
    return false;
  }

  // 2. Verificar el rol específico
  const userRole = authService.getUserRole();

  if (userRole === 'Admin') {
    return true; // Acceso concedido si el rol es 'Admin'
  } else {
    // Redirigir a una ruta segura para clientes (su dashboard)
    router.navigate(['/area-privada/dashboard']);
    return false; // Bloquea el acceso a la ruta de Admin
  }
};
