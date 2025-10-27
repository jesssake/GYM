import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Añadido CommonModule
 
@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule], // <-- Incluido CommonModule
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent { // <-- Nombre de clase corregido
 
}
