import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Para botones de acción

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  // 🚨 RouterLink es necesario para enlazar a otras páginas del cliente (Ej: entrenamientos)
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent implements OnInit {

  userName: string = 'Alexander Kantun';
  userLevel: string = 'Intermedio';

  // Datos clave del progreso
  metrics = [
    { label: 'Días restantes de membresía', value: 15, icon: 'fa-calendar-alt' },
    { label: 'Entrenamientos Completados', value: 8, icon: 'fa-dumbbell' },
    { label: 'Calorías Quemadas (Semanal)', value: 3500, icon: 'fa-fire' },
  ];

  // Acciones rápidas para el cliente
  quickActions = [
    { title: 'Ver Rutina de Hoy', icon: 'fa-bolt', path: '/area-privada/mis-entrenamientos' },
    { title: 'Reservar Actividad Extra', icon: 'fa-calendar-check', path: '/area-privada/actividades' },
    { title: 'Editar Mi Perfil', icon: 'fa-user-circle', path: '/area-privada/perfil' },
  ];

  constructor() { }

  ngOnInit(): void {
    // Aquí iría la carga de datos del cliente desde el servicio
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
