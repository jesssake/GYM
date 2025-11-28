import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

// ------------------------------------------------------------
// 1. 📝 Nuevas Interfaces basadas en el backend
// ------------------------------------------------------------
interface EjercicioDetalle {
  orden: number;
  nombre: string;
  descripcion: string;
  video_url: string;
  series: number;
  repeticiones: string;
  descanso: string;
  completado: boolean;
}

interface RutinaDetallada {
  titulo: string;
  objetivo: string;
  dificultad: string;
  dias: {
    [dia_semana: string]: EjercicioDetalle[];
  };
}

interface RutinaResponse {
  ok: boolean;
  rutina: RutinaDetallada | null;
  msg?: string;
}

// ------------------------------------------------------------
// 2. 🔗 Importar el servicio que trae la rutina desde backend
// ------------------------------------------------------------
import { UsuarioApiService } from '../../services/usuario-api.service';

@Component({
  selector: 'app-entrenamientos',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './entrenamientos.component.html',
  styleUrl: './entrenamientos.component.css'
})
export class EntrenamientosComponent implements OnInit {

  isLoading: boolean = true;
  errorMessage: string | null = null;

  // 🎯 Rutina completa del usuario (agrupada por días)
  rutinaDetalle: RutinaDetallada | null = null;

  // 📅 Lista de días recibidos del backend
  diasRutina: string[] = [];

  // 📌 Día seleccionado (ej: 'Lunes')
  diaSeleccionado: string | null = null;

  // 🏋🏼‍♂️ Lista de ejercicios del día seleccionado
  ejerciciosDelDia: EjercicioDetalle[] = [];

  constructor(private usuarioService: UsuarioApiService) { }

  ngOnInit(): void {
    this.cargarRutinaCompleta();
  }

  // ------------------------------------------------------------
  // 3. 🔥 Obtener la rutina real desde el backend
  // ------------------------------------------------------------
  cargarRutinaCompleta(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.usuarioService.getRoutineDetails().subscribe({
      next: (response: RutinaResponse) => {

        if (response.ok && response.rutina) {
          this.rutinaDetalle = response.rutina;

          // 1️⃣ Extraer la lista de días
          this.diasRutina = Object.keys(response.rutina.dias);

          // 2️⃣ Elegir el primer día por defecto
          if (this.diasRutina.length > 0) {
            this.seleccionarDia(this.diasRutina[0]);
          }

        } else if (response.rutina === null) {
          this.errorMessage = response.msg || 'No tienes una rutina asignada.';
        } else {
          this.errorMessage = response.msg || 'Error al cargar la rutina.';
        }

        this.isLoading = false;
      },

      error: (err: any) => {
        this.errorMessage = err.error?.msg || 'Error de conexión con el servidor.';
        this.isLoading = false;
      }
    });
  }

  // ------------------------------------------------------------
  // 4. 📅 Seleccionar un día de la rutina
  // ------------------------------------------------------------
  seleccionarDia(dia: string): void {
    if (this.rutinaDetalle && this.rutinaDetalle.dias[dia]) {

      this.diaSeleccionado = dia;

      // Copiar ejercicios del día
      this.ejerciciosDelDia = this.rutinaDetalle.dias[dia];

      // Asegurar que cada ejercicio tenga propiedad 'completado'
      this.ejerciciosDelDia.forEach(e => {
        if (typeof e.completado === 'undefined') {
          e.completado = false;
        }
      });

      console.log(`➡️ Día seleccionado: ${dia}`);
    }
  }

  // ------------------------------------------------------------
  // 5. ✔️ Marcar ejercicio como completado
  // ------------------------------------------------------------
  marcarEjercicioCompletado(ejercicio: EjercicioDetalle): void {
    ejercicio.completado = !ejercicio.completado;

    console.log(
      `🏋🏻 Ejercicio ${ejercicio.nombre}: ` +
      (ejercicio.completado ? 'Completado' : 'Pendiente')
    );

    // 💡 Aquí puedes enviar avance al backend (opcional)
  }

  // ------------------------------------------------------------
  // 6. ▶️ Abrir video del ejercicio (YouTube)
  // ------------------------------------------------------------
  verVideo(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
