import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service'; // 🚨 Importar UserRole
import { UsuarioStateService } from '../../services/usuario-state.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

    // 🚨 CORRECCIÓN CLAVE: Usamos el tipo UserRole que incluye 'Coach' | 'Administrador' | 'Cliente' | null.
    // Opcionalmente, puedes definirlo inline así: currentRole: 'Cliente' | 'Administrador' | 'Coach' | null = null;
    currentRole: UserRole = null;
    menuItems: NavItem[] = [];

    public fotoPerfilSidebar$!: Observable<string>;

    // --------------------------------------------------------
    // MENÚ DEL CLIENTE
    // --------------------------------------------------------
    private menuCliente: NavItem[] = [
        { path: '/area-privada/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
        { path: '/area-privada/perfil', icon: 'fa-user-circle', label: 'Mi Perfil' },
        { path: '/area-privada/mis-entrenamientos', icon: 'fa-dumbbell', label: 'Mis Entrenamientos' },
        { path: '/area-privada/actividades', icon: 'fa-calendar-alt', label: 'Actividades Extras' },
        { path: '/area-privada/recomendaciones', icon: 'fa-heartbeat', label: 'Recomendaciones' },
        { path: '/area-privada/membresia', icon: 'fa-credit-card', label: 'Mi Suscripción' },
    ];

    // --------------------------------------------------------
    // MENÚ DEL COACH 🚨 NUEVO
    // --------------------------------------------------------
    private menuCoach: NavItem[] = [
        { path: '/area-privada/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard Coach' },
        { path: '/area-privada/coach/clientes', icon: 'fa-users', label: 'Gestión de Clientes' },
        { path: '/area-privada/coach/rutinas-personalizadas', icon: 'fa-id-card', label: 'Crear Rutinas' },
        { path: '/area-privada/perfil', icon: 'fa-user-circle', label: 'Mi Perfil' },
    ];

    // --------------------------------------------------------
    // MENÚ DEL ADMIN
    // --------------------------------------------------------
    private menuAdmin: NavItem[] = [
        { path: '/area-privada/admin/usuarios', icon: 'fa-users-cog', label: 'Gestión de Usuarios' },
        { path: '/area-privada/admin/contenido', icon: 'fa-file-alt', label: 'Gestión de Contenido' },
        { path: '/area-privada/admin/notificaciones', icon: 'fa-bell', label: 'Notificaciones y Avisos' },
    ];

    constructor(
        private authService: AuthService,
        private usuarioStateService: UsuarioStateService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.fotoPerfilSidebar$ = this.usuarioStateService.user$.pipe(
            map(user => user.fotoUrl || 'assets/default-profile.png'),
            tap(() => this.cdr.detectChanges())
        );

        // Obtener rol del usuario
        this.currentRole = this.authService.getUserRole();

        if (this.currentRole === 'Administrador') {
            this.menuItems = this.menuAdmin;
        }
        // 🚨 NUEVA CONDICIÓN PARA EL ROL COACH
        else if (this.currentRole === 'Coach') {
            this.menuItems = this.menuCoach;
        }
        else if (this.currentRole === 'Cliente') {
            this.menuItems = this.menuCliente;
        } else {
            this.menuItems = [];
        }
    }

    logout(): void {
        this.authService.logout();
    }
}
