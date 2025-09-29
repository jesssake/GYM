import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

// CORRECCIÓN CLAVE: Quitamos 'pages/' para que apunte directamente a la subcarpeta 'planes'
import { PlanesComponent } from './planes/planes.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'planes',
        component: PlanesComponent // Componente Planes se carga SOLO en /planes
    },
    // Ruta de redirección si se introduce una URL desconocida
    {
        path: '**',
        redirectTo: ''
    }
];
