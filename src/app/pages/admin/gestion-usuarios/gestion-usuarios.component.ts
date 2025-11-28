import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

// 🚨 Define la estructura de tus datos (coincide con la respuesta del backend)
interface User {
    id: number;
    nombre: string;
    email: string;
    rol: 'Cliente' | 'Administrador' | 'Coach';
    fecha_registro: string;
}

@Component({
    selector: 'app-gestion-usuarios',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './gestion-usuarios.component.html',
    styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent implements OnInit {

    searchTerm: string = '';
    users: User[] = [];
    isLoading: boolean = false;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.cargarUsuarios();
    }

    cargarUsuarios() {
        this.isLoading = true;
        // 🛑 Llamada al servicio GET /api/admin/usuarios
        this.authService.getAllUsers().subscribe({
            next: (response: any) => {
                // ✅ CORRECCIÓN: Verificamos 'ok' y asignamos la lista (puede estar vacía []).
                if (response.ok) {
                    // El backend devuelve 'users' y no 'usuarios' según tu admin.controller.js
                    this.users = response.users || [];
                } else {
                    // Si el backend responde con ok: false, mostramos el error
                    console.error('Respuesta con ok: false desde el servidor:', response);
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('❌ Error al cargar usuarios:', err);
                console.error('Error: Verifique que el servidor esté activo, el token es válido y el usuario es Admin.');
                this.isLoading = false;
            }
        });
    }

    buscarUsuarios() {
        // Lógica pendiente de implementar en el backend
        console.log('Buscando:', this.searchTerm);
        console.log(`Búsqueda simulada: ${this.searchTerm}. Pendiente implementar en el backend.`);
    }

    cambiarRol(userId: number, currentRole: 'Cliente' | 'Administrador' | 'Coach') {
        if (currentRole === 'Administrador') {
            console.warn('Advertencia: No se puede cambiar el rol de un Administrador desde este panel.');
            return;
        }

        const newRole: 'Cliente' | 'Coach' = currentRole === 'Cliente' ? 'Coach' : 'Cliente';

        console.warn(`Simulación de confirmación: ¿Estás seguro de cambiar el rol del usuario ${userId} a ${newRole}?`);

        this.authService.updateUserRole(userId, newRole).subscribe({
            next: (response) => {
                console.log(response.msg);
                this.cargarUsuarios(); // Recargar la lista
            },
            error: (err) => {
                console.error('❌ Error al cambiar rol:', err);
                console.error(`Error al cambiar rol: ${err.error.msg || 'Error de conexión.'}`);
            }
        });
    }

    eliminarUsuario(userId: number) {
        console.warn(`Simulación de confirmación: ⚠️ ¿Estás seguro de ELIMINAR al usuario ${userId}?`);

        this.authService.deleteUser(userId).subscribe({
            next: (response) => {
                console.log(response.msg);
                this.cargarUsuarios(); // Recargar la lista
            },
            error: (err) => {
                console.error('❌ Error al eliminar:', err);
                console.error(`Error al eliminar usuario: ${err.error.msg || 'Error de conexión.'}`);
            }
        });
    }

    eliminarCoach(userId: number) {
        this.eliminarUsuario(userId);
    }

    agregarEntrenador() {
        console.log('Pendiente: Aquí iría la navegación a un formulario de registro de Coach (POST /api/admin/usuarios).');
    }
}
