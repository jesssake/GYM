import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional para adjuntar automáticamente el token JWT
 * a todas las peticiones privadas del backend.
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();

  // 🚨 1. Evitar agregar token a APIs externas
  if (!req.url.startsWith('http://localhost:5000')) {
    return next(req);
  }

  // 🚨 2. Detectar Rutas Públicas
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/restablecer-solicitud',
    '/api/auth/restablecer-confirmar'
  ];

  const isPublicRoute = publicRoutes.some(route =>
    req.url.startsWith(`http://localhost:5000${route}`)
  );

  if (isPublicRoute || !token) {
    return next(req);
  }

  // 🚨 3. Rutas Privadas → Adjuntar token
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedRequest);
};
