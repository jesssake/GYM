import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RedSocial {
  id: number;
  plataforma: 'WhatsApp' | 'Facebook';
  nombreUsuario: string;
  enlace: string;
  icono: string;
  activa: boolean;
  orden: number;
  descripcion?: string;
}

@Component({
  selector: 'app-gestion-redes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-redes.component.html',
  styleUrl: './gestion-redes.component.css'
})
export class GestionRedesComponent {
  
  redesSociales: RedSocial[] = [
    { 
      id: 1, 
      plataforma: 'Facebook', 
      nombreUsuario: '@TrainStationGym', 
      enlace: 'https://facebook.com/TrainStationGym', 
      icono: 'facebook', 
      activa: true, 
      orden: 1,
      descripcion: 'Página oficial en Facebook'
    },
    { 
      id: 2, 
      plataforma: 'WhatsApp', 
      nombreUsuario: '+1 234 567 8900', 
      enlace: 'https://wa.me/12345678900', 
      icono: 'whatsapp', 
      activa: true, 
      orden: 2,
      descripcion: 'Chat de WhatsApp para consultas'
    }
  ];

  nuevaRedSocial: RedSocial = {
    id: 0,
    plataforma: 'Facebook',
    nombreUsuario: '',
    enlace: '',
    icono: 'facebook',
    activa: true,
    orden: 0
  };

  editando: boolean = false;
  redEditando: RedSocial | null = null;

  // Métodos getter para estadísticas
  getTotalRedes(): number {
    return this.redesSociales.length;
  }

  getRedesWhatsApp(): number {
    return this.redesSociales.filter(r => r.plataforma === 'WhatsApp').length;
  }

  getRedesFacebook(): number {
    return this.redesSociales.filter(r => r.plataforma === 'Facebook').length;
  }

  getTotalRedesActivas(): number {
    return this.redesSociales.filter(red => red.activa).length;
  }

  agregarRedSocial() {
    if (this.nuevaRedSocial.nombreUsuario && this.nuevaRedSocial.enlace) {
      this.nuevaRedSocial.id = this.redesSociales.length + 1;
      this.nuevaRedSocial.orden = this.redesSociales.length + 1;
      this.nuevaRedSocial.icono = this.nuevaRedSocial.plataforma.toLowerCase();
      this.redesSociales.push({...this.nuevaRedSocial});
      this.resetForm();
      alert('¡Red social agregada exitosamente!');
    }
  }

  editarRedSocial(red: RedSocial) {
    this.editando = true;
    this.redEditando = {...red};
    this.nuevaRedSocial = {...red};
  }

  guardarEdicion() {
    if (this.redEditando) {
      const index = this.redesSociales.findIndex(r => r.id === this.redEditando!.id);
      if (index !== -1) {
        this.redesSociales[index] = {...this.nuevaRedSocial};
      }
      this.cancelarEdicion();
      alert('¡Red social actualizada exitosamente!');
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.redEditando = null;
    this.resetForm();
  }

  eliminarRedSocial(id: number) {
    if (confirm('¿Estás seguro de eliminar esta red social?')) {
      this.redesSociales = this.redesSociales.filter(red => red.id !== id);
      // Reordenar
      this.redesSociales.forEach((red, index) => {
        red.orden = index + 1;
      });
      alert('Red social eliminada exitosamente');
    }
  }

  toggleActiva(red: RedSocial) {
    red.activa = !red.activa;
    const estado = red.activa ? 'activada' : 'desactivada';
    alert(`Red social ${estado} exitosamente`);
  }

  moverArriba(index: number) {
    if (index > 0) {
      const temp = this.redesSociales[index];
      this.redesSociales[index] = this.redesSociales[index - 1];
      this.redesSociales[index - 1] = temp;
      
      // Actualizar órdenes
      this.redesSociales.forEach((red, i) => {
        red.orden = i + 1;
      });
    }
  }

  moverAbajo(index: number) {
    if (index < this.redesSociales.length - 1) {
      const temp = this.redesSociales[index];
      this.redesSociales[index] = this.redesSociales[index + 1];
      this.redesSociales[index + 1] = temp;
      
      // Actualizar órdenes
      this.redesSociales.forEach((red, i) => {
        red.orden = i + 1;
      });
    }
  }

  getIconClass(icono: string): string {
    return `fab fa-${icono}`;
  }

  previewEnlace(enlace: string): string {
    if (enlace.length > 50) {
      return enlace.substring(0, 47) + '...';
    }
    return enlace;
  }

  copiarEnlace(enlace: string) {
    navigator.clipboard.writeText(enlace).then(() => {
      alert('¡Enlace copiado al portapapeles!');
    }).catch(err => {
      console.error('Error al copiar: ', err);
    });
  }

  private resetForm() {
    this.nuevaRedSocial = {
      id: 0,
      plataforma: 'Facebook',
      nombreUsuario: '',
      enlace: '',
      icono: 'facebook',
      activa: true,
      orden: 0
    };
  }
}