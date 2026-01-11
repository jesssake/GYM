import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

// ✅ ROLES EN MINÚSCULAS (igual que AuthService)
type Rol = 'cliente' | 'admin' | 'coach';

// ✅ ESTRUCTURA DEL USUARIO
interface User {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  fecha_registro: string;
}

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {

  searchTerm: string = '';
  allUsers: User[] = [];
  users: User[] = [];
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // ----------------------------------------------------
  // CARGAR USUARIOS
  // ----------------------------------------------------
  cargarUsuarios(): void {
    this.isLoading = true;

    this.authService.getAllUsers().subscribe({
      next: (response: any) => {
        if (response?.users) {
          this.allUsers = response.users;
          this.users = [...this.allUsers];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios:', err);
        this.isLoading = false;
      }
    });
  }

  // ----------------------------------------------------
  // BUSCAR USUARIOS
  // ----------------------------------------------------
  buscarUsuarios(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.users = [...this.allUsers];
      return;
    }

    this.users = this.allUsers.filter(u =>
      u.nombre.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  // ----------------------------------------------------
  // CAMBIAR ROL
  // ----------------------------------------------------
  cambiarRol(userId: number, currentRole: Rol): void {

    // ❌ NO permitir cambiar admin
    if (currentRole === 'admin') {
      console.warn('No se puede cambiar el rol de un administrador');
      return;
    }

    // 🔁 Alternar cliente ↔ coach
    const newRole: Rol = currentRole === 'cliente' ? 'coach' : 'cliente';

    this.authService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        console.log(`✅ Rol actualizado a ${newRole}`);
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('❌ Error al cambiar rol:', err);
      }
    });
  }

  // ----------------------------------------------------
  // ELIMINAR USUARIO
  // ----------------------------------------------------
  eliminarUsuario(userId: number): void {
    this.authService.deleteUser(userId).subscribe({
      next: () => {
        console.log('🗑 Usuario eliminado');
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('❌ Error al eliminar usuario:', err);
      }
    });
  }

  eliminarCoach(userId: number): void {
    this.eliminarUsuario(userId);
  }

  agregarEntrenador(): void {
    console.log('➡ Navegar a registro de coach (pendiente)');
  }
}
