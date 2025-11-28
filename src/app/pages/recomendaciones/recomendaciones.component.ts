// src/app/pages/recomendaciones/recomendaciones.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioApiService } from '../../services/usuario-api.service'; // 🚨 Importar el servicio

// ----------------------------------------------------
// INTERFACES (Ajustamos para ser más flexibles/realistas de una API)
// ----------------------------------------------------
interface Recomendacion {
  id: number;
  titulo: string;
  descripcion: string;
  meta: string;
  tipo: 'entrenamiento' | 'articulo'; // Agregamos un tipo para diferenciarlos si vienen juntos
  url?: string; // Para artículos
  categoria?: string; // Para artículos
}

// Nota: Mantendremos las interfaces originales para consistencia si el backend las separa:
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

// ----------------------------------------------------
// COMPONENTE CORREGIDO
// ----------------------------------------------------
@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendaciones.component.html',
  styleUrl: './recomendaciones.component.css'
})
export class RecomendacionesComponent implements OnInit {

  // Propiedades para mostrar
  metaUsuario: string = 'Cargando...';
  entrenamientosRecomendados: EntrenamientoRecomendado[] = [];
  articulosRecomendados: ArticuloRecomendado[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // 🚨 Inyectamos el servicio
  constructor(private usuarioService: UsuarioApiService) { }

  ngOnInit(): void {
    this.cargarRecomendaciones();
  }

  cargarRecomendaciones(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.usuarioService.getRecommendations().subscribe({
      next: (res: any) => { // Usamos 'any' porque no tenemos la interfaz de respuesta de esta API
        if (res.ok) {
          // Asumimos que la respuesta trae la meta y las listas separadas
          this.metaUsuario = res.userMeta || 'General';

          // 🚨 Reemplazamos los datos estáticos con los de la API
          this.entrenamientosRecomendados = res.entrenamientos || [];
          this.articulosRecomendados = res.articulos || [];

        } else {
          this.errorMessage = res.msg || 'Error al cargar las recomendaciones.';
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar recomendaciones:', err);
        this.errorMessage = 'Error de conexión con el servidor.';
        this.isLoading = false;
      }
    });
  }

  // ----------------------------------------------------
  // ACCIONES
  // ----------------------------------------------------
  verDetalleEntrenamiento(titulo: string): void {
    alert(`[ACCION] Redirigiendo a detalles de: ${titulo}`);
    // Aquí podrías usar this.router.navigate(['/entrenamiento', id]);
  }

  verArticulo(url: string, event: Event): void {
    event.preventDefault();
    alert(`[ACCION] Redirigiendo a artículo: ${url}`);
    // Aquí podrías abrir la URL en una nueva pestaña: window.open(url, '_blank');
  }
}
