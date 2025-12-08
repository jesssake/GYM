import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

// Mock del Router
class MockRouter {
  // Utilizamos una función espía (spy) para simular la navegación
  navigate = jasmine.createSpy('navigate');
}

describe('AuthService', () => {
  let service: AuthService;
  let router: any; // Usamos 'any' para evitar errores de tipado con el MockRouter

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        // Proporcionamos el MockRouter en lugar del Router real
        { provide: Router, useClass: MockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    // Limpiamos localStorage antes de cada prueba
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --------------------------------------------------
  // LOGIN TESTS (Asumiendo que prueba 'loginTest')
  // --------------------------------------------------

  it('should return true and set session for admin login (via loginTest)', () => {
    const success = service.loginTest('admin@gym.com', 'Administrador');
    expect(success).toBeTrue();

    // Rol guardado debe ser 'Administrador'
    const role = service.getUserRole();
    expect(role).toBe('Administrador');

    const stored = localStorage.getItem('user_session_gym');
    expect(stored).not.toBeNull();
  });

  it('should return false for invalid login credentials (via loginTest)', () => {
    const success = service.loginTest('bad@gym.com', 'pass');
    expect(success).toBeFalse();

    const stored = localStorage.getItem('user_session_gym');
    expect(stored).toBeNull();
  });

  // --------------------------------------------------
  // SESSION TESTS
  // --------------------------------------------------

  it('should return true for isLoggedIn if session exists', () => {
    localStorage.setItem(
      'user_session_gym',
      JSON.stringify({ token: 'test-token', rol: 'Cliente' })
    );
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false for isLoggedIn if no session exists', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  // --------------------------------------------------
  // ROLE TESTS
  // --------------------------------------------------

  it('should return "Administrador" role if session is admin', () => {
    localStorage.setItem(
      'user_session_gym',
      JSON.stringify({ token: 'test-token', rol: 'Administrador' })
    );
    expect(service.getUserRole()).toBe('Administrador');
  });

  it('should return "Cliente" role if session is client', () => {
    localStorage.setItem(
      'user_session_gym',
      JSON.stringify({ token: 'test-token', rol: 'Cliente' })
    );
    expect(service.getUserRole()).toBe('Cliente');
  });

  it('should return null for getUserRole if no session exists', () => {
    expect(service.getUserRole()).toBeNull();
  });

  // --------------------------------------------------
  // LOGOUT TESTS
  // --------------------------------------------------

  it('should clear session and navigate to /login on logout', () => {
    localStorage.setItem(
      'user_session_gym',
      JSON.stringify({ token: 'test-token', rol: 'Cliente' })
    );

    service.logout();

    expect(localStorage.getItem('user_session_gym')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
