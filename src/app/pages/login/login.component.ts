import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'; // 🚨 Importamos para manejar errores

import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

    passwordVisible: boolean = false;
    errorMessage: string = '';
    isLoading: boolean = false;

    // Redirección por defecto después del login
    returnUrl: string = '/area-privada/dashboard';

    credenciales = {
        email: '',
        password: ''
    };

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Captura la URL de destino después del login
        this.returnUrl =
            this.route.snapshot.queryParams['returnUrl'] ||
            '/area-privada/dashboard';

        // Si ya está logueado, redirige
        if (this.authService.isLoggedIn()) {
            this.router.navigate([this.returnUrl]);
        }
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }

    // ----------------------------------------------------
    // LÓGICA DE ENVÍO (ACTUALIZADA con API Real)
    // ----------------------------------------------------
    onSubmit() {
        this.errorMessage = '';

        // Validación básica
        if (!this.credenciales.email || !this.credenciales.password) {
            this.errorMessage = 'Por favor, ingresa tu correo y contraseña.';
            return;
        }

        this.isLoading = true; // Activamos el loader

        this.authService.login(this.credenciales).subscribe({
            next: (response) => {
                // Login exitoso: El token y el rol se guardan en el AuthService (handleAuthResponse)
                console.log('Login exitoso. Rol:', response.rol);

                const rol = response.rol; // Usamos el rol que nos devuelve la API

                // Lógica de redirección basada en el rol (se mantiene igual, es excelente)
                if (rol === 'Administrador' && !this.returnUrl.includes('/area-privada/admin')) {
                    // Si es Admin pero iba a una ruta de cliente, lo enviamos al panel de admin
                    this.router.navigate(['/area-privada/admin/usuarios']);
                }
                else if (rol === 'Cliente' && this.returnUrl.includes('/area-privada/admin')) {
                    // Si es Cliente pero la URL era de admin, lo enviamos al dashboard de cliente
                    this.router.navigate(['/area-privada/dashboard']);
                }
                else {
                    // En caso contrario, lo enviamos a la URL a la que quería ir originalmente
                    this.router.navigate([this.returnUrl]);
                }
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading = false;

                // Captura el mensaje de error de la API (ej: 'Credenciales inválidas')
                this.errorMessage = err.error?.msg || 'Error desconocido. Inténtalo de nuevo.';
                console.error('Error de Login:', err);
            },
            complete: () => {
                this.isLoading = false; // Aseguramos que el loader se apague al finalizar
            }
        });
    }
}
