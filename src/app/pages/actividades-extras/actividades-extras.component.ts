import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Añadido CommonModule
 
@Component({
  selector: 'app-actividades-extras',
  standalone: true,
  imports: [CommonModule], // <-- Incluido CommonModule
  templateUrl: './actividades-extras.component.html',
  styleUrl: './actividades-extras.component.css'
})
export class ActividadesExtrasComponent { // <-- Nombre de clase corregido
 
}
