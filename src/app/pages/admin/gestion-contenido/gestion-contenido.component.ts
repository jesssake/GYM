import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Añadido CommonModule

@Component({
  selector: 'app-gestion-contenido',
  standalone: true,
  imports: [CommonModule], // <-- Incluido CommonModule
  templateUrl: './gestion-contenido.component.html',
  styleUrl: './gestion-contenido.component.css'
})
export class GestionContenidoComponent { // <-- Nombre de clase corregido
}
