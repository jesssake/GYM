import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';

// 🚨 Interfaces para tipado fuerte
interface Aviso {
  titulo: string;
  contenido: string;
  fecha: string; // Usamos string para representar el ISO Date/Time
}

interface Actividad {
  id: number;
  titulo: string;
  fecha: string;
  fechaFin: string | null; // Puede ser null
  descripcion: string;
  inscrito: boolean;
}

@Component({
  selector: 'app-actividades-extras',
  standalone: true,
  imports: [CommonModule, DatePipe, NgIf, NgFor],
  templateUrl: './actividades-extras.component.html',
  styleUrl: './actividades-extras.component.css'
})
export class ActividadesExtrasComponent implements OnInit {

  // 🚨 Usamos las interfaces. Estos datos deberían venir de un servicio real.
  actividades: Actividad[] = [
    { id: 101, titulo: 'Clase de Yoga para Principiantes', fecha: '2025-10-30T18:00:00', fechaFin: null, descripcion: 'Sesión de relajación y estiramiento para liberar tensión.', inscrito: false },
    { id: 102, titulo: 'Taller de Nutrición Deportiva', fecha: '2025-11-01T10:00:00', fechaFin: '2025-11-01T12:00:00', descripcion: 'Aprende a planificar tus comidas pre y post-entreno para optimizar resultados.', inscrito: true },
    { id: 103, titulo: 'Torneo de Levantamiento', fecha: '2025-11-15T16:00:00', fechaFin: '2025-11-15T20:00:00', descripcion: '¡Pon a prueba tu fuerza contra otros miembros del gimnasio! Habrá premios.', inscrito: false },
  ];

  avisos: Aviso[] = [
    { titulo: 'Aviso de Cierre', contenido: 'El gimnasio estará cerrado el 31 de octubre por mantenimiento general. Disculpe las molestias.', fecha: '2025-10-29T10:00:00' },
    { titulo: 'Nueva Política COVID', contenido: 'Recuerda usar mascarilla en áreas comunes según la nueva normativa de higiene y seguridad.', fecha:'2025-10-28T09:00:00' }
  ];

  constructor() { }

  ngOnInit(): void { }

  // 🚨 Tipamos el parámetro
  inscribirse(actividadId: number): void {
    const actividad = this.actividades.find(a => a.id === actividadId);
    if (actividad) {
      actividad.inscrito = true;
      console.log(`Te has inscrito exitosamente a: ${actividad.titulo}`);
      // Aquí iría una llamada a un servicio de Notificación (snackbar) en un proyecto real.
    }
  }

  // 🚨 Tipamos el parámetro
  cancelarInscripcion(actividadId: number): void {
    const actividad = this.actividades.find(a => a.id === actividadId);
    if (actividad) {
      actividad.inscrito = false;
      console.log(`Inscripción cancelada para: ${actividad.titulo}`);
      // Aquí iría una llamada a un servicio de Notificación (snackbar) en un proyecto real.
    }
  }
}
