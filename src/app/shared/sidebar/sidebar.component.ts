import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';
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
    styleUrls: ['./sidebar.component.css'],   // ✔ CORREGIDO
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

    // ✔ URL base del backend para mostrar imágenes
    private readonly BASE_UPLOAD_URL = 'http://localhost:5000';

    currentRole: UserRole | null = null;
    menuItems: NavItem[] = [];

    fotoPerfilSidebar$!: Observable<string>;

    // --------------------------------------------------------
    // MENÚ CLIENTE
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
    // MENÚ COACH
    // --------------------------------------------------------
    private menuCoach: NavItem[] = [
        { path: '/area-privada/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard Coach' },
        { path: '/area-privada/coach/clientes', icon: 'fa-users', label: 'Gestión de Clientes' },
        { path: '/area-privada/coach/rutinas-personalizadas', icon: 'fa-id-card', label: 'Crear Rutinas' },
        { path: '/area-privada/perfil', icon: 'fa-user-circle', label: 'Mi Perfil' },
    ];

    // --------------------------------------------------------
    // MENÚ ADMIN
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

        // ✔ CORRECCIÓN: cambiar usuario$ → user$ y prefijar URLs relativas
        this.fotoPerfilSidebar$ = this.usuarioStateService.user$.pipe(
            map(user => {
                const fotoUrl = user?.fotoUrl;

                if (fotoUrl && fotoUrl.startsWith('/uploads')) {
                    return this.BASE_UPLOAD_URL + fotoUrl;
                }

                return fotoUrl || 'assets/default-profile.png';
            }),
            tap(() => this.cdr.detectChanges())
        );

        // Obtener rol del usuario
        this.currentRole = this.authService.getUserRole();

        if (this.currentRole === 'Administrador') {
            this.menuItems = this.menuAdmin;
        } else if (this.currentRole === 'Coach') {
            this.menuItems = this.menuCoach;
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
