import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioStateService {

  // URL inicial (placeholder)
  private initialUrl = 'https://placehold.co/150x150/ff5252/ffffff?text=TSG';

  // BehaviorSubject: Almacena y emite la URL actual de la foto.
  private fotoPerfilSubject = new BehaviorSubject<string>(this.initialUrl);

  // Observable: La fuente pública para la suscripción de otros componentes.
  public fotoPerfilActual$: Observable<string> = this.fotoPerfilSubject.asObservable();

  constructor() { }

  /**
   * Actualiza el valor de la foto y notifica a todos los componentes suscritos (Sidebar, etc.).
   * @param nuevaUrl La nueva imagen en formato Base64.
   */
  actualizarFotoPerfil(nuevaUrl: string): void {
    this.fotoPerfilSubject.next(nuevaUrl);
    console.log('[SERVICE] Nuevo estado de foto de perfil emitido.');
  }
}
