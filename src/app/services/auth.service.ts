import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Interfaz para definir la estructura de la información de usuario en la sesión
interface UserSession {
  token: string;
  email: string;
  rol: 'Cliente' | 'Admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // La clave que usaremos en localStorage
  private readonly SESSION_KEY = 'user_session_gym';

  constructor(private router: Router) { }

  /**
   * 🚨 Simula el proceso de inicio de sesión.
   * En una app real, aquí harías una llamada HTTP al backend.
   */
  login(email: string, password: string): boolean {
    // 🚨 Lógica de validación dummy (ejemplo)
    if (email === 'admin@gym.com' && password === 'admin') {
      const adminSession: UserSession = { token: 'admin-token-12345', email: email, rol: 'Admin' };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(adminSession));
      return true;
    }

    if (email === 'cliente@gym.com' && password === 'cliente') {
      const clientSession: UserSession = { token: 'client-token-98765', email: email, rol: 'Cliente' };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(clientSession));
      return true;
    }

    return false; // Credenciales inválidas
  }

  /**
   * 🚨 Verifica si hay una sesión activa.
   */
  isLoggedIn(): boolean {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    return !!sessionData; // Retorna true si existe data en localStorage
  }

  /**
   * 🚨 Obtiene el rol del usuario actual.
   */
  getUserRole(): 'Cliente' | 'Admin' | null {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    if (sessionData) {
      try {
        const session: UserSession = JSON.parse(sessionData);
        return session.rol;
      } catch (e) {
        console.error("Error al parsear la sesión:", e);
        return null;
      }
    }
    return null;
  }

  /**
   * 🚨 Cierra la sesión y redirige al login.
   */
  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    // Redirigir al login o a la página principal
    this.router.navigate(['/login']);
  }
}
