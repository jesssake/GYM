import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-restablecer-confirmar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './restablecer-confirmar.component.html',
  styleUrls: ['./restablecer-confirmar.component.css']  // ← CORREGIDO
})
export class RestablecerConfirmarComponent implements OnInit {

  message: string = 'Validando tu enlace de seguridad...';
  isError: boolean = false;
  isLoading: boolean = false;
  token: string | null = null;
  tokenValid: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 1. Extraer el token de la URL (ruta: /recuperar?token=XYZ)
    this.token = this.route.snapshot.queryParams['token'] || null;

    if (!this.token) {
      this.message = 'Error: No se encontró un enlace de restablecimiento válido.';
      this.isError = true;
      this.tokenValid = false;
      return;
    }

    // Suponemos que es válido hasta que el backend diga lo contrario
    this.tokenValid = true;
    this.message = 'Ingresa tu nueva contraseña a continuación.';
    this.isError = false;
  }

  onSubmit(form: NgForm) {
    this.message = '';
    this.isError = false;

    const { password, confirmPassword } = form.value;

    // Validación de coincidencia
    if (password !== confirmPassword) {
      this.message = 'Las contraseñas no coinciden. Por favor, revísalas.';
      this.isError = true;
      return;
    }

    this.isLoading = true;

    if (this.token) {
      this.authService.resetPassword(this.token, password).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.message = res.msg;
          this.isError = false;
          this.tokenValid = false;

          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.tokenValid = true;
          this.message = err.error?.msg || 'Error del servidor al cambiar la contraseña.';
          this.isError = true;

          // Token expirado o inválido
          if (err.status === 401 || err.status === 403) {
            this.tokenValid = false;
          }
        }
      });
    }
  }
}
