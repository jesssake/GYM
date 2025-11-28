// src/app/components/notice-list/notice-list.component.ts

import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../../services/notice.service';
import { Notice } from '../../models/notice.model';
import { Router, RouterLink } from '@angular/router'; // 🚨 RouterLink añadido

import { CommonModule } from '@angular/common'; // 🚨 Necesario para *ngIf, *ngFor y el pipe 'date'

@Component({
  selector: 'app-notice-list',
  // 🚨 CORRECCIÓN CLAVE: Declaración standalone e imports
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './notice-list.component.html'
})
export class NoticeListComponent implements OnInit {
  avisos: Notice[] = [];
  loading = false;
  error = '';

  constructor(private noticeService: NoticeService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.noticeService.getAll().subscribe({
      next: (data) => { this.avisos = data; this.loading = false; },
      error: (err) => { this.error = 'Error cargando avisos.'; this.loading = false; console.error(err); }
    });
  }

  onEdit(id?: number) {
    if (!id) return;
    this.router.navigate(['/admin/avisos/editar', id]);
  }

  onDelete(id?: number) {
    if (!id) return;
    if (!confirm('¿Eliminar este aviso? Esta acción no se puede deshacer.')) return;
    this.noticeService.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => { alert('Error al eliminar'); console.error(err); }
    });
  }

  onCreate() {
    this.router.navigate(['/admin/avisos/nuevo']);
  }
}
