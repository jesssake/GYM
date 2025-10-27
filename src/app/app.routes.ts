import { Routes } from '@angular/router';

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

// ----------------------------------------------------
// Componentes Privados - ADMINISTRADOR (4)
// ----------------------------------------------------
import { PanelAdminComponent } from './pages/admin/panel-admin/panel-admin.component';
import { GestionUsuariosComponent } from './pages/admin/gestion-usuarios/gestion-usuarios.component';
import { GestionContenidoComponent } from './pages/admin/gestion-contenido/gestion-contenido.component';
import { GestionNotificacionesComponent } from './pages/admin/gestion-notificaciones/gestion-notificaciones.component';

// ----------------------------------------------------
// Componentes Privados - CLIENTE (5)
// ----------------------------------------------------
import { DashboardClienteComponent } from './pages/dashboard-cliente/dashboard-cliente.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';
import { EntrenamientosComponent } from './pages/entrenamientos/entrenamientos.component';
import { ActividadesExtrasComponent } from './pages/actividades-extras/actividades-extras.component';
import { RecomendacionesComponent } from './pages/recomendaciones/recomendaciones.component';

// 🚨 IMPORTAR GUARDS AQUÍ (Se crearán más adelante)
// import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
    // ----------------------------------------------------
    // RUTAS PÚBLICAS (Sin sesión)
    // ----------------------------------------------------
    { path: '', component: HomeComponent },
    { path:'conocetugym', component: AboutComponent },
    { path: 'planes', component: PlanesComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'registro/perfil', component: RegistroPerfilComponent },
    { path: 'recuperar', component: RestablecerSolicitudComponent },

    // ----------------------------------------------------
    // RUTAS PRIVADAS (Requiere sesión iniciada)
    // ----------------------------------------------------
    {
        path: 'area-privada',
        // canActivate: [AuthGuard], // 🚨 Descomentar cuando implementes el Guard
        children: [

            // 1. RUTAS DEL CLIENTE (El primer lugar al que va un cliente)
            { path: 'dashboard', component: DashboardClienteComponent },
            { path: 'perfil', component: PerfilUsuarioComponent },
            { path: 'mis-entrenamientos', component: EntrenamientosComponent },
            { path: 'actividades', component: ActividadesExtrasComponent },
            { path: 'recomendaciones', component: RecomendacionesComponent },

            // Redirige la ruta /area-privada al dashboard del cliente por defecto
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

            // 2. PANEL DE ADMINISTRACIÓN (Ruta principal del Admin)
            {
                path: 'admin',
                component: PanelAdminComponent,
                // canActivate: [AdminGuard], // 🚨 Opcional: Usar un guard específico
                children: [
                    // Sub-rutas que se cargan en el <router-outlet> del PanelAdminComponent
                    { path: 'usuarios', component: GestionUsuariosComponent },
                    { path: 'contenido', component: GestionContenidoComponent },
                    { path: 'notificaciones', component: GestionNotificacionesComponent },

                    // Redirige /area-privada/admin a la gestión de usuarios por defecto
                    { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
                ]
            },
        ]
    },

    // ----------------------------------------------------
    // RUTA CATCH-ALL (Cualquier otra ruta no definida va al inicio)
    // ----------------------------------------------------
    { path: '**', redirectTo: '' }
];
