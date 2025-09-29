import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// CORRECCIÓN CLAVE: ¡Ruta DIRECTA! (Las carpetas están dentro de la misma carpeta)
// Desde /src/app/pages/home/ buscamos en /hero/ y /services/
import { HeroComponent } from './hero/hero.component';
import { ServicesComponent } from './services/services.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    ServicesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
