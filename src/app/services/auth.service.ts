import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// ----------------------------------------------------
// TIPOS / INTERFACES
// ----------------------------------------------------
export type UserRole = 'Cliente' | 'Administrador' | 'Coach' | null;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  nombre: string;
}

export interface AuthResponse {
  token: string;
  rol: 'Cliente' | 'Administrador' | 'Coach';
}

interface UserSession {
  token: string;
  rol: UserRole;
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
  private readonly SESSION_KEY = 'user_session_gym';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  // ----------------------------------------------------
  // HEADERS CON TOKEN
  // ----------------------------------------------------
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ----------------------------------------------------
  // LOGIN
  // ----------------------------------------------------
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiAuth}/login`, credentials)
      .pipe(tap(res => this.handleAuthResponse(res)));
  }

  loginTest(email: string, password: string): boolean {
    if (email === 'admin@gym.com' && password === 'admin') {
      this.handleAuthResponse({ token: 'test', rol: 'Administrador' });
      return true;
    }

    if (email === 'cliente@gym.com' && password === 'cliente') {
      this.handleAuthResponse({ token: 'test', rol: 'Cliente' });
      return true;
    }

    return false;
  }

  // ----------------------------------------------------
  // GUARDAR SESIÓN
  // ----------------------------------------------------
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);

    const sessionData: UserSession = {
      token: response.token,
      rol: response.rol
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
  }

  // ----------------------------------------------------
  // SESIÓN
  // ----------------------------------------------------
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && token.trim() !== '';
  }

  getUserRole(): UserRole {
    const data = localStorage.getItem(this.SESSION_KEY);
    if (!data) return null;

    try {
      const s: UserSession = JSON.parse(data);
      return s.rol;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    this.router.navigate(['/login']);
  }

  // ----------------------------------------------------
  // ADMIN – USUARIOS
  // ----------------------------------------------------
  updateUserRole(userId: number, newRole: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiAdmin}/usuarios/${userId}/rol`,
      { nuevoRol: newRole },
      { headers: this.getAuthHeaders() }
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiAdmin}/usuarios`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiAdmin}/usuarios/${id}`, {
      headers: this.getAuthHeaders()
    });
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

  processSocialLogin(token: string): Observable<any> {
    return this.http.post(`${this.apiAuth}/social-login`, { token });
  }

  // ----------------------------------------------------
  // ADMIN – CONTENIDO
  // ----------------------------------------------------
  createRoutine(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiContent}/routine`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
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
  // NOTIFICACIONES (ADMIN)
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
    // 🚨 CORRECCIÓN CLAVE: Cambiamos la clave 'days' a 'diasAntes'
    return this.http.put(`${this.apiNotifications}/config`, { diasAntes: days }, {
      headers: this.getAuthHeaders()
    });
  }

  // ----------------------------------------------------
  // PERFIL
  // ----------------------------------------------------
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUsers}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  // ----------------------------------------------------
  // UTILIDADES
  // ----------------------------------------------------
  isAdmin(): boolean {
    return this.getUserRole() === 'Administrador';
  }
}
