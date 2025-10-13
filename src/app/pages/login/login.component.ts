import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  // Para que el formulario funcione correctamente, aquí importaríamos ReactiveFormsModule,
  // pero por ahora solo necesitamos CommonModule y RouterLink.
  imports: [CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Aquí iría la lógica para manejar el envío del formulario (submit)
  // y la validación de credenciales.

  // Por ahora, solo es una plantilla vacía.

  onSubmit() {
    console.log('Formulario enviado (Lógica de autenticación pendiente)');
  }
}
