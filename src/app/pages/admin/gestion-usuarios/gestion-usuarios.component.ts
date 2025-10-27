import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Añadido CommonModule

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule], // <-- Incluido CommonModule
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent { // <-- Nombre de clase corregido
}
