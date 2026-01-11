import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Plan {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioAnterior?: number;
  duracion: 'Mensual' | 'Trimestral' | 'Anual' | 'Personalizado';
  caracteristicas: string[];
  activo: boolean;
  destacado: boolean;
  icono: string;
  color: string;
  limiteUsuarios?: number;
  popular: boolean;
}

@Component({
  selector: 'app-gestion-planes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-planes.component.html',
  styleUrl: './gestion-planes.component.css'
})
export class GestionPlanesComponent {
  
  planes: Plan[] = [
    {
      id: 1,
      nombre: 'PLAN ESTUDIANTE',
      descripcion: 'Perfecto para estudiantes que buscan mantenerse activos',
      precio: 200,
      precioAnterior: 250,
      duracion: 'Mensual',
      caracteristicas: [
        'Acceso a sala de pesas y cardio',
        'Horario regular',
        'Clases grupales ilimitadas',
        'Asesoría nutricional básica'
      ],
      activo: true,
      destacado: false,
      icono: 'graduation-cap',
      color: '#3498db',
      popular: false
    },
    {
      id: 2,
      nombre: 'PLAN MENSUAL',
      descripcion: 'Para quienes buscan acceso completo al gimnasio',
      precio: 300,
      duracion: 'Mensual',
      caracteristicas: [
        'Acceso a sala de pesas y cardio',
        'Clases grupales ilimitadas',
        '1 Sesión de asesoría personalizada',
        'Acceso ilimitado en horario regular'
      ],
      activo: true,
      destacado: false,
      icono: 'dumbbell',
      color: '#2ecc71',
      popular: false
    },
    {
      id: 3,
      nombre: 'PLAN PAREJA',
      descripcion: 'Ideal para parejas que entrenan juntas',
      precio: 450,
      precioAnterior: 500,
      duracion: 'Mensual',
      caracteristicas: [
        'Acceso total a todas las áreas para 2 personas',
        'Clases grupales ilimitadas',
        'Asesoría nutricional y rutinas personalizadas',
        'Acceso 24/7',
        'Descuento en suplementos'
      ],
      activo: true,
      destacado: true,
      icono: 'heart',
      color: '#e74c3c',
      limiteUsuarios: 2,
      popular: true
    },
    {
      id: 4,
      nombre: 'PLAN ANUAL',
      descripcion: 'Ahorra con nuestro plan de compromiso anual',
      precio: 2500,
      precioAnterior: 3000,
      duracion: 'Anual',
      caracteristicas: [
        'Acceso completo 24/7',
        'Clases grupales ilimitadas',
        '4 sesiones de entrenador personal',
        'Plan nutricional personalizado',
        'Acceso a área VIP',
        'Tarjeta de regalo de $200 en tienda'
      ],
      activo: true,
      destacado: false,
      icono: 'crown',
      color: '#f39c12',
      popular: false
    }
  ];

  nuevoPlan: Plan = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: 'Mensual',
    caracteristicas: [],
    activo: true,
    destacado: false,
    icono: 'dumbbell',
    color: '#3498db',
    popular: false
  };

  caracteristicaTemporal: string = '';
  editando: boolean = false;
  planEditando: Plan | null = null;
  
  duraciones = ['Mensual', 'Trimestral', 'Anual', 'Personalizado'];
  iconos = [
    { value: 'dumbbell', label: 'Pesas' },
    { value: 'heart', label: 'Corazón' },
    { value: 'graduation-cap', label: 'Estudiante' },
    { value: 'crown', label: 'Premium' },
    { value: 'users', label: 'Grupo' },
    { value: 'bolt', label: 'Energía' },
    { value: 'running', label: 'Correr' }
  ];
  
  colores = [
    { value: '#3498db', label: 'Azul' },
    { value: '#2ecc71', label: 'Verde' },
    { value: '#e74c3c', label: 'Rojo' },
    { value: '#f39c12', label: 'Naranja' },
    { value: '#9b59b6', label: 'Morado' },
    { value: '#1abc9c', label: 'Turquesa' },
    { value: '#34495e', label: 'Gris oscuro' }
  ];

  // Métodos getters para estadísticas
  getTotalPlanes(): number {
    return this.planes.length;
  }

  getPlanesActivos(): number {
    return this.planes.filter(p => p.activo).length;
  }

  getPrecioPromedio(): number {
    if (this.planes.length === 0) return 0;
    const total = this.planes.reduce((sum, plan) => sum + plan.precio, 0);
    return Math.round(total / this.planes.length);
  }

  getPlanesPopulares(): number {
    return this.planes.filter(p => p.popular).length;
  }

  agregarCaracteristica() {
    if (this.caracteristicaTemporal.trim()) {
      this.nuevoPlan.caracteristicas.push(this.caracteristicaTemporal.trim());
      this.caracteristicaTemporal = '';
    }
  }

  eliminarCaracteristica(index: number) {
    this.nuevoPlan.caracteristicas.splice(index, 1);
  }

  moverCaracteristicaArriba(index: number) {
    if (index > 0) {
      const temp = this.nuevoPlan.caracteristicas[index];
      this.nuevoPlan.caracteristicas[index] = this.nuevoPlan.caracteristicas[index - 1];
      this.nuevoPlan.caracteristicas[index - 1] = temp;
    }
  }

  moverCaracteristicaAbajo(index: number) {
    if (index < this.nuevoPlan.caracteristicas.length - 1) {
      const temp = this.nuevoPlan.caracteristicas[index];
      this.nuevoPlan.caracteristicas[index] = this.nuevoPlan.caracteristicas[index + 1];
      this.nuevoPlan.caracteristicas[index + 1] = temp;
    }
  }

  agregarPlan() {
    if (this.nuevoPlan.nombre && this.nuevoPlan.precio > 0) {
      this.nuevoPlan.id = this.planes.length > 0 ? Math.max(...this.planes.map(p => p.id)) + 1 : 1;
      this.planes.push({...this.nuevoPlan});
      this.resetForm();
      alert('¡Plan agregado exitosamente!');
    }
  }

  editarPlan(plan: Plan) {
    this.editando = true;
    this.planEditando = {...plan};
    this.nuevoPlan = {...plan};
  }

  guardarEdicion() {
    if (this.planEditando) {
      const index = this.planes.findIndex(p => p.id === this.planEditando!.id);
      if (index !== -1) {
        this.planes[index] = {...this.nuevoPlan};
      }
      this.cancelarEdicion();
      alert('¡Plan actualizado exitosamente!');
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.planEditando = null;
    this.resetForm();
  }

  eliminarPlan(id: number) {
    if (confirm('¿Estás seguro de eliminar este plan? Esta acción no se puede deshacer.')) {
      this.planes = this.planes.filter(plan => plan.id !== id);
      alert('Plan eliminado exitosamente');
    }
  }

  duplicarPlan(plan: Plan) {
    const nuevoPlan = {...plan, id: Math.max(...this.planes.map(p => p.id)) + 1, nombre: plan.nombre + ' (Copia)'};
    this.planes.push(nuevoPlan);
    alert('Plan duplicado exitosamente');
  }

  toggleActivo(plan: Plan) {
    plan.activo = !plan.activo;
    const estado = plan.activo ? 'activado' : 'desactivado';
    alert(`Plan ${estado} exitosamente`);
  }

  toggleDestacado(plan: Plan) {
    plan.destacado = !plan.destacado;
  }

  togglePopular(plan: Plan) {
    plan.popular = !plan.popular;
  }

  private resetForm() {
    this.nuevoPlan = {
      id: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      duracion: 'Mensual',
      caracteristicas: [],
      activo: true,
      destacado: false,
      icono: 'dumbbell',
      color: '#3498db',
      popular: false
    };
    this.caracteristicaTemporal = '';
  }
}