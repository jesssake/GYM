import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para [ngClass]
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    // Propiedad para el control de visibilidad de la contraseña
    passwordVisible: boolean = false;

    // Función que alterna la visibilidad
    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }

    onSubmit() {
        console.log('Formulario enviado (Lógica de autenticación pendiente)');
    }
}
