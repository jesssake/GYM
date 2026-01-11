// C:\Codigos\HTml\Gym\src\app\services\gestion-imagenes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GymImage {
  id?: number;
  titulo: string;
  descripcion: string;
  url: string;
  categoria: string;
  orden: number;
  activa: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GestionImagenesService {
  private apiUrl = 'http://localhost:5000/api/imagenes'; // URL de tu backend

  constructor(private http: HttpClient) {}

  getImagenes(): Observable<GymImage[]> {
    return this.http.get<GymImage[]>(this.apiUrl);
  }

  getImagenById(id: number): Observable<GymImage> {
    return this.http.get<GymImage>(`${this.apiUrl}/${id}`);
  }

  createImagen(imagen: FormData): Observable<GymImage> {
    return this.http.post<GymImage>(this.apiUrl, imagen);
  }

  updateImagen(id: number, imagen: FormData): Observable<GymImage> {
    return this.http.put<GymImage>(`${this.apiUrl}/${id}`, imagen);
  }

  deleteImagen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  reorderImagenes(imagenes: GymImage[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reorder`, { imagenes });
  }
}