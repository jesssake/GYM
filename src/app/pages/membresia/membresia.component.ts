import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MembresiaService } from '../../services/membresia.service';

@Component({
  selector: 'app-membresia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './membresia.component.html',
  styleUrls: ['./membresia.component.css'],
})
export class MembresiaComponent implements OnInit {

  private router = inject(Router);
  private membresiaService = inject(MembresiaService);

  currentPlan = signal<any>({
    planName: 'Cargando...',
    status: 'PENDIENTE',
    price: 'N/A',
    startDate: 'N/A',
    expirationDate: 'N/A',
  });

  paymentHistory = signal<any[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMembresiaData();
    this.loadPaymentHistory();
  }

  loadMembresiaData(): void {
    this.isLoading.set(true);

    this.membresiaService.getMembresia().subscribe({
      next: (data) => {
        this.currentPlan.set(data);
      },
      error: () => {
        this.error.set('No se pudo cargar tu plan.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadPaymentHistory(): void {
    this.membresiaService.getHistorialPagos().subscribe({
      next: (data) => this.paymentHistory.set(data),
      error: () => this.paymentHistory.set([]),
    });
  }

  renovarPlan(): void {
    this.router.navigate(['/pago', 'renovacion', this.currentPlan().planName]);
  }

  cambiarPlan(): void {
    this.router.navigate(['/planes']);
  }

  verTodoElHistorial(): void {
    this.router.navigate(['/historial']);
  }
}
