import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule],
  // CAMBIO CLAVE: Usamos templateUrl y styleUrl para usar archivos externos
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.css'
})
export class PlanesComponent { }
