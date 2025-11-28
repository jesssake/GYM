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
    rol: 'Cliente' | 'Administrador' | 'Coach';
}

// ----------------------------------------------------
// SERVICIO
// ----------------------------------------------------
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:5000/api/auth';
    private adminUrl = 'http://localhost:5000/api/admin';

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
    // RECUPERAR CONTRASEÑA
    // ----------------------------------------------------
    requestPasswordReset(email: string): Observable<{ msg: string }> {
        return this.http.post<{ msg: string }>(
            `${this.apiUrl}/restablecer-solicitud`,
            { email }
        );
    }

    resetPassword(token: string, password: string): Observable<{ msg: string }> {
        return this.http.post<{ msg: string }>(
            `${this.apiUrl}/restablecer-confirmar`,
            { token, password }
        );
    }

    // ----------------------------------------------------
    // REGISTRO
    // ----------------------------------------------------
    register(data: RegisterData): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
            .pipe(tap(res => this.handleAuthResponse(res)));
    }

    // ----------------------------------------------------
    // LOGIN
    // ----------------------------------------------------
    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
            .pipe(tap(res => this.handleAuthResponse(res)));
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

    processSocialLogin(token: string): void {
        if (!token) return;

        localStorage.setItem(this.TOKEN_KEY, token);

        const sessionData: UserSession = { token, rol: 'Cliente' };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));

        this.router.navigate(['/dashboard']);
    }

    getAllUsers(): Observable<any> {
        return this.http.get<any>(`${this.adminUrl}/usuarios`, {
            headers: this.getAuthHeaders()
        });
    }

    updateUserRole(userId: number, rol: 'Cliente' | 'Administrador' | 'Coach'): Observable<any> {
        return this.http.put<any>(
            `${this.adminUrl}/usuarios/${userId}/rol`,
            { rol },
            { headers: this.getAuthHeaders() }
        );
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.delete<any>(`${this.adminUrl}/usuarios/${userId}`, {
            headers: this.getAuthHeaders()
        });
    }

    createRoutine(formData: FormData): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        return this.http.post<any>(`${this.adminUrl}/rutinas`, formData, { headers });
    }

    createNotice(noticeData: any): Observable<any> {
        return this.http.post<any>(`${this.adminUrl}/avisos`, noticeData, {
            headers: this.getAuthHeaders()
        });
    }

    updateAlertConfig(days: number): Observable<any> {
        return this.http.put<any>(`${this.adminUrl}/config/alertas`, { diasAntes: days }, {
            headers: this.getAuthHeaders()
        });
    }

    getAlertConfig(): Observable<any> {
        return this.http.get<any>(`${this.adminUrl}/config/alertas`, {
            headers: this.getAuthHeaders()
        });
    }

    getExpiringClients(): Observable<any> {
        return this.http.get<any>(`${this.adminUrl}/notificaciones/expiraciones`, {
            headers: this.getAuthHeaders()
        });
    }

    // ----------------------------------------------------
    // VERIFICAR SI ES ADMIN
    // ----------------------------------------------------
    isAdmin(): boolean {
        return this.getUserRole() === 'Administrador';
    }

}
