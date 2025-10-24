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
    styleUrl: './registro-perfil.component.css'
})
export class RegistroPerfilComponent implements OnInit {

    // Datos temporales del Paso 1 (Credenciales)
    private tempEmail: string | null = null;
    private tempPassword: string | null = null;

    constructor(private router: Router) { }

    ngOnInit(): void {
        // 1. Recuperar los datos de sesión del Paso 1
        this.tempEmail = sessionStorage.getItem('temp_reg_email');
        this.tempPassword = sessionStorage.getItem('temp_reg_password');

        // 2. Comprobar si los datos existen
        if (!this.tempEmail || !this.tempPassword) {
            // Si faltan datos, redirigir al Paso 1
            alert('Error: Datos de inicio de sesión faltantes. Por favor, reinicia el registro.');
            this.router.navigate(['/registro']);
        }
    }

    // Función de envío para el Paso 2: CREACIÓN FINAL DE LA CUENTA
    onSubmit(formValue: any) {
        // La validación de min/max de edad se maneja a través de los atributos en el HTML y NgForm.
        // Solo necesitamos asegurarnos de que el formulario es válido en su totalidad.

        // 1. Combinar los datos de los dos pasos
        const registroFinalGYM = {
            // Datos del Paso 1 (Credenciales)
            email: this.tempEmail,
            password: this.tempPassword,

            // Datos del Paso 2 (Perfil GYM)
            nombre: formValue.nombre,
            apellido: formValue.apellido,
            edad: formValue.edad,
            sexo: formValue.sexo,
            experiencia: formValue.experiencia,

            aceptoTerminos: formValue.aceptoTerminos
        };

        // 2. Aquí harías la LLAMADA FINAL a tu API/Servicio de registro
        // Ejemplo: this.gymAuthService.finalizarRegistro(registroFinalGYM).subscribe(...)

        console.log('DATOS FINALES DE REGISTRO GYM ENVIADOS:', registroFinalGYM);

        // 3. Limpiar los datos temporales después del envío exitoso
        sessionStorage.removeItem('temp_reg_email');
        sessionStorage.removeItem('temp_reg_password');

        // 4. Navegación: Simular éxito y redirigir al home
        alert(`¡Cuenta de ${formValue.nombre} creada con éxito! Bienvenido al Train Station GYM.`);
        this.router.navigate(['/']); // Redirigir a la página de inicio o login
    }
}
