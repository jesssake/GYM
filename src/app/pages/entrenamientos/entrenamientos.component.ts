import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Añadido CommonModule
 
@Component({
  selector: 'app-entrenamientos',
  standalone: true,
  imports: [CommonModule], // <-- Incluido CommonModule
  templateUrl: './entrenamientos.component.html',
  styleUrl: './entrenamientos.component.css'
})
export class EntrenamientosComponent { // <-- Nombre de clase corregido
 
}
