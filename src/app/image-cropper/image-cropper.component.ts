import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent {

  @Output() imagenRecortada = new EventEmitter<string>();

  imagenOriginal: string | null = null;
  imagenPreview: string | null = null;

  cropX = 0;
  cropY = 0;
  cropSize = 200;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenOriginal = reader.result as string;
      this.imagenPreview = this.imagenOriginal;
    };
    reader.readAsDataURL(file);
  }

  recortarImagen() {
    if (!this.imagenOriginal) return;

    const img = new Image();
    img.src = this.imagenOriginal;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = this.cropSize;
      canvas.height = this.cropSize;

      const ctx: any = canvas.getContext('2d');

      ctx.drawImage(
        img,
        this.cropX, this.cropY, this.cropSize, this.cropSize,
        0, 0, this.cropSize, this.cropSize
      );

      const base64 = canvas.toDataURL('image/jpeg');

      this.imagenPreview = base64;
      this.imagenRecortada.emit(base64);
    };
  }
}
