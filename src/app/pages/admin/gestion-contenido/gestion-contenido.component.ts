import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🚨 IMPORTAR FormsModule para los inputs

@Component({
  selector: 'app-gestion-contenido',
  standalone: true,
  // 🚨 INCLUIR FormsModule
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-contenido.component.html',
  styleUrl: './gestion-contenido.component.css'
})
export class GestionContenidoComponent {

  // Variables para el formulario de Rutinas
  routineName: string = '';
  routineDescription: string = '';
  // El input de tipo file (imagen) se maneja mejor con eventos, no con ngModel

  // Variables para el formulario de Actividades/Avisos
  noticeTitle: string = '';
  noticeContent: string = '';
  startDate: string = ''; // Usar string para datetime-local
  endDate: string = ''; // Usar string para datetime-local

  // Métodos de guardado (solo para demostración)
  guardarRutina() {
    console.log('Guardando Rutina:', this.routineName);
    alert('✅ Rutina guardada.');
  }

  guardarActividad() {
    console.log('Guardando Actividad/Aviso:', this.noticeTitle);
    alert('✅ Actividad/Aviso guardado.');
  }
}
