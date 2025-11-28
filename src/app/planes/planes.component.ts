import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';

// Estructura del objeto Membresía
interface Membresia {
  id: number;
  nombre: string;
  descripcion: string;
  duracionDias: number;
  precio: number;
  caracteristicas: string[];
  isFeatured: boolean;
}

@Component({
  selector: 'app-planes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {

  membresias: Membresia[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarMembresias();
  }

  cargarMembresias() {
    this.cargarDatosTemporales();
  }

  cargarDatosTemporales() {
    this.membresias = [
      {
        id: 1,
        nombre: 'Plan Estudiante',
        descripcion: 'Acceso básico solo a sala de pesas y cardio en horario regular.',
        duracionDias: 30,
        precio: 200,
        caracteristicas: [
          'Acceso a sala de pesas y cardio',
          'Horario regular',
          'Clases grupales ilimitadas (disabled)',
          'Asesoría nutricional (disabled)'
        ],
        isFeatured: false
      },
      {
        id: 2,
        nombre: 'Plan Mensual',
        descripcion: 'Acceso ilimitado a todas las instalaciones y clases.',
        duracionDias: 30,
        precio: 300,
        caracteristicas: [
          'Acceso a sala de pesas y cardio',
          'Clases grupales ilimitadas',
          '1 Sesión de asesoría personalizada',
          'Acceso ilimitado (disabled)'
        ],
        isFeatured: true
      },
      {
        id: 3,
        nombre: 'Plan Pareja',
        descripcion: 'Membresía completa para dos personas con beneficios VIP.',
        duracionDias: 30,
        precio: 450,
        caracteristicas: [
          'Acceso total a todas las áreas',
          'Clases grupales ilimitadas',
          'Asesoría nutricional y rutinas',
          'Acceso 24/7'
        ],
        isFeatured: false
      }
    ];
  }

  seleccionarPlan(plan: Membresia) {
    console.log(`Plan seleccionado: ${plan.nombre} (ID: ${plan.id})`);

    if (!this.authService.isLoggedIn()) {
      console.warn('Usuario no autenticado. Redirigiendo al login...');
      this.router.navigate(['/login'], {
        queryParams: { plan: plan.id }
      });
      return;
    }

    this.router.navigate(['/checkout'], {
      queryParams: {
        id: plan.id,
        nombre: plan.nombre,
        precio: plan.precio,
        descripcion: plan.descripcion
      }
    });

    console.log(`Redirigiendo al pago del plan: ${plan.nombre}`);
  }
}
