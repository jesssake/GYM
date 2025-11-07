import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { finalize } from 'rxjs/operators';

// Servicios (asegúrate de que estos servicios existan y tengan el método subirFotoPerfil)
import { UsuarioStateService } from '../../services/usuario-state.service';
import { UsuarioApiService } from '../../services/usuario-api.service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent, HttpClientModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css',
})
export class PerfilUsuarioComponent implements OnInit {
  @ViewChild('imageCropper', { static: false }) imageCropper: ImageCropperComponent | undefined;

  fotoPerfilUrl: string | null = null;

  imageChangedEvent: any = '';
  croppedImage: string | null = null; // base64
  mostrarCropper: boolean = false;

  // Estado UI
  isUploading: boolean = false;
  statusMessage: string = '';
  statusIsError: boolean = false;

  usuario = {
    nombre: 'Sofia Martínez',
    email: 'sofia.m@example.com',
    fechaNacimiento: '1995-08-15',
    peso: 65.5,
    altura: 168,
    meta: 'ganar-musculo',
    rol: 'Cliente',
  };

  metasDisponibles = [
    { value: 'perder-peso', label: 'Perder Peso' },
    { value: 'ganar-musculo', label: 'Ganar Músculo' },
    { value: 'mantenerse', label: 'Mantenimiento' },
  ];

  constructor(
    private usuarioStateService: UsuarioStateService,
    private usuarioApiService: UsuarioApiService
  ) {}

  ngOnInit(): void {}

  /**
   * onFileSelected:
   * - valida tipo de archivo
   * - abre el cropper
   * - no fuerza eventos artificialmente (dejamos que ngx-image-cropper dispare imageCropped)
   */
  onFileSelected(event: any): void {
    this.clearStatus();
    if (!event || !event.target || !event.target.files) return;

    const file: File = event.target.files[0];
    if (!file) return;

    // Validación básica de tipo (acepta image/*)
    if (!file.type || !file.type.startsWith('image/')) {
      this.setErrorStatus('El archivo seleccionado no es una imagen válida.');
      // limpiar input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      return;
    }

    // Guardamos el evento para el image-cropper
    this.imageChangedEvent = event;
    this.mostrarCropper = true;
    this.croppedImage = null;
  }

  /**
   * imageCropped:
   * - se ejecuta cada vez que el cropper genera un recorte
   * - aquí asignamos el base64 y habilitamos el botón
   */
  imageCropped(event: ImageCroppedEvent) {
    // event.base64 es el valor que esperamos
    this.croppedImage = event.base64 ?? null;
    console.log('🖼️ Imagen recortada lista:', this.croppedImage ? 'Sí' : 'No');
    if (this.croppedImage) {
      this.setStatus('Recorte listo. Puedes guardar la imagen.', false);
    }
  }

  onLoadImageFailed() {
    this.setErrorStatus('Error al cargar la imagen en el recortador. Intenta con otro archivo.');
  }

  /**
   * guardarFotoRecortada:
   * - valida que croppedImage exista
   * - muestra spinner y mensaje
   * - llama al servicio y maneja respuestas
   */
  guardarFotoRecortada(): void {
    this.clearStatus();
    console.log('✅ Intento de Guardar y Recortar iniciado.');

    if (!this.croppedImage) {
      console.error('❌ Error: No hay imagen recortada lista para guardar.');
      this.setErrorStatus('Asegúrate de haber seleccionado y recortado una imagen.');
      return;
    }

    this.isUploading = true;
    this.setStatus('Subiendo imagen...', false);

    // Aquí asumimos que subirFotoPerfil recibe la imagen base64 y devuelve un observable con { url: '...' }
    this.usuarioApiService.subirFotoPerfil(this.croppedImage)
      .pipe(finalize(() => (this.isUploading = false)))
      .subscribe({
        next: (response) => {
          console.log('✅ Subida exitosa. Respuesta del servidor:', response);
          const nuevaUrlGuardada = response && response.url ? response.url : null;
          if (nuevaUrlGuardada) {
            this.fotoPerfilUrl = nuevaUrlGuardada;
            this.usuarioStateService.actualizarFotoPerfil(nuevaUrlGuardada);
            this.setStatus('¡Foto de perfil guardada exitosamente!', false);
          } else {
            this.setErrorStatus('La subida finalizó pero no se recibió la URL del servidor.');
          }
          this.cancelarRecorte();
        },
        error: (err) => {
          console.error('❌ Error al subir la foto al servidor:', err);
          this.setErrorStatus('Error al guardar la foto. Revisa la consola para más detalles.');
          // no cerramos inmediatamente si quieres que el usuario intente de nuevo; aquí cerramos
          this.cancelarRecorte();
        },
      });
  }

  cancelarRecorte(): void {
    this.mostrarCropper = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;

    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    // limpiamos status luego de un corto tiempo
    setTimeout(() => this.clearStatus(), 1500);
  }

  guardarCambios(): void {
    console.log('[ACCION] Guardando cambios del perfil (datos):', this.usuario);
    console.log('Perfil actualizado correctamente!');
  }

  // ---------- Helpers UI ----------
  private setStatus(msg: string, isError: boolean) {
    this.statusMessage = msg;
    this.statusIsError = isError;
  }

  private setErrorStatus(msg: string) {
    this.setStatus(msg, true);
    console.error(msg);
  }

  private clearStatus() {
    this.statusMessage = '';
    this.statusIsError = false;
  }
}
