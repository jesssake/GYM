import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlanesComponent } from './planes/planes.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';
// 1. IMPORTAR EL NUEVO COMPONENTE DE REGISTRO
import { RegistroComponent } from './pages/registro/registro.component';

// *******************************************************************
// PASO CLAVE: IMPORTAR EL COMPONENTE DEL PASO 2
import { RegistroPerfilComponent } from './pages/registro-perfil/registro-perfil.component';
// *******************************************************************


export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },

    {
        path:'conocetugym',
        component: AboutComponent
    },

    {
        path: 'planes',
        component: PlanesComponent
    },

    {
        path: 'login',
        component: LoginComponent
    },

    // 2. AÑADIR LA RUTA DEL REGISTRO (Paso 1)
    {
        path: 'registro',
        component: RegistroComponent
    },

    // *******************************************************************
    // PASO CLAVE: AÑADIR LA RUTA DEL PASO 2
    {
        path: 'registro/perfil', // <--- RUTA QUE SE ESPERA DESDE EL PASO 1
        component: RegistroPerfilComponent
    },
    // *******************************************************************

    {
        path: '**',
        redirectTo: ''
    }
];
