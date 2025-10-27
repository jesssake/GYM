import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Añadido CommonModule
 
@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule], // <-- Incluido CommonModule
  templateUrl: './recomendaciones.component.html',
  styleUrl: './recomendaciones.component.css'
})
export class RecomendacionesComponent { // <-- Nombre de clase corregido
 
}
