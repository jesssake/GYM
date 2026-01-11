import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// ----------------------------------------------------
// TIPOS
// ----------------------------------------------------
export type UserRole = 'admin' | 'cliente' | 'coach' | null;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  nombre: string;
}

export interface AuthResponse {
  token: string;
}

// ----------------------------------------------------
// SERVICIO
// ----------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiAuth = 'http://localhost:5000/api/auth';
  private apiUsers = 'http://localhost:5000/api/users';
  private apiAdmin = 'http://localhost:5000/api/admin';
  private apiContent = 'http://localhost:5000/api/content';
  private apiNotifications = 'http://localhost:5000/api/notifications';

  private readonly TOKEN_KEY = 'token';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  // ----------------------------------------------------
  // TOKEN / JWT
  // ----------------------------------------------------
  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserRole(): UserRole {
    const payload = this.decodeToken();
    if (!payload) return null;
    
    // ✅ CORRECCIÓN: Obtener el rol y normalizar a minúsculas
    const roleValue = payload.rol || payload.role;
    
    if (!roleValue) return null;
    
    // Convertir a minúsculas para comparación consistente
    const roleLower = roleValue.toString().toLowerCase();
    
    if (roleLower === 'admin') return 'admin';
    if (roleLower === 'coach') return 'coach';
    if (roleLower === 'cliente') return 'cliente';
    
    return null;
  }

  getUserId(): number | null {
    const payload = this.decodeToken();
    return payload?.id ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    // ✅ CORRECCIÓN: Usar getUserRole() que ya maneja mayúsculas/minúsculas
    return this.getUserRole() === 'admin';
  }

  // ----------------------------------------------------
  // HEADERS
  // ----------------------------------------------------
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`
    });
  }

  // ----------------------------------------------------
  // LOGIN NORMAL
  // ----------------------------------------------------
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiAuth}/login`, credentials)
      .pipe(
        tap(res => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
        })
      );
  }

  // ----------------------------------------------------
  // ✅ LOGIN SOCIAL (CORRECCIÓN CLAVE)
  // ----------------------------------------------------
  processSocialLogin(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);

    const payload = this.decodeToken();
    const role = payload?.rol as UserRole;

    // ✅ CORRECCIÓN: Comparar ignorando mayúsculas/minúsculas
    if (role && role.toString().toLowerCase() === 'admin') {
      this.router.navigate(['/area-privada/admin']);
    } else if (role && role.toString().toLowerCase() === 'coach') {
      this.router.navigate(['/area-privada/coach']);
    } else {
      this.router.navigate(['/area-privada/dashboard']);
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  // ----------------------------------------------------
  // ADMIN – USUARIOS
  // ----------------------------------------------------
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiAdmin}/usuarios`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUserRole(userId: number, newRole: UserRole): Observable<any> {
    return this.http.put(
      `${this.apiAdmin}/usuarios/${userId}/rol`,
      { nuevoRol: newRole },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiAdmin}/usuarios/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ----------------------------------------------------
  // REGISTRO
  // ----------------------------------------------------
  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiAuth}/register`, data);
  }

  // ----------------------------------------------------
  // RESTABLECER CONTRASEÑA
  // ----------------------------------------------------
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiAuth}/reset-request`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiAuth}/reset-password`, { token, password });
  }

  // ----------------------------------------------------
  // ADMIN – CONTENIDO
  // ----------------------------------------------------
  createRoutine(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiContent}/routine`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`
      })
    });
  }

  createNotice(data: any): Observable<any> {
    return this.http.post(`${this.apiContent}/notice`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // ----------------------------------------------------
  // CLIENTE – RUTINAS
  // ----------------------------------------------------
  getAssignedRoutine(): Observable<any> {
    return this.http.get(`${this.apiUsers}/rutina-asignada`, {
      headers: this.getAuthHeaders()
    });
  }

  getRoutineDetails(): Observable<any> {
    return this.http.get(`${this.apiUsers}/rutina-detalles`, {
      headers: this.getAuthHeaders()
    });
  }

  getActivities(): Observable<any> {
    return this.http.get(`${this.apiUsers}/actividades`, {
      headers: this.getAuthHeaders()
    });
  }

  getRecommendations(): Observable<any> {
    return this.http.get(`${this.apiUsers}/recomendaciones`, {
      headers: this.getAuthHeaders()
    });
  }

  // ----------------------------------------------------
  // NOTIFICACIONES – ADMIN
  // ----------------------------------------------------
  getAlertConfig(): Observable<any> {
    return this.http.get(`${this.apiNotifications}/config`, {
      headers: this.getAuthHeaders()
    });
  }

  getExpiringClients(): Observable<any> {
    return this.http.get(`${this.apiNotifications}/expiring`, {
      headers: this.getAuthHeaders()
    });
  }

  updateAlertConfig(days: number): Observable<any> {
    return this.http.put(
      `${this.apiNotifications}/config`,
      { diasAntes: days },
      { headers: this.getAuthHeaders() }
    );
  }

  // ----------------------------------------------------
  // PERFIL
  // ----------------------------------------------------
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUsers}/profile`, {
      headers: this.getAuthHeaders()
    });
  }
}