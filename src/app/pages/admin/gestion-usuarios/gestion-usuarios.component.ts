import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🚨 Necesario para [(ngModel)] en el input

// 🚨 Define la estructura de tus datos
interface User {
  id: number;
  name: string;
  role: 'Cliente' | 'Coach';
  actions: string[]; // ['Cambiar Rol'], ['Eliminar Coach']
}

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  // 🚨 Añadimos FormsModule para el Two-Way Data Binding del buscador
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent implements OnInit {

  searchTerm: string = '';

  // 🚨 Datos de ejemplo
  users: User[] = [
    { id: 1, name: 'Cliente Juan Pérez', role: 'Cliente', actions: ['Cambiar Rol'] },
    { id: 2, name: 'Coach María Gómez', role: 'Coach', actions: ['Cambiar Rol', 'Eliminar Coach'] },
  ];

  ngOnInit(): void { }

  // 🚨 Métodos para la interactividad (botón Buscar)
  buscarUsuarios() {
    console.log('Buscando:', this.searchTerm);
    // Aquí iría tu lógica de filtro
  }

  cambiarRol(userId: number) {
    alert(`Cambiando rol para el usuario ID: ${userId}`);
    // Implementar lógica de servicio
  }

  eliminarCoach(userId: number) {
    alert(`Eliminando Coach con ID: ${userId}`);
    // Implementar lógica de servicio
  }

  agregarEntrenador() {
    alert('Abriendo formulario para Agregar Entrenador.');
  }
}
