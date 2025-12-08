import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 🧹 Eliminamos RouterLink y RouterLinkActive de las importaciones
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-panel-admin',
  standalone: true,

  imports: [CommonModule, RouterOutlet],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent {
  // No se necesita código aquí por ahora, el componente actúa solo como un layout contenedor.
}
