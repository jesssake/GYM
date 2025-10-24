import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

// Interfaz para la definición de reglas
interface PasswordRules {
    minLength: boolean;
    hasBothCases: boolean;
    hasNumberOrSymbol: boolean;
    notContainsEmail: boolean;
}

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.css'
})
export class RegistroComponent {

    // PROPIEDAD para controlar el tipo de input (text/password)
    passwordVisible: boolean = false;

    // Propiedad para llevar el estado de cada regla
    passwordRules: PasswordRules = {
        minLength: false,
        hasBothCases: false,
        hasNumberOrSymbol: false,
        notContainsEmail: false
    };

    // Variables auxiliares para la validación en tiempo real
    currentEmail: string = '';
    currentPasswordValue: string = '';

    constructor(private router: Router) { }

    // Método SIMPLIFICADO: Alterna la propiedad para cambiar el ícono y el tipo de input
    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }

    // Método para actualizar el email y revalidar la contraseña
    onEmailChange(email: string) {
        this.currentEmail = email;
        if (this.currentPasswordValue) {
            this.onPasswordChange(this.currentPasswordValue);
        }
    }

    // Método para validar la contraseña en tiempo real
    onPasswordChange(password: string) {
        this.currentPasswordValue = password;

        // Si la contraseña está vacía, reinicia las reglas
        if (password.length === 0) {
            this.passwordRules = {
                minLength: false,
                hasBothCases: false,
                hasNumberOrSymbol: false,
                notContainsEmail: false
            };
            return;
        }

        // 1. Validar longitud
        this.passwordRules.minLength = password.length >= 8;

        // 2. Validar minúsculas y mayúsculas
        this.passwordRules.hasBothCases = /[a-z]/.test(password) && /[A-Z]/.test(password);

        // 3. Validar número o símbolo
        this.passwordRules.hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        // 4. Validar que no contenga el email
        const emailPart = this.currentEmail.split('@')[0];
        this.passwordRules.notContainsEmail =
            !password.toLowerCase().includes(this.currentEmail.toLowerCase()) &&
            !password.toLowerCase().includes(emailPart.toLowerCase());
    }

    // Envío del formulario
    onSubmit(form: NgForm) {
        form.control.markAllAsTouched();

        const allPasswordRulesMet = Object.values(this.passwordRules).every(rule => rule === true);

        if (form.invalid || !allPasswordRulesMet) {
            if (!allPasswordRulesMet) {
                console.error('La contraseña no cumple con todas las reglas de seguridad.');
            }
            return;
        }

        console.log('Paso 1 completado. Redirigiendo a Paso 2.');

        sessionStorage.setItem('temp_reg_email', form.value.email);
        sessionStorage.setItem('temp_reg_password', form.value.password);

        this.router.navigate(['/registro/perfil']);
    }
}
