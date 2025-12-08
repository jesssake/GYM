import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './usuario-api.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioStateService {

  private userSubject = new BehaviorSubject<Usuario>({
    id: 0, // ✅ CORREGIDO — debe ser number, no string
    nombre: '',
    email: 'martin@gym.com',
    fechaNacimiento: '1990-01-01',
    peso: 75,
    altura: 175,
    meta: 'ganar-musculo',
    rol: 'Cliente',
    fotoUrl: 'https://placehold.co/100x100/38a169/ffffff?text=A'
  });

  user$ = this.userSubject.asObservable();

  actualizarFotoPerfil(url: string) {
    const usuarioActual = this.userSubject.value;
    this.userSubject.next({ ...usuarioActual, fotoUrl: url });
  }

  actualizarUsuario(usuario: Usuario) {
    this.userSubject.next(usuario);
  }
}
