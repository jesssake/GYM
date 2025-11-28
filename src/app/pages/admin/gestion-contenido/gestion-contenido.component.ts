import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-gestion-contenido',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './gestion-contenido.component.html',
    styleUrls: ['./gestion-contenido.component.css']
})
export class GestionContenidoComponent {

    // Estado de carga
    isSavingRoutine: boolean = false;
    isSavingNotice: boolean = false;

    // Variables para Rutinas
    routineName: string = '';
    routineDescription: string = '';
    routineImageFile: File | null = null;

    // Variables para Actividades/Avisos
    noticeTitle: string = '';
    noticeContent: string = '';
    startDate: string = '';
    endDate: string = '';

    constructor(private authService: AuthService) {}

    onRoutineImageSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files ? input.files[0] : null;

        if (file) {
            this.routineImageFile = file;
            console.log('🖼️ Imagen de rutina seleccionada:', file.name);
        } else {
            this.routineImageFile = null;
        }
    }

    guardarRutina() {
        if (this.isSavingRoutine) return;

        if (!this.routineName || !this.routineDescription || !this.routineImageFile) {
            console.error('⚠️ Error: Por favor, complete todos los campos de la rutina y suba una imagen.');
            return;
        }

        this.isSavingRoutine = true;

        const formData = new FormData();
        formData.append('name', this.routineName);
        formData.append('description', this.routineDescription);
        formData.append('image', this.routineImageFile, this.routineImageFile.name);

        this.authService.createRoutine(formData).subscribe({
            next: (response) => {
                console.log('✅ Rutina guardada:', response.msg);

                this.routineName = '';
                this.routineDescription = '';
                this.routineImageFile = null;

                this.isSavingRoutine = false;
            },
            error: (err) => {
                console.error('❌ Error al guardar rutina:', err);
                this.isSavingRoutine = false;
            }
        });
    }

    guardarActividad() {
        if (this.isSavingNotice) return;

        if (!this.noticeTitle || !this.noticeContent || !this.startDate) {
            console.error('⚠️ Error: Faltan el título, el contenido o la fecha de inicio del aviso.');
            return;
        }

        this.isSavingNotice = true;

        const avisoData = {
            titulo: this.noticeTitle,
            contenido: this.noticeContent,
            inicio: this.startDate,
            fin: this.endDate
        };

        this.authService.createNotice(avisoData).subscribe({
            next: (response) => {
                console.log('✅ Aviso guardado:', response.msg);

                this.noticeTitle = '';
                this.noticeContent = '';
                this.startDate = '';
                this.endDate = '';

                this.isSavingNotice = false;
            },
            error: (err) => {
                console.error('❌ Error al guardar aviso:', err);
                this.isSavingNotice = false;
            }
        });
    }
}
