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
  ) {}

  ngOnInit(): void {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] ||
      '/area-privada/dashboard';

    // ✅ Si ya está logueado, redirigir según rol
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const rol = payload.rol;
          
          // ✅ CORRECCIÓN: Comparar ignorando mayúsculas/minúsculas
          if (rol && rol.toString().toLowerCase() === 'admin') {
            this.router.navigate(['/area-privada/admin/usuarios']);
          } else {
            this.router.navigate(['/area-privada/dashboard']);
          }
        } catch (error) {
          console.error('Error parsing token:', error);
          this.router.navigate(['/area-privada/dashboard']);
        }
      }
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

        // ✅ Guardar token
        localStorage.setItem('token', response.token);

        // ✅ Decodificar JWT para obtener el rol REAL
        try {
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          const rol = payload.rol;

          console.log('LOGIN OK - ROL:', rol);
          console.log('🔍 Payload completo:', payload);

          // ✅ CORRECCIÓN: Comparar ignorando mayúsculas/minúsculas
          if (rol && rol.toString().toLowerCase() === 'admin') {
            console.log('✅ Redirigiendo a panel de administrador');
            this.router.navigate(['/area-privada/admin/usuarios']);
          } else {
            console.log('ℹ️ Redirigiendo a dashboard de cliente');
            this.router.navigate(['/area-privada/dashboard']);
          }
        } catch (error) {
          console.error('❌ Error parsing token:', error);
          this.router.navigate(['/area-privada/dashboard']);
        }
      },

      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.msg || 'Correo o contraseña incorrectos.';
        console.error('Error de Login:', err);
      },

      complete: () => {
        this.isLoading = false;
      }
    });
  }
}