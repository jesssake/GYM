import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlanesComponent } from './planes/planes.component';
import { AboutComponent } from './pages/about/about.component';
// 1. IMPORTAR EL NUEVO COMPONENTE DE LOGIN
import { LoginComponent } from './pages/login/login.component';

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

    // 2. AÑADIR LA RUTA FINAL DE LOGIN
    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: '**',
        redirectTo: ''
    }
];
