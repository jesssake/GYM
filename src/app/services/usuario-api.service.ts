import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioApiService {

  // 🚨 Reemplaza con la URL de tu API
  private apiUrl = 'http://localhost:3000/api/usuario';

  constructor(private http: HttpClient) { }

  /**
   * Envía el Base64 de la foto al servidor para ser guardado.
   * @param base64Image El string Base64 de la imagen recortada (ej. 'data:image/png;base64,...').
   * @returns Un Observable con la respuesta del servidor (debe incluir la nueva URL).
   */
  subirFotoPerfil(base64Image: string): Observable<any> {
    // El backend espera un objeto JSON con la imagen.
    const data = {
      fotoBase64: base64Image
    };

    // Hacemos un PUT o POST al endpoint específico para la foto de perfil
    // Asegúrate de incluir el token de autorización si usas uno
    return this.http.put(`${this.apiUrl}/foto-perfil`, data);
  }
}
