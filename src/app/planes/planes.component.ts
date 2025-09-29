import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule],
  // CORRECCIÓN CLAVE: Usamos templateUrl y styleUrl
  templateUrl: './planes.component.html',
  styleUrl: './planes.component.css'
})
export class PlanesComponent { }
