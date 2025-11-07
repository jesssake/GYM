import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 🚨 REQUERIDO PARA (ngModel)

import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    // 🚨 Asegúrate de que FormsModule esté en la lista de imports
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

    passwordVisible: boolean = false;
    errorMessage: string = '';

    // Ruta por defecto (se actualizará en ngOnInit)
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
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/area-privada/dashboard';
      if (this.authService.isLoggedIn()) {
          this.router.navigate([this.returnUrl]);
      }
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }

    // 🚨 Lógica de inicio de sesión que debe ejecutarse
    onSubmit() {
        console.log("Intentando iniciar sesión con:", this.credenciales.email); // ✅ Verificar que esto aparece en consola
        this.errorMessage = '';

        if (this.authService.login(this.credenciales.email, this.credenciales.password)) {

            const rol = this.authService.getUserRole();

            if (rol === 'Admin' && !this.returnUrl.includes('/area-privada/admin')) {
                // Si es admin y el returnUrl no es admin, lo forzamos a su dashboard principal
                this.router.navigate(['/area-privada/admin/usuarios']);
            } else if (rol === 'Cliente' && this.returnUrl.includes('/area-privada/admin')) {
                // Si es cliente y el returnUrl era una página admin, lo mandamos a su dashboard
                this.router.navigate(['/area-privada/dashboard']);
            } else {
                // Redirección normal usando el returnUrl
                 this.router.navigate([this.returnUrl]);
            }

        } else {
            this.errorMessage = 'Credenciales inválidas. Intenta con admin@gym.com/admin o cliente@gym.com/cliente.';
            console.error(this.errorMessage);
        }
    }
}
