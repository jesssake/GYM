import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioStateService } from '../../services/usuario-state.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioApiService } from '../../services/usuario-api.service';
import { HttpClientModule } from '@angular/common/http';

// ------------------------------------------------------------------
// INTERFACES LOCALES
// ------------------------------------------------------------------
interface MembresiaStatus {
    plan_name: string;
    fecha_fin: string;
    days_remaining: number;
}

interface Aviso {
    titulo: string;
    mensaje: string;
    fecha_inicio: string;
}
// ------------------------------------------------------------------

@Component({
    selector: 'app-dashboard-cliente',
    standalone: true,
    imports: [CommonModule, RouterLink, HttpClientModule],
    templateUrl: './dashboard-cliente.component.html',
    styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent implements OnInit, OnDestroy {

    userName: string = 'Cargando...';
    userLevel: string = 'Cargando...';
    private userSubscription: Subscription | undefined;

    membershipStatus: MembresiaStatus | null = null;
    currentRoutineTitle: string = 'Cargando Rutina...';
    activeNotices: Aviso[] = [];

    isRoutineLoading: boolean = true;
    isMembresiaLoading: boolean = true;

    metrics = [
        { label: 'Días restantes de membresía', value: 'N/A', icon: 'fa-calendar-alt' },
        { label: 'Entrenamientos Completados', value: 0, icon: 'fa-dumbbell' },
        { label: 'Calorías Quemadas (Semanal)', value: 0, icon: 'fa-fire' },
    ];

    quickActions = [
        { title: 'Ver Rutina de Hoy', icon: 'fa-bolt', path: '/area-privada/mis-entrenamientos' },
        { title: 'Reservar Actividad Extra', icon: 'fa-calendar-check', path: '/area-privada/actividades' },
        { title: 'Editar Mi Perfil', icon: 'fa-user-circle', path: '/area-privada/perfil' },
    ];

    constructor(
        private usuarioStateService: UsuarioStateService,
        private authService: AuthService,
        private usuarioService: UsuarioApiService
    ) { }

    ngOnInit(): void {
        this.loadUserDataFromState();
        this.loadMembershipStatus();
        this.loadCurrentRoutine();
        this.loadActiveNotices();
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    // --------------------------------------------------
    // CARGA DE DATOS DESDE EL STATE
    // --------------------------------------------------
    loadUserDataFromState(): void {
        this.userSubscription = this.usuarioStateService.user$.subscribe(user => {
            if (user && user.nombre) {
                this.userName = user.nombre;
                this.userLevel = this.mapMetaToLevel(user.meta);
            }
        });
    }

    // --------------------------------------------------
    // PETICIONES AL BACKEND (UsuarioApiService)
    // --------------------------------------------------

    loadMembershipStatus(): void {
        this.isMembresiaLoading = true;

        this.usuarioService.getMembershipStatus().subscribe({
            next: (response: any) => {
                if (response.ok && response.status) {
                    this.membershipStatus = response.status;

                    const daysMetric = this.metrics.find(m => m.label.includes('Días restantes'));
                    if (daysMetric) {
                        daysMetric.value = response.status.days_remaining;
                    }
                }
                this.isMembresiaLoading = false;
            },
            error: (err: any) => {
                console.error('❌ Error al cargar estado de membresía:', err);
                this.isMembresiaLoading = false;
            }
        });
    }

    loadCurrentRoutine(): void {
        this.isRoutineLoading = true;

        this.usuarioService.getCurrentRoutine().subscribe({
            next: (response: any) => {
                if (response.ok && response.routine) {
                    this.currentRoutineTitle = response.routine.titulo;
                } else {
                    this.currentRoutineTitle = 'No tienes una rutina asignada.';
                }
                this.isRoutineLoading = false;
            },
            error: (err: any) => {
                console.error('❌ Error al cargar rutina:', err);
                this.currentRoutineTitle = 'Error al cargar rutina.';
                this.isRoutineLoading = false;
            }
        });
    }

    loadActiveNotices(): void {
        this.usuarioService.getActiveNotices().subscribe({
            next: (response: any) => {
                if (response.ok && response.avisos) {
                    this.activeNotices = response.avisos;
                }
            },
            error: (err: any) => {
                console.error('❌ Error al cargar avisos:', err);
            }
        });
    }

    // --------------------------------------------------
    // AUXILIARES
    // --------------------------------------------------
    getGreeting(): string {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    }

    private mapMetaToLevel(meta: string | null): string {
        if (!meta) return 'General';
        switch (meta) {
            case 'perder-peso': return 'Pérdida de Peso';
            case 'ganar-musculo': return 'Ganancia Muscular';
            case 'mantenerse': return 'Mantenimiento';
            default: return 'General';
        }
    }
}
