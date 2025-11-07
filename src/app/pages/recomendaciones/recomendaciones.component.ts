import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// 🚨 Interfaces para tipado fuerte
interface EntrenamientoRecomendado {
  id: number;
  titulo: string;
  descripcion: string;
  meta: string;
}

interface ArticuloRecomendado {
  id: number;
  titulo: string;
  url: string;
  categoria: string;
}

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendaciones.component.html',
  styleUrl: './recomendaciones.component.css'
})
export class RecomendacionesComponent implements OnInit {

  metaUsuario: string = 'Ganar Músculo';

  // 🚨 Usamos las interfaces
  entrenamientosRecomendados: EntrenamientoRecomendado[] = [
    { id: 201, titulo: 'Rutina Full Body Rápida', descripcion: 'Ideal para días ocupados, ejercita todos los músculos principales en 45 min.', meta: 'Mantenimiento' },
    { id: 202, titulo: 'Sesión de Cardio Intervalos (HIIT)', descripcion: 'Quema máxima grasa en poco tiempo. Recomendado 3 veces por semana.', meta:'Pérdida de Peso' },
  ];

  articulosRecomendados: ArticuloRecomendado[] = [
    { id: 301, titulo: 'La Importancia del Descanso Activo', url: '#', categoria: 'Recuperación' },
    { id: 302, titulo: 'Los 5 Errores Nutricionales de los Principiantes', url: '#', categoria: 'Nutrición' },
  ];

  constructor() { }

  ngOnInit(): void { }

  verDetalleEntrenamiento(titulo: string): void {
    alert(`[ACCION] Redirigiendo a detalles de: ${titulo}`);
  }

  verArticulo(url: string, event: Event): void {
    event.preventDefault();
    alert(`[ACCION] Simulando apertura de artículo.`);
  }
}
