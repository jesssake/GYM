import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-editar-foto',
    standalone: true,
    imports: [CommonModule, ImageCropperModule],
    templateUrl: './editar-foto.component.html',
    styleUrls: ['./editar-foto.component.css']
})
export class EditarFotoComponent {

    @Output() imagenFinal = new EventEmitter<string>();
    @Output() cancelar = new EventEmitter<void>();

    imageChangedEvent: any = null;
    croppedImage: string | null = null;

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        this.croppedImage = null;
    }

    imageCropped(event: ImageCroppedEvent): void {
        // CORRECCIÓN: Garantizar que siempre sea string o null
        this.croppedImage = event.base64 ?? null;
    }

    guardar(): void {
        if (this.croppedImage) {
            this.imagenFinal.emit(this.croppedImage);
            this.cerrarModal();
        } else {
            alert('Por favor, selecciona y recorta una imagen.');
        }
    }

    cerrarModal(): void {
        this.cancelar.emit();
    }
}
