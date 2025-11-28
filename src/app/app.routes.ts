import { Routes } from '@angular/router';

// 🚨 Importar guards correctamente
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

// ----------------------------------------------------
// Componentes Públicos Existentes
// ----------------------------------------------------
import { HomeComponent } from './pages/home/home.component';
import { PlanesComponent } from './planes/planes.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RegistroPerfilComponent } from './pages/registro-perfil/registro-perfil.component';
import { RestablecerSolicitudComponent } from './pages/restablecer-solicitud/restablecer-solicitud.component';
import { RestablecerConfirmarComponent } from './pages/restablecer-confirmar/restablecer-confirmar.component';

// ----------------------------------------------------
// Componentes Privados - ADMINISTRADOR
// ----------------------------------------------------
import { PanelAdminComponent } from './pages/admin/panel-admin/panel-admin.component';
import { GestionUsuariosComponent } from './pages/admin/gestion-usuarios/gestion-usuarios.component';
import { GestionContenidoComponent } from './pages/admin/gestion-contenido/gestion-contenido.component';
import { GestionNotificacionesComponent } from './pages/admin/gestion-notificaciones/gestion-notificaciones.component';

// ----------------------------------------------------
// Componentes Privados - CLIENTE
// ----------------------------------------------------
import { DashboardClienteComponent } from './pages/dashboard-cliente/dashboard-cliente.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';
import { EntrenamientosComponent } from './pages/entrenamientos/entrenamientos.component';
import { ActividadesExtrasComponent } from './pages/actividades-extras/actividades-extras.component';
import { RecomendacionesComponent } from './pages/recomendaciones/recomendaciones.component';

// 🚨 NUEVO: Importar MembresiaComponent
import { MembresiaComponent } from './pages/membresia/membresia.component';

export const routes: Routes = [

    // ----------------------------------------------------
    // RUTAS PÚBLICAS
    // ----------------------------------------------------
    { path: '', component: HomeComponent, title: 'Inicio | Train Station Gym' },
    { path: 'conocetugym', component: AboutComponent, title: 'Acerca de Nosotros' },
    { path: 'planes', component: PlanesComponent, title: 'Nuestros Planes' },
    { path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },
    { path: 'registro', component: RegistroComponent, title: 'Crear Cuenta' },
    { path: 'registro/perfil', component: RegistroPerfilComponent, title: 'Completar Perfil' },
    { path: 'recuperar', component: RestablecerSolicitudComponent, title: 'Solicitar Restablecimiento' },
    { path: 'restablecer-confirmar', component: RestablecerConfirmarComponent, title: 'Cambiar Contraseña' },

    // ----------------------------------------------------
    // RUTAS PRIVADAS (requieren sesión)
    // ----------------------------------------------------
    {
        path: 'area-privada',
        canActivate: [authGuard],
        children: [

            // CLIENTE
            { path: 'dashboard', component: DashboardClienteComponent, title: 'Dashboard' },
            { path: 'perfil', component: PerfilUsuarioComponent, title: 'Mi Perfil' },
            { path: 'mis-entrenamientos', component: EntrenamientosComponent, title: 'Mis Entrenamientos' },
            { path: 'actividades', component: ActividadesExtrasComponent, title: 'Actividades y Avisos' },
            { path: 'recomendaciones', component: RecomendacionesComponent, title: 'Recomendaciones' },

            // 🚨 NUEVA RUTA PARA "Mi Suscripción"
            { path: 'membresia', component: MembresiaComponent, title: 'Mi Suscripción' },

            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

            // PANEL ADMIN
            {
                path: 'admin',
                canActivate: [adminGuard],
                component: PanelAdminComponent,
                children: [
                    { path: 'usuarios', component: GestionUsuariosComponent, title: 'Administrar Usuarios' },
                    { path: 'contenido', component: GestionContenidoComponent, title: 'Administrar Contenido' },
                    { path: 'notificaciones', component: GestionNotificacionesComponent, title: 'Administrar Notificaciones' },

                    { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
                ]
            }
        ]
    },

    // ----------------------------------------------------
    // RUTA 404
    // ----------------------------------------------------
    { path: '**', redirectTo: '' }
];
