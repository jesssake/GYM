import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'; // 🚨 Importar el nombre correcto

// Mock del Router para evitar errores de inyección en el ambiente de pruebas
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('AuthService', () => {
  let service: AuthService;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        // Proveer el MockRouter
        { provide: Router, useClass: MockRouter },
      ],
    });
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router) as unknown as MockRouter; // Inyectar el mock
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- Pruebas de Login ---

  it('should return true and set session for admin login', () => {
    const success = service.login('admin@gym.com', 'admin');
    expect(success).toBeTrue();
    expect(localStorage.getItem('user_session_gym')).not.toBeNull();
  });

  it('should return false for invalid login credentials', () => {
    const success = service.login('bad@gym.com', 'pass');
    expect(success).toBeFalse();
    expect(localStorage.getItem('user_session_gym')).toBeNull();
  });

  // --- Pruebas de Sesión ---

  it('should return true for isLoggedIn if session exists', () => {
    // Simular sesión iniciada
    localStorage.setItem('user_session_gym', JSON.stringify({ token: 'test', email: 'a', rol: 'Cliente' }));
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false for isLoggedIn if no session exists', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  // --- Pruebas de Rol ---

  it('should return "Admin" role if session is admin', () => {
    localStorage.setItem('user_session_gym', JSON.stringify({ token: 'test', email: 'a', rol: 'Admin' }));
    expect(service.getUserRole()).toBe('Admin');
  });

  it('should return "Cliente" role if session is client', () => {
    localStorage.setItem('user_session_gym', JSON.stringify({ token: 'test', email: 'a', rol: 'Cliente' }));
    expect(service.getUserRole()).toBe('Cliente');
  });

  it('should return null for getUserRole if no session exists', () => {
    expect(service.getUserRole()).toBeNull();
  });

  // --- Pruebas de Logout ---

  it('should clear session and navigate to /login on logout', () => {
    localStorage.setItem('user_session_gym', JSON.stringify({ token: 'test', email: 'a', rol: 'Cliente' }));

    service.logout();

    expect(localStorage.getItem('user_session_gym')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
