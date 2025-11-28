import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'; // Importamos para errores

import { AuthService } from '../../services/auth.service'; // 🚨 Importamos el servicio

@Component({
  selector: 'app-restablecer-solicitud',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './restablecer-solicitud.component.html',
  styleUrl: './restablecer-solicitud.component.css'
})
export class RestablecerSolicitudComponent {

  // Propiedades para mostrar mensajes al usuario
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false; // 🚨 Para manejar el estado de carga

  constructor(private authService: AuthService) { } // 🚨 Inyectamos el servicio

  onSubmit(form: NgForm) {
    // Limpiamos mensajes anteriores
    this.message = '';
    this.isError = false;

    // Evitar el envío si el formulario no es válido
    form.control.markAllAsTouched();

    if (form.invalid) {
      this.message = 'Por favor, corrige los errores e introduce tu correo.';
      this.isError = true;
      return;
    }

    const email = form.value.email;
    this.isLoading = true; // Activamos el loader

    // 🚀 LLAMADA A TU BACKEND
    this.authService.requestPasswordReset(email).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Respuesta exitosa del backend
        this.message = res.msg; // Usamos el mensaje del backend
        this.isError = false;

        // Opcional: limpiar solo el botón
        form.resetForm({ email: email });
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        // Captura errores reales del servidor (500)
        this.message =
          err.error?.msg || 'Error del servidor. Inténtalo de nuevo más tarde.';
        this.isError = true;

        console.error('Error solicitud de restablecimiento:', err);
      }
    });
  }
}
