import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

// 🚨 Interfaces para tipado fuerte
interface Rutina {
  id: number;
  nombre: string;
  foco: string;
  estado: 'Pendiente' | 'Completada'; // Tipado más específico
}

interface Ejercicio {
  nombre: string;
  series: number;
  repeticiones: string;
  musculo: string;
  completado: boolean;
}

@Component({
  selector: 'app-entrenamientos',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './entrenamientos.component.html',
  styleUrl: './entrenamientos.component.css'
})
export class EntrenamientosComponent implements OnInit {

  // 🚨 Usamos las interfaces aquí
  rutinas: Rutina[] = [
    { id: 1, nombre: 'Rutina Básico - Lunes (Pecho/Tríceps)', foco: 'Fuerza', estado: 'Pendiente' },
    { id: 2, nombre: 'Rutina Básico - Miércoles (Espalda/Bíceps)', foco: 'Volumen', estado: 'Completada' },
    { id: 3, nombre: 'Rutina Básico - Viernes (Piernas/Hombros)', foco: 'Resistencia', estado: 'Pendiente' },
  ];

  // 🚨 Usamos la interfaz (o null si no hay selección)
  rutinaSeleccionada: Rutina | null = null;

  ejerciciosDetalle: Ejercicio[] = [
    // ... tus ejercicios ...
    { nombre: 'Press Banca Inclinado', series: 4, repeticiones: '10-12', musculo: 'Pecho superior', completado: false },
    { nombre: 'Cruce de Poleas', series: 3, repeticiones: '15', musculo: 'Pecho', completado: false },
    { nombre: 'Extensión de Tríceps en Polea', series: 4, repeticiones: '10', musculo: 'Tríceps', completado: false },
  ];

  constructor() { }

  ngOnInit(): void {
    if (this.rutinas.length > 0) {
      this.seleccionarRutina(this.rutinas[0]);
    }
  }

  // 🚨 Tipamos el parámetro
  seleccionarRutina(rutina: Rutina): void {
    this.rutinaSeleccionada = rutina;
    // Simulación: Resetea el estado de los ejercicios al cambiar de rutina
    this.ejerciciosDetalle.forEach(e => e.completado = false);
    console.log('[ACCION] Rutina seleccionada:', rutina.nombre);
  }

  // 🚨 Tipamos el parámetro
  marcarEjercicioCompletado(ejercicio: Ejercicio): void {
    ejercicio.completado = !ejercicio.completado;
    console.log(`[ACCION] Ejercicio ${ejercicio.nombre} estado: ${ejercicio.completado ? 'Completado' : 'Pendiente'}`);
  }
}
