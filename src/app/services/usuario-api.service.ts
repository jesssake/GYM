// src/app/services/usuario-api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// =========================================================
// INTERFACES PRINCIPALES DEL USUARIO
// =========================================================

export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'Cliente' | 'Administrador' | 'Coach';
    fechaNacimiento: string;
    peso: number;
    altura: number;
    meta: string;
    fotoUrl: string | null;
}

export interface UserUpdateData {
    nombre: string;
    fechaNacimiento: string;
    peso: number;
    altura: number;
    meta: string;
}

export interface ProfileResponse {
    ok: boolean;
    user: Usuario;
}

export interface GeneralResponse {
    ok: boolean;
    msg: string;
}

export interface PhotoUploadResponse {
    ok: boolean;
    msg: string;
    newUrl: string;
}

// =========================================================
// INTERFACES PARA ACTIVIDADES Y AVISOS
// =========================================================

export interface Actividad {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    fechaFin?: string | null;
    imagenUrl?: string | null;

    // Propiedades para frontend
    inscritos?: number;        // total de inscritos
    cupoMaximo?: number;

    // === FIX DEL ERROR ===
    inscrito?: boolean;        // si el usuario está inscrito
    estaInscrito?: boolean;    // compatibilidad si el backend usa este nombre
}

export interface Aviso {
    id: number;
    titulo: string;
    contenido: string;
    fecha: string;
}

export interface ActivityResponse {
    ok: boolean;
    actividades: Actividad[];
    msg?: string;
}

export interface NoticeResponse {
    ok: boolean;
    avisos: Aviso[];
}

// =========================================================
// SERVICIO API DEL USUARIO
// =========================================================

@Injectable({
    providedIn: 'root'
})
export class UsuarioApiService {

    private userUrl = 'http://localhost:5000/api/users';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    // -----------------------------------------------------
    // Obtener Headers con Token
    // -----------------------------------------------------
    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();

        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // =====================================================
    // GRUPO 1: PERFIL
    // =====================================================

    obtenerPerfil(): Observable<ProfileResponse> {
        return this.http.get<ProfileResponse>(`${this.userUrl}/profile`, {
            headers: this.getAuthHeaders()
        });
    }

    actualizarDatos(data: UserUpdateData): Observable<GeneralResponse> {
        return this.http.put<GeneralResponse>(`${this.userUrl}/profile`, data, {
            headers: this.getAuthHeaders()
        });
    }

    subirFotoPerfil(fotoBase64: string): Observable<PhotoUploadResponse> {
        return this.http.put<PhotoUploadResponse>(`${this.userUrl}/foto-perfil`, { fotoBase64 }, {
            headers: this.getAuthHeaders()
        });
    }

    // =====================================================
    // GRUPO 2: DASHBOARD (CLIENTE)
    // =====================================================

    getMembershipStatus(): Observable<any> {
        return this.http.get<any>(`${this.userUrl}/membresia-status`, {
            headers: this.getAuthHeaders()
        });
    }

    getCurrentRoutine(): Observable<any> {
        return this.http.get<any>(`${this.userUrl}/rutina-asignada`, {
            headers: this.getAuthHeaders()
        });
    }

    getActiveNotices(): Observable<NoticeResponse> {
        return this.http.get<NoticeResponse>(`${this.userUrl}/avisos-activos`, {
            headers: this.getAuthHeaders()
        });
    }

    // =====================================================
    // GRUPO 3: ENTRENAMIENTOS
    // =====================================================

    getRoutineDetails(): Observable<any> {
        return this.http.get<any>(`${this.userUrl}/rutina-detalles`, {
            headers: this.getAuthHeaders()
        });
    }

    // =====================================================
    // GRUPO 4: ACTIVIDADES EXTRAS
    // =====================================================

    getActiveActivities(): Observable<ActivityResponse> {
        return this.http.get<ActivityResponse>(`${this.userUrl}/actividades`, {
            headers: this.getAuthHeaders()
        });
    }

    inscribirseActividad(idActividad: number): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(
            `${this.userUrl}/actividades/${idActividad}/inscribirse`,
            {},
            { headers: this.getAuthHeaders() }
        );
    }

    cancelarInscripcionActividad(idActividad: number): Observable<GeneralResponse> {
        return this.http.delete<GeneralResponse>(
            `${this.userUrl}/actividades/${idActividad}/cancelar`,
            { headers: this.getAuthHeaders() }
        );
    }

    // =====================================================
    // GRUPO 5: RECOMENDACIONES / BLOG
    // =====================================================

    getRecommendations(): Observable<any> {
        return this.http.get<any>(`${this.userUrl}/recomendaciones`, {
            headers: this.getAuthHeaders()
        });
    }
}
