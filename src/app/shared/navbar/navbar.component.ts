import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 🚨 Solo necesitamos RouterLink
import { AuthService } from '../../services/auth.service'; // 🚨 REQUERIDO: Importar el AuthService

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="navbar-header">
      <div class="logo">
        <a [routerLink]="['/']">Train Station Gym</a>
      </div>
      <nav class="public-links">
        <a [routerLink]="['/conocetugym']" routerLinkActive="active">Conoce Gym</a>
        <a [routerLink]="['/planes']" routerLinkActive="active">Planes</a>

        <a [routerLink]="['/login']" class="btn-access" *ngIf="!authService.isLoggedIn()">
          <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
        </a>

        <button class="btn-access logout" (click)="logout()" *ngIf="authService.isLoggedIn()">
          <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </nav>
    </header>
  `,
  // Estilos omitidos por brevedad, asumiendo que ya son correctos.
  styles: [`
    .navbar-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 60px;
      background-color: #2c2c2c;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      z-index: 1000;
    }
    .logo a {
      font-size: 24px;
      font-weight: bold;
      color: #e53935;
      text-decoration: none;
    }
    .public-links {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .public-links a {
      color: #ccc;
      text-decoration: none;
      font-size: 16px;
      padding: 5px 10px;
      transition: color 0.2s, border-bottom 0.2s;
    }
    .public-links a:hover, .public-links a.active {
      color: white;
      border-bottom: 2px solid #e53935;
    }
    .btn-access {
      padding: 8px 15px;
      border-radius: 5px;
      background-color: #e53935;
      color: white !important;
      text-decoration: none;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .btn-access:hover {
      background-color: #c62828;
    }
    .logout {
      background-color: transparent;
      border: 1px solid #e53935;
      color: #e53935 !important;
    }
    .logout:hover {
      background-color: #e53935;
      color: white !important;
    }
  `]
})
export class NavbarComponent implements OnInit {

  // Hacemos el AuthService público para usarlo en el template
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    // Si necesitas inicializar algo al cargar el componente
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout() {
    this.authService.logout();
  }
}
