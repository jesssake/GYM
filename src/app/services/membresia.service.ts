import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {

  private http = inject(HttpClient);

  // 🔥 URL REAL (ajústala si tu backend está en otra IP)
  private api = 'http://localhost:5000/api/membresia';

  getMembresia(): Observable<any> {
    return this.http.get(`${this.api}/actual`);
  }

  getHistorialPagos(): Observable<any> {
    return this.http.get(`${this.api}/historial`);
  }

  renovarPlan(): Observable<any> {
    return this.http.post(`${this.api}/renovar`, {});
  }
}
