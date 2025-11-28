import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService, RegisterData } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  isLoading: boolean = false;
  passwordVisible: boolean = false;
  errorMessage: string = '';

  passwordRules: PasswordRules = {
    minLength: false,
    hasBothCases: false,
    hasNumberOrSymbol: false,
    notContainsEmail: false
  };

  get allRulesMet(): boolean {
    return Object.values(this.passwordRules).every(rule => rule === true);
  }

  currentEmail: string = '';
  currentPasswordValue: string = '';

  // *** IMPORTANTE ***
  // Hacemos el servicio "public" para usarlo DIRECTAMENTE desde el HTML
  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onEmailChange(email: string) {
    this.currentEmail = email;

    if (this.currentPasswordValue.length > 0) {
      this.onPasswordChange(this.currentPasswordValue);
    }
  }

  onPasswordChange(password: string) {
    this.currentPasswordValue = password;
    this.errorMessage = '';

    if (password.length === 0) {
      this.passwordRules = {
        minLength: false,
        hasBothCases: false,
        hasNumberOrSymbol: false,
        notContainsEmail: false
      };
      return;
    }

    // 1. Longitud mínima
    this.passwordRules.minLength = password.length >= 8;

    // 2. Mayúsculas y minúsculas
    this.passwordRules.hasBothCases =
      /[a-z]/.test(password) && /[A-Z]/.test(password);

    // 3. Número o símbolo
    this.passwordRules.hasNumberOrSymbol =
      /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // 4. Que NO contenga el correo
    const emailPart = this.currentEmail.split('@')[0];

    this.passwordRules.notContainsEmail =
      !password.toLowerCase().includes(this.currentEmail.toLowerCase()) &&
      !password.toLowerCase().includes(emailPart.toLowerCase());
  }

  onSubmit(form: NgForm) {
    this.errorMessage = '';
    form.control.markAllAsTouched();

    if (form.invalid || !this.allRulesMet) {
      this.errorMessage =
        'Por favor, completa todos los campos y verifica las reglas de contraseña.';
      return;
    }

    this.isLoading = true;

    const registrationData: RegisterData = {
      nombre: `${form.value.nombres} ${form.value.apellidos}`,
      email: form.value.email,
      password: form.value.password
    };

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        console.log('Registro exitoso. Token recibido:', response.token);
        this.router.navigate(['/perfil']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.msg || 'Error desconocido al registrar el usuario.';
        console.error('Error de registro:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
