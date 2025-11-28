import { TestBed } from '@angular/core/testing';

import { UsuarioStateService } from './usuario-state.service'; // 🚨 Importar el nombre correcto
import { Usuario } from '../interfaces/usuario.interface';

// Usuario de prueba básico
const mockUser: Usuario = {
  id: 'test-1',
  nombre: 'Test User',
  email: 'test@gym.com',
  rol: 'Cliente',
  fechaNacimiento: '2000-01-01',
  peso: 70,
  altura: 175,
  meta: 'mantenerse',
  fotoUrl: 'initial-url.jpg',
};

describe('UsuarioStateService', () => {
  let service: UsuarioStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioStateService); // 🚨 Inyectar el nombre correcto
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 1: Verificar el estado inicial del usuario
  it('should initialize user$ with a guest user', (done) => {
    service.user$.subscribe(user => {
      // Solo verificamos la primera emisión
      expect(user.nombre).toBe('Invitado');
      expect(user.fotoUrl).toContain('placehold.co');
      done();
    });
  });

  // Test 2: setUser debe actualizar el objeto de usuario completo
  it('should update the full user object when calling setUser', (done) => {
    service.setUser(mockUser);

    service.user$.subscribe(user => {
      expect(user.nombre).toBe('Test User');
      expect(user.peso).toBe(70);
      expect(user.fotoUrl).toBe('initial-url.jpg');
      done();
    });
  });

  // Test 3: actualizarFotoPerfil debe actualizar solo la fotoUrl
  it('should update only fotoUrl when calling actualizarFotoPerfil', (done) => {
    const newFotoUrl = 'new-photo-url.png';
    // Primero simulamos que un usuario ya está cargado
    service.setUser(mockUser);

    // Después actualizamos la foto
    service.actualizarFotoPerfil(newFotoUrl);

    // Verificamos que el estado refleje el cambio de foto pero mantenga el nombre
    service.user$.subscribe(user => {
      expect(user.fotoUrl).toBe(newFotoUrl);
      expect(user.nombre).toBe('Test User'); // El nombre NO debe cambiar
      done();
    });
  });
});
