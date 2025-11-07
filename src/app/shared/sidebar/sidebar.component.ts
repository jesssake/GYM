import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioStateService } from '../../services/usuario-state.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Necesario para 'tap'

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  // Opcional pero ayuda a aislar el componente para mejor rendimiento:
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

  currentRole: 'Cliente' | 'Admin' | null = null;
  menuItems: NavItem[] = [];

  // Variable pública para el Observable de la foto
  public fotoPerfilSidebar$!: Observable<string>;

  // Menús definidos según el rol
  private menuCliente: NavItem[] = [
    { path: '/area-privada/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { path: '/area-privada/perfil', icon: 'fa-user-circle', label: 'Mi Perfil' },
    { path: '/area-privada/mis-entrenamientos', icon: 'fa-dumbbell', label: 'Mis Entrenamientos' },
    { path: '/area-privada/actividades', icon: 'fa-calendar-alt', label: 'Actividades Extras' },
    { path: '/area-privada/recomendaciones', icon: 'fa-heartbeat', label: 'Recomendaciones' },
  ];

  private menuAdmin: NavItem[] = [
    { path: '/area-privada/admin/usuarios', icon: 'fa-users-cog', label: 'Gestión de Usuarios' },
    { path: '/area-privada/admin/contenido', icon: 'fa-file-alt', label: 'Gestión de Contenido' },
    { path: '/area-privada/admin/notificaciones', icon: 'fa-bell', label: 'Notificaciones y Avisos' },
  ];

  // Inyectar ambos servicios Y ChangeDetectorRef
  constructor(
    private authService: AuthService,
    private usuarioStateService: UsuarioStateService,
    private cdr: ChangeDetectorRef // 🚨 CLAVE: Inyección para detección manual
  ) { }

  ngOnInit(): void {
    // 🚨 CLAVE: Conectar el Observable y usar 'tap' para forzar la detección de cambios
    this.fotoPerfilSidebar$ = this.usuarioStateService.fotoPerfilActual$.pipe(
      tap(() => {
        // Forzar la detección de cambios cada vez que llega un nuevo valor
        this.cdr.detectChanges();
        console.log('[SIDEBAR] Detección de cambios forzada tras recibir nueva foto.');
      })
    );

    // 1. Obtenemos el rol actual del servicio
    this.currentRole = this.authService.getUserRole();

    // 2. Establecemos los items del menú basados en el rol
    if (this.currentRole === 'Admin') {
      this.menuItems = this.menuAdmin;
    } else if (this.currentRole === 'Cliente') {
      this.menuItems = this.menuCliente;
    } else {
      this.menuItems = [];
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
