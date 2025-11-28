import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth.service';

// 🚨 Mock del AuthService para controlar el estado de isLoggedIn
class MockAuthService {
  isLoggedIn = jasmine.createSpy('isLoggedIn');
}

// 🚨 Mock del Router para espiar la navegación
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('authGuard', () => {
  // Función auxiliar para ejecutar el guard en el contexto de inyección
  const executeGuard: CanActivateFn = (route, state) =>
    TestBed.runInInjectionContext(() => authGuard(route as ActivatedRouteSnapshot, state as RouterStateSnapshot));

  let authService: MockAuthService;
  let router: MockRouter;
  // Estado de ruta simulado para incluir 'state.url' en la prueba
  const mockState: RouterStateSnapshot = { url: '/area-privada/perfil' } as RouterStateSnapshot;
  const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // 🚨 Proveer los mocks en lugar de las clases reales
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ]
    });

    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  // Test 1: Permite el acceso si el usuario está logueado
  it('should allow activation if user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  // Test 2: Bloquea el acceso y redirige si el usuario NO está logueado
  it('should redirect to /login and pass returnUrl if user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBeFalse();
    // 🚨 Verifica la navegación correcta con el queryParams
    expect(router.navigate).toHaveBeenCalledWith(
        ['/login'],
        { queryParams: { returnUrl: mockState.url } }
    );
  });
});
