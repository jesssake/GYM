import { Routes } from '@angular/router';
// 🚨 CORRECCIÓN: Importar ambos guards
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard'; // <--- NUEVO IMPORT

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


export const routes: Routes = [
	// ----------------------------------------------------
	// RUTAS PÚBLICAS
	// ----------------------------------------------------
	{ path: '', component: HomeComponent, title: 'Inicio | Train Station Gym' },
	{ path:'conocetugym', component: AboutComponent, title: 'Acerca de Nosotros' },
	{ path: 'planes', component: PlanesComponent, title: 'Nuestros Planes' },
	{ path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },
	{ path: 'registro', component: RegistroComponent, title: 'Crear Cuenta' },
	{ path: 'registro/perfil', component: RegistroPerfilComponent, title: 'Completar Perfil' },
	{ path: 'recuperar', component: RestablecerSolicitudComponent, title: 'Restablecer Contraseña' },

	// ----------------------------------------------------
	// RUTAS PRIVADAS (Requiere sesión iniciada)
	// ----------------------------------------------------
	{
		path: 'area-privada',
		// 🚨 Capa 1: Proteger todo el área con authGuard (verifica sesión activa)
		canActivate: [authGuard],
		children: [

			// 1. RUTAS DEL CLIENTE (Acceso a todos los logueados)
			{ path: 'dashboard', component: DashboardClienteComponent, title: 'Dashboard' },
			{ path: 'perfil', component: PerfilUsuarioComponent, title: 'Mi Perfil' },
			{ path: 'mis-entrenamientos', component: EntrenamientosComponent, title: 'Mis Entrenamientos' },
			{ path: 'actividades', component: ActividadesExtrasComponent, title: 'Actividades y Avisos' },
			{ path: 'recomendaciones', component: RecomendacionesComponent, title: 'Recomendaciones' },

			// Redirige la ruta /area-privada
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },

			// 2. PANEL DE ADMINISTRACIÓN
			{
				path: 'admin',
				// 🚨 Capa 2: Proteger por rol con adminGuard
				canActivate: [adminGuard],
				component: PanelAdminComponent,
				children: [
					// Sub-rutas que se cargan en el <router-outlet> del PanelAdminComponent
					{ path: 'usuarios', component: GestionUsuariosComponent, title: 'Administrar Usuarios ' },
					{ path: 'contenido', component: GestionContenidoComponent, title: 'Administrar Contenido' },
					{ path: 'notificaciones', component: GestionNotificacionesComponent, title: 'Administrar Notificaciones' },

					// Redirige /area-privada/admin por defecto
					{ path: '', redirectTo: 'usuarios', pathMatch: 'full' },
				]
			},
		]
	},
	// ----------------------------------------------------
	// RUTA CATCH-ALL (404)
	// ----------------------------------------------------
	{ path: '**', redirectTo: '' } // Redirige cualquier ruta no definida al inicio
];
