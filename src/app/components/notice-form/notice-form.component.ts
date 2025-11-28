// src/app/components/notice-form/notice-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // 🚨 ReactiveFormsModule añadido aquí
import { NoticeService } from '../../services/notice.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // 🚨 RouterLink añadido
import { Notice } from '../../models/notice.model';

import { CommonModule } from '@angular/common'; // 🚨 Necesario para *ngIf

@Component({
  selector: 'app-notice-form',
  // 🚨 CORRECCIÓN CLAVE: Declaración standalone e imports
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './notice-form.component.html'
})
export class NoticeFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  noticeId?: number;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private noticeService: NoticeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required]],
      contenido: ['', [Validators.required]],
      inicio: ['', [Validators.required]],
      fin: ['']
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.noticeId = +params['id'];
        this.loadNotice(this.noticeId);
      }
    });
  }

  loadNotice(id: number) {
    this.loading = true;
    this.noticeService.getById(id).subscribe({
      next: (n: Notice) => {
        this.form.patchValue({
          titulo: n.titulo,
          contenido: n.mensaje,
          inicio: n.fecha_inicio,
          fin: n.fecha_fin
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el aviso.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      titulo: this.form.value.titulo,
      contenido: this.form.value.contenido,
      inicio: this.form.value.inicio,
      fin: this.form.value.fin || null
    };

    this.loading = true;
    if (this.isEdit && this.noticeId) {
      this.noticeService.update(this.noticeId, payload).subscribe({
        next: () => { this.loading = false; this.router.navigate(['/admin/avisos']); },
        error: (err) => { this.loading = false; alert('Error al actualizar'); console.error(err); }
      });
    } else {
      this.noticeService.create(payload).subscribe({
        next: () => { this.loading = false; this.router.navigate(['/admin/avisos']); },
        error: (err) => { this.loading = false; alert('Error al crear'); console.error(err); }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/avisos']);
  }
}
