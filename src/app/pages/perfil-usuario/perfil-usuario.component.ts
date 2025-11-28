import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Observer } from 'rxjs';
import { Router } from '@angular/router';

import { EditarFotoComponent } from '../../components/editar-foto/editar-foto.component';

import { UsuarioApiService, Usuario } from '../../services/usuario-api.service';
import { UsuarioStateService } from '../../services/usuario-state.service';

// Interfaz para respuesta de foto
interface PhotoUploadResponse {
    ok: boolean;
    msg: string;
    newUrl: string;
}

@Component({
    selector: 'app-perfil-usuario',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        EditarFotoComponent
    ],
    templateUrl: './perfil-usuario.component.html',
    styleUrls: ['./perfil-usuario.component.css'],
})
export class PerfilUsuarioComponent implements OnInit {

    usuario: Usuario = {
        id: 0,
        nombre: '',
        email: '',
        rol: 'Cliente',
        fechaNacimiento: '',
        peso: 0,
        altura: 0,
        meta: '',
        fotoUrl: null,
    };

    isLoading: boolean = true;

    fotoPerfil: string | null = null;
    imagenPreviewBase64: string | null = null;

    mostrarCropper: boolean = false;
    isSavingPhoto: boolean = false;
    isSavingData: boolean = false;

    mensajeExito = '';
    mensajeError = '';

    constructor(
        private usuarioService: UsuarioApiService,
        private router: Router,
        private userStateService: UsuarioStateService // <── 🚨 NUEVO: Servicio de estado
    ) {}

    ngOnInit(): void {
        this.cargarPerfil();
    }

    // =====================================================
    // 1. Cargar Perfil desde Backend + Guardar en State Global
    // =====================================================
    cargarPerfil() {
        this.isLoading = true;

        this.usuarioService.obtenerPerfil().subscribe({
            next: (response) => {
                if (response.ok) {
                    const usuarioReal: Usuario = response.user;

                    // 🚨 GUARDAR EN STATE GLOBAL
                    this.userStateService.actualizarUsuario(usuarioReal);

                    // Actualizamos el formulario local
                    this.usuario = usuarioReal;

                    if (this.usuario.fechaNacimiento) {
                        this.usuario.fechaNacimiento = this.usuario.fechaNacimiento.split('T')[0];
                    }

                    this.fotoPerfil = usuarioReal.fotoUrl || null;
                    this.isLoading = false;
                } else {
                    this.mostrarMensaje("error", "Respuesta inválida del servidor.");
                    this.isLoading = false;
                }
            },
            error: (err) => {
                this.isLoading = false;

                if (err.status === 401 || err.status === 403) {
                    this.mostrarMensaje("error", "Sesión expirada. Por favor, inicia sesión de nuevo.");
                    localStorage.removeItem('token');
                    this.router.navigate(['/login']);
                } else {
                    const errorMsg = err.error?.msg || "Error al cargar el perfil. Inténtalo más tarde.";
                    this.mostrarMensaje("error", errorMsg);
                }
            }
        });
    }

    // =====================================================
    // 2. Actualizar Datos del Perfil
    // =====================================================
    guardarDatosPerfil(form: NgForm) {
        if (form.valid) {
            this.isSavingData = true;

            const observer: Observer<any> = {
                next: (response) => {
                    this.mostrarMensaje("exito", response.msg || "Datos de perfil actualizados correctamente.");
                    this.isSavingData = false;
                },
                error: (err) => {
                    const errorMessage = err.error?.msg || "Error al guardar los datos del perfil.";
                    this.mostrarMensaje("error", errorMessage);
                    this.isSavingData = false;

                    if (err.status === 401) {
                        this.router.navigate(['/login']);
                    }
                },
                complete: () => {}
            };

            const dataToUpdate = {
                nombre: this.usuario.nombre,
                fechaNacimiento: this.usuario.fechaNacimiento,
                peso: this.usuario.peso,
                altura: this.usuario.altura,
                meta: this.usuario.meta,
            };

            this.usuarioService.actualizarDatos(dataToUpdate).subscribe(observer);
        }
    }

    // =====================================================
    // 3. Subir Foto de Perfil + Actualizar Estado Global
    // =====================================================
    guardarFoto() {
        if (!this.imagenPreviewBase64) {
            this.mostrarMensaje("error", "No hay imagen recortada para subir.");
            return;
        }

        this.isSavingPhoto = true;

        const observer: Observer<PhotoUploadResponse> = {
            next: (response) => {
                if (response.ok) {
                    const newUrl = response.newUrl;

                    // 🚨 ACTUALIZAR GLOBALMENTE LA FOTO DE PERFIL
                    this.userStateService.actualizarFotoPerfil(newUrl);

                    this.fotoPerfil = newUrl;
                    this.usuario.fotoUrl = newUrl;

                    this.mostrarMensaje("exito", response.msg || "Foto actualizada correctamente.");
                } else {
                    this.mostrarMensaje("error", response.msg || "Error desconocido al subir foto.");
                }

                this.isSavingPhoto = false;
                this.mostrarCropper = false;
            },
            error: (err) => {
                const errorMessage = err.error?.msg || "Ocurrió un error al subir la foto.";
                this.mostrarMensaje("error", errorMessage);
                this.isSavingPhoto = false;

                if (err.status === 401) {
                    this.router.navigate(['/login']);
                }
            },
            complete: () => {}
        };

        this.usuarioService.subirFotoPerfil(this.imagenPreviewBase64).subscribe(observer);
    }

    // =====================================================
    // Métodos Auxiliares
    // =====================================================
    abrirCropper() {
        this.mostrarCropper = true;
    }

    cerrarCropper() {
        this.mostrarCropper = false;
    }

    recibirImagenFinal(base64: string) {
        this.imagenPreviewBase64 = base64;
        this.guardarFoto();
    }

    private mostrarMensaje(tipo: 'exito' | 'error', mensaje: string) {
        this.mensajeExito = '';
        this.mensajeError = '';

        if (tipo === 'exito') {
            this.mensajeExito = mensaje;
        } else {
            this.mensajeError = mensaje;
        }

        setTimeout(() => {
            this.mensajeExito = '';
            this.mensajeError = '';
        }, 5000);
    }
}
