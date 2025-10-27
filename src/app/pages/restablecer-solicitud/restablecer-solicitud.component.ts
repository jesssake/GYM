import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

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

  constructor() { }

  onSubmit(form: NgForm) {
    // Evitar el envío si el formulario no es válido
    form.control.markAllAsTouched();

    if (form.invalid) {
      this.message = 'Por favor, corrige los errores e introduce tu correo.';
      this.isError = true;
      return;
    }

    const email = form.value.email;

    // ⚠️ AQUÍ VA LA LLAMADA A TU BACKEND
    // this.authService.requestPasswordReset(email).subscribe(...)

    console.log(`Solicitud de restablecimiento enviada para: ${email}`);

    // Simulación de respuesta exitosa
    this.message = '¡Enlace de restablecimiento enviado! Revisa tu bandeja de entrada (y la carpeta de spam).';
    this.isError = false;

    // Limpiar el estado del formulario después del éxito para deshabilitar el botón
    form.resetForm({ email: email });
  }
}
