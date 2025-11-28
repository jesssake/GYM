// src/app/components/routine-upload/routine-upload.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // 🚨 ReactiveFormsModule añadido
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http'; // 🚨 HttpClientModule añadido
import { Router, RouterLink } from '@angular/router'; // 🚨 RouterLink añadido

import { CommonModule } from '@angular/common'; // 🚨 Necesario para directivas estructurales

@Component({
  selector: 'app-routine-upload',
  // 🚨 CORRECCIÓN CLAVE: Declaración standalone e imports
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './routine-upload.component.html'
})
export class RoutineUploadComponent {
  form: FormGroup;
  selectedFile?: File;
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submit() {
    if (this.form.invalid || !this.selectedFile) {
      this.form.markAllAsTouched();
      return;
    }

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const fd = new FormData();
    fd.append('name', this.form.value.name);
    fd.append('description', this.form.value.description);
    fd.append('image', this.selectedFile);

    this.loading = true;
    this.http.post('/api/admin/rutinas', fd, { headers }).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/admin/rutinas']); },
      error: (err) => { this.loading = false; alert('Error al subir rutina'); console.error(err); }
    });
  }
}
