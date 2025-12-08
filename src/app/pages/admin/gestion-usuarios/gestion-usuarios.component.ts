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
    allUsers: User[] = [];   // 🔥 lista completa
    users: User[] = [];      // 🔥 lista mostrada (filtrada)
    isLoading: boolean = false;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.cargarUsuarios();
    }

    cargarUsuarios() {
        this.isLoading = true;

        this.authService.getAllUsers().subscribe({
            next: (response: any) => {
                if (response.ok) {
                    this.allUsers = response.users || [];
                    this.users = [...this.allUsers]; // copia inicial
                } else {
                    console.error('Respuesta con ok: false desde el servidor:', response);
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('❌ Error al cargar usuarios:', err);
                this.isLoading = false;
            }
        });
    }

    // 🔍 BÚSQUEDA FUNCIONAL
    buscarUsuarios() {
        const term = this.searchTerm.toLowerCase().trim();

        if (term === '') {
            this.users = [...this.allUsers];
            return;
        }

        this.users = this.allUsers.filter(u =>
            u.nombre.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
        );
    }

    // 🔄 Cambiar rol
    cambiarRol(userId: number, currentRole: 'Cliente' | 'Administrador' | 'Coach') {
        if (currentRole === 'Administrador') {
            console.warn('No se puede cambiar el rol de un Administrador.');
            return;
        }

        const newRole: 'Cliente' | 'Coach' = currentRole === 'Cliente' ? 'Coach' : 'Cliente';

        console.warn(`Confirmación simulada: cambiar a ${newRole}`);

        // El backend espera { nuevoRol }
        this.authService.updateUserRole(userId, newRole).subscribe({
            next: (response) => {
                console.log(response.msg);
                this.cargarUsuarios();
            },
            error: (err) => {
                console.error('❌ Error al cambiar rol:', err);
            }
        });
    }

    eliminarUsuario(userId: number) {
        console.warn(`Confirmación simulada: eliminar ${userId}`);

        this.authService.deleteUser(userId).subscribe({
            next: (response) => {
                console.log(response.msg);
                this.cargarUsuarios();
            },
            error: (err) => {
                console.error('❌ Error al eliminar usuario:', err);
            }
        });
    }

    eliminarCoach(userId: number) {
        this.eliminarUsuario(userId);
    }

    agregarEntrenador() {
        console.log('Pendiente: navegación al formulario de registro de Coach.');
    }
}
