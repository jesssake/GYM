import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
    selector: 'app-registro-perfil',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    templateUrl: './registro-perfil.component.html',

    // ❗ CORRECCIÓN IMPORTANTE: styleUrl ➝ styleUrls
    styleUrls: ['./registro-perfil.component.css']
})
export class RegistroPerfilComponent implements OnInit {

    // Estado del botón
    isLoading: boolean = false;

    // Datos del Paso 1
    private tempEmail: string | null = null;
    private tempPassword: string | null = null;

    constructor(private router: Router) {}

    ngOnInit(): void {

        // Recuperar datos del Paso 1
        this.tempEmail = sessionStorage.getItem('temp_reg_email');
        this.tempPassword = sessionStorage.getItem('temp_reg_password');

        // Validar que existan
        if (!this.tempEmail || !this.tempPassword) {
            console.error('Error: datos del Paso 1 faltantes. Redirigiendo...');
            this.router.navigate(['/registro']);
        }
    }

    // Recibimos TODO el formulario (NgForm)
    onSubmit(f: NgForm) {

        // Marcar todo para mostrar errores
        f.control.markAllAsTouched();

        if (f.invalid) {
            console.error("Formulario inválido. Verifica los campos.");
            return;
        }

        if (this.isLoading) return; // evitar doble clic

        this.isLoading = true;

        const v = f.value;

        // Combinar datos de Paso 1 + Paso 2
        const registroFinalGYM = {
            email: this.tempEmail,
            password: this.tempPassword,
            nombre: v.nombre,
            apellido: v.apellido,
            edad: v.edad,
            sexo: v.sexo,
            experiencia: v.experiencia,
            aceptoTerminos: v.aceptoTerminos
        };

        // Simulación de servicio asíncrono
        setTimeout(() => {

            console.log("DATOS FINALES ENVIADOS:", registroFinalGYM);

            // Limpiar datos temporales
            sessionStorage.removeItem('temp_reg_email');
            sessionStorage.removeItem('temp_reg_password');

            console.log(`¡Cuenta creada exitosamente para ${v.nombre}!`);

            this.isLoading = false;

            // Redirigir al home o login
            this.router.navigate(['/']);

        }, 1500);
    }
}
