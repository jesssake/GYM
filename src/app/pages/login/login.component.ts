import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

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
        this.returnUrl =
            this.route.snapshot.queryParams['returnUrl'] ||
            '/area-privada/dashboard';

        if (this.authService.isLoggedIn()) {
            this.router.navigate([this.returnUrl]);
        }
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }

    onSubmit() {
        this.errorMessage = '';

        if (!this.credenciales.email || !this.credenciales.password) {
            this.errorMessage = 'Por favor, ingresa tu correo y contraseña.';
            return;
        }

        this.isLoading = true;

        this.authService.login(this.credenciales).subscribe({
            next: (response) => {
                console.log('Login exitoso. Rol:', response.rol);

                const rol = response.rol === 'Administrador' ? 'Admin' : response.rol;

                // ✔️ CORREGIDO: validar rol === 'Admin'
                if (rol === 'Admin' && !this.returnUrl.includes('/area-privada/admin')) {
                    this.router.navigate(['/area-privada/admin/usuarios']);
                }
                else if (rol === 'Cliente' && this.returnUrl.includes('/area-privada/admin')) {
                    this.router.navigate(['/area-privada/dashboard']);
                }
                else {
                    this.router.navigate([this.returnUrl]);
                }
            },
            error: (err: HttpErrorResponse) => {
                this.isLoading = false;
                this.errorMessage = err.error?.msg || 'Error desconocido. Inténtalo de nuevo.';
                console.error('Error de Login:', err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
}
