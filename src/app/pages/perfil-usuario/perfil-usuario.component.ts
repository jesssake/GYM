import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Añadido CommonModule
 
@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule], // <-- Incluido CommonModule
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent { // <-- Nombre de clase corregido
 
}
