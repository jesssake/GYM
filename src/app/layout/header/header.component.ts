import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- DEBES IMPORTAR ESTO

@Component({
  selector: 'app-header',
  standalone: true,
  // CORRECCIÓN CLAVE: Agrega RouterModule a los imports
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent { }
