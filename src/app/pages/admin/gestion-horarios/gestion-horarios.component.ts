import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HorarioDia {
  id: number;
  dia: string;
  apertura: string;
  cierre: string;
  tipo: 'Normal' | 'Festivo' | 'Especial';
  activo: boolean;
  notas?: string;
}

interface HorarioEspecial {
  id: number;
  fecha: string;
  motivo: string;
  apertura: string;
  cierre: string;
  notas: string;
  activo: boolean;
}

@Component({
  selector: 'app-gestion-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-horarios.component.html',
  styleUrl: './gestion-horarios.component.css'
})
export class GestionHorariosComponent {
  
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  horarios: HorarioDia[] = [
    { id: 1, dia: 'Lunes', apertura: '06:00', cierre: '22:00', tipo: 'Normal', activo: true },
    { id: 2, dia: 'Martes', apertura: '06:00', cierre: '22:00', tipo: 'Normal', activo: true },
    { id: 3, dia: 'Miércoles', apertura: '06:00', cierre: '22:00', tipo: 'Normal', activo: true },
    { id: 4, dia: 'Jueves', apertura: '06:00', cierre: '22:00', tipo: 'Normal', activo: true },
    { id: 5, dia: 'Viernes', apertura: '06:00', cierre: '22:00', tipo: 'Normal', activo: true },
    { id: 6, dia: 'Sábado', apertura: '08:00', cierre: '18:00', tipo: 'Normal', activo: true },
    { id: 7, dia: 'Domingo', apertura: '10:00', cierre: '14:00', tipo: 'Normal', activo: true }
  ];

  horariosEspeciales: HorarioEspecial[] = [
    { id: 1, fecha: '2024-12-25', motivo: 'Navidad', apertura: 'Cerrado', cierre: 'Cerrado', notas: 'Día festivo - Gimnasio cerrado', activo: true },
    { id: 2, fecha: '2024-12-31', motivo: 'Nochevieja', apertura: '06:00', cierre: '14:00', notas: 'Horario reducido', activo: true },
    { id: 3, fecha: '2025-01-01', motivo: 'Año Nuevo', apertura: '12:00', cierre: '18:00', notas: 'Inicio del año con horario especial', activo: true }
  ];

  nuevoHorarioEspecial: HorarioEspecial = {
    id: 0,
    fecha: '',
    motivo: '',
    apertura: '',
    cierre: '',
    notas: '',
    activo: true
  };

  editandoHorario: boolean = false;
  horarioEditando: HorarioDia | null = null;
  
  editandoEspecial: boolean = false;
  especialEditando: HorarioEspecial | null = null;

  // Métodos para horarios normales
  editarHorario(horario: HorarioDia) {
    this.editandoHorario = true;
    this.horarioEditando = { ...horario };
  }

  guardarHorario() {
    if (this.horarioEditando) {
      const index = this.horarios.findIndex(h => h.id === this.horarioEditando!.id);
      if (index !== -1) {
        this.horarios[index] = { ...this.horarioEditando };
      }
      this.cancelarEdicionHorario();
      alert('Horario actualizado exitosamente!');
    }
  }

  cancelarEdicionHorario() {
    this.editandoHorario = false;
    this.horarioEditando = null;
  }

  toggleActivoHorario(horario: HorarioDia) {
    horario.activo = !horario.activo;
    const estado = horario.activo ? 'activado' : 'desactivado';
    alert(`Horario ${estado} exitosamente`);
  }

  // Métodos para horarios especiales
  agregarHorarioEspecial() {
    if (this.nuevoHorarioEspecial.fecha && this.nuevoHorarioEspecial.motivo) {
      this.nuevoHorarioEspecial.id = this.horariosEspeciales.length > 0 
        ? Math.max(...this.horariosEspeciales.map(h => h.id)) + 1 
        : 1;
      
      this.horariosEspeciales.push({...this.nuevoHorarioEspecial});
      this.resetFormEspecial();
      alert('Horario especial agregado exitosamente!');
    }
  }

  editarEspecial(especial: HorarioEspecial) {
    this.editandoEspecial = true;
    this.especialEditando = { ...especial };
    this.nuevoHorarioEspecial = { ...especial };
  }

  guardarEdicionEspecial() {
    if (this.especialEditando) {
      const index = this.horariosEspeciales.findIndex(h => h.id === this.especialEditando!.id);
      if (index !== -1) {
        this.horariosEspeciales[index] = { ...this.nuevoHorarioEspecial };
      }
      this.cancelarEdicionEspecial();
      alert('Horario especial actualizado exitosamente!');
    }
  }

  cancelarEdicionEspecial() {
    this.editandoEspecial = false;
    this.especialEditando = null;
    this.resetFormEspecial();
  }

  eliminarHorarioEspecial(id: number) {
    if (confirm('¿Estás seguro de eliminar este horario especial?')) {
      this.horariosEspeciales = this.horariosEspeciales.filter(h => h.id !== id);
      alert('Horario especial eliminado exitosamente');
    }
  }

  toggleActivoEspecial(especial: HorarioEspecial) {
    especial.activo = !especial.activo;
  }

  // Métodos de utilidad
  formatearHora(hora: string): string {
    if (!hora || hora === 'Cerrado') return 'Cerrado';
    
    try {
      const [hours, minutes] = hora.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return hora;
    }
  }

  getHorarioDisplay(horario: HorarioDia): string {
    if (horario.apertura === 'Cerrado' || horario.cierre === 'Cerrado') {
      return 'Cerrado';
    }
    return `${this.formatearHora(horario.apertura)} - ${this.formatearHora(horario.cierre)}`;
  }

  getResumenSemana(): string {
    const diasActivos = this.horarios.filter(h => h.activo);
    if (diasActivos.length === 0) return 'Sin horarios activos';
    
    const lunesViernes = diasActivos.filter(h => ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].includes(h.dia));
    const sabado = diasActivos.find(h => h.dia === 'Sábado');
    const domingo = diasActivos.find(h => h.dia === 'Domingo');
    
    let resumen = '';
    
    if (lunesViernes.length > 0) {
      const primerDia = lunesViernes[0];
      resumen += `Lunes - Viernes: ${this.formatearHora(primerDia.apertura)} - ${this.formatearHora(primerDia.cierre)}`;
    }
    
    if (sabado && sabado.activo) {
      resumen += `\nSábados: ${this.formatearHora(sabado.apertura)} - ${this.formatearHora(sabado.cierre)}`;
    }
    
    if (domingo && domingo.activo) {
      resumen += `\nDomingos: ${this.formatearHora(domingo.apertura)} - ${this.formatearHora(domingo.cierre)}`;
    }
    
    return resumen;
  }

  getDiasCerrados(): string[] {
    return this.horarios
      .filter(h => h.apertura === 'Cerrado' || h.cierre === 'Cerrado')
      .map(h => h.dia);
  }

  getProximosEspeciales(): HorarioEspecial[] {
    const hoy = new Date();
    return this.horariosEspeciales
      .filter(h => h.activo && new Date(h.fecha) >= hoy)
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(0, 5);
  }

  // Métodos auxiliares
  generarHoras(): string[] {
    const horas = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hora = i.toString().padStart(2, '0');
        const minuto = j.toString().padStart(2, '0');
        horas.push(`${hora}:${minuto}`);
      }
    }
    return horas;
  }

  formatDate(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  private resetFormEspecial() {
    this.nuevoHorarioEspecial = {
      id: 0,
      fecha: '',
      motivo: '',
      apertura: '',
      cierre: '',
      notas: '',
      activo: true
    };
  }
}