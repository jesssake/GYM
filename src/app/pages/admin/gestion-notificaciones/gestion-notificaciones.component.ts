import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🚨 IMPORTAR FormsModule

@Component({
  selector: 'app-gestion-notificaciones',
  standalone: true,
  // 🚨 INCLUIR FormsModule
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-notificaciones.component.html',
  styleUrl: './gestion-notificaciones.component.css'
})
export class GestionNotificacionesComponent {

  // 🚨 Variable para manejar el valor seleccionado en el select
  selectedDays: string = '7 días';

  guardarConfiguracion() {
    // Aquí iría la lógica para enviar this.selectedDays al backend.
    alert(`✅ Configuración de alerta guardada: ${this.selectedDays} de antelación.`);
  }

  // 🚨 Datos de ejemplo para la lista de clientes (simulando un *ngFor)
  clients = [
    { name: 'Sofia Martínez', email: 'sofia.m@example.com', expirationDate: '2025-11-01', status: 'Por terminar (5 días)', statusClass: 'status-warning' },
    { name: 'Roberto Díaz', email: 'roberto.d@example.com', expirationDate: '2025-10-25', status: 'Terminada', statusClass: 'status-danger' },
    { name: 'Ana López', email: 'ana.l@example.com', expirationDate: '2025-11-03', status: 'Activa (10 días)', statusClass: 'status-ok' },
  ];
}
