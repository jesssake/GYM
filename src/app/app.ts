import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router'; // Asegúrate de importar RouterOutlet

// Ya no necesitamos importar HomeComponent ni PlanesComponent aquí si usamos RouterOutlet
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Permite que funcione el router
    RouterOutlet, // Permite que funcione <router-outlet>
    HeaderComponent,
    FooterComponent,
    // Eliminamos HomeComponent y PlanesComponent de imports
  ],
  // CORRECCIÓN CLAVE: El contenido principal ahora lo maneja el router
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styleUrl: './app.css'
})
export class App {}
