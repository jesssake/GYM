import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Añadido CommonModule
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // <-- Añadidos módulos de Routing

@Component({
  selector: 'app-panel-admin',
  standalone: true, // <-- El componente es standalone
  // CORRECCIÓN CLAVE: Incluir CommonModule y los módulos de Routing
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
// CORRECCIÓN: Usamos el nombre de clase completo para consistencia
export class PanelAdminComponent {
  // No se necesita código aquí por ahora
}
