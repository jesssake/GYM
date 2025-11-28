import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminGuard } from './admin-guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// 🚨 Mock del AuthService para controlar el estado
class MockAuthService {
  isLoggedIn = jasmine.createSpy('isLoggedIn');
  getUserRole = jasmine.createSpy('getUserRole');
}

// 🚨 Mock del Router para espiar la navegación
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // 🚨 Proveer los mocks
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ]
    });

    // 🚨 Obtener las instancias de los mocks
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  // Test 1: Usuario NO logueado
  it('should redirect to /login if user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Test 2: Usuario logueado pero NO Admin
  it('should redirect to /dashboard if logged in but not Admin', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getUserRole.and.returnValue('Cliente'); // Rol diferente a Admin

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/area-privada/dashboard']);
  });

  // Test 3: Usuario logueado y es Admin
  it('should allow activation if user is logged in and is Admin', () => {
    authService.isLoggedIn.and.returnValue(true);
    authService.getUserRole.and.returnValue('Admin'); // Rol correcto

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
