import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 🚨 Importar el servicio y las interfaces
import {
  UsuarioApiService,
  Actividad,
  Aviso,
  NoticeResponse,
  ActivityResponse,
  GeneralResponse
} from '../../services/usuario-api.service';

@Component({
  selector: 'app-actividades-extras',
  standalone: true,
  imports: [CommonModule, DatePipe, NgIf, NgFor, FormsModule],
  templateUrl: './actividades-extras.component.html',
  styleUrl: './actividades-extras.component.css'
})
export class ActividadesExtrasComponent implements OnInit {

  actividades: Actividad[] = [];
  avisos: Aviso[] = [];

  isLoading: boolean = true;
  isSaving: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private usuarioService: UsuarioApiService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  // ----------------------------------------------------
  // CARGAR DATOS (Avisos y Actividades)
  // ----------------------------------------------------
  cargarDatos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Cargar Avisos
    this.usuarioService.getActiveNotices().subscribe({
      next: (res: NoticeResponse) => {
        if (res.ok) {
          this.avisos = res.avisos;
        }
      },
      error: (err: any) => {
        console.error('Error al cargar avisos:', err);
        // No mostramos error crítico si fallan solo los avisos
      }
    });

    // Cargar Actividades
    this.usuarioService.getActiveActivities().subscribe({
      next: (res: ActivityResponse) => {
        if (res.ok) {
          // 🚨 CORRECCIÓN CLAVE: El backend devuelve 'estaInscrito', pero el HTML pide 'inscrito'.
          // Mapeamos para que la propiedad usada en el template exista.
          this.actividades = res.actividades.map(act => ({
            ...act,
            inscrito: act.inscrito || act.estaInscrito || false
          }));
        } else {
          this.errorMessage = res.msg || 'Error al cargar actividades.';
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.msg || 'Error de conexión al cargar datos.';
        this.isLoading = false;
      }
    });
  }

  // ----------------------------------------------------
  // ACCIONES DE USUARIO: INSCRIBIRSE
  // ----------------------------------------------------
  inscribirse(actividadId: number): void {
    if (this.isSaving) return;
    this.isSaving = true;
    this.clearMessages();

    this.usuarioService.inscribirseActividad(actividadId).subscribe({
      next: (res: GeneralResponse) => {
        if (res.ok) {
          this.mostrarMensaje('exito', res.msg || 'Inscripción exitosa!');
          // 🚨 CORRECCIÓN: Usamos 'inscrito' para actualizar el estado local
          const actividad = this.actividades.find(a => a.id === actividadId);
          if (actividad) { actividad.inscrito = true; }
        } else {
          this.mostrarMensaje('error', res.msg || 'No se pudo completar la inscripción.');
        }
        this.isSaving = false;
      },
      error: (err: any) => {
        this.mostrarMensaje('error', err.error?.msg || 'Error al comunicarse con el servidor.');
        this.isSaving = false;
      }
    });
  }

  // ----------------------------------------------------
  // ACCIONES DE USUARIO: CANCELAR
  // ----------------------------------------------------
  cancelarInscripcion(actividadId: number): void {
    if (this.isSaving) return;
    this.isSaving = true;
    this.clearMessages();

    this.usuarioService.cancelarInscripcionActividad(actividadId).subscribe({
      next: (res: GeneralResponse) => {
        if (res.ok) {
          this.mostrarMensaje('exito', res.msg || 'Inscripción cancelada.');
          // 🚨 CORRECCIÓN: Usamos 'inscrito' para actualizar el estado local
          const actividad = this.actividades.find(a => a.id === actividadId);
          if (actividad) { actividad.inscrito = false; }
        } else {
          this.mostrarMensaje('error', res.msg || 'No se pudo cancelar la inscripción.');
        }
        this.isSaving = false;
      },
      error: (err: any) => {
        this.mostrarMensaje('error', err.error?.msg || 'Error al comunicarse con el servidor.');
        this.isSaving = false;
      }
    });
  }

  // ----------------------------------------------------
  // AUXILIARES
  // ----------------------------------------------------
  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  private mostrarMensaje(tipo: 'exito' | 'error', mensaje: string): void {
    this.clearMessages();
    if (tipo === 'exito') {
      this.successMessage = mensaje;
    } else {
      this.errorMessage = mensaje;
    }
    setTimeout(() => this.clearMessages(), 5000);
  }
}
