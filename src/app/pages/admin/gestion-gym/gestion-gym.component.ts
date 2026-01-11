// gestion-gym.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GestionImagenesService, GymImage } from '../../../services/gestion-imagenes.service';

@Component({
  selector: 'app-gestion-gym',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './gestion-gym.component.html',
  styleUrl: './gestion-gym.component.css'
})
export class GestionGymComponent implements OnInit {
  
  // Configuración de texto de portada
  configPortada = {
    titulo: 'Vive la experiencia Train Station',
    descripcion: 'Disfruta de un ambiente agradable y seguro con las mejores instalaciones al mejor precio.',
    subtitulo: 'Peso Libre e Integrado'
  };

  // Lista de servicios/instalaciones
  servicios: string[] = [
    'Salón de clases',
    'Áreas funcionales',
    'Área de cardio equipada',
    'Zona de pesas libres',
    'Estudio para clases grupales',
    'Área de entrenamiento funcional',
    'Vestidores con lockers'
  ];

  nuevoServicio: string = '';

  // Propiedades para gestión de imágenes
  imagenes: GymImage[] = [];
  imagenEditando: GymImage = this.createEmptyImage();
  imagenParaEliminar: GymImage | null = null;
  isEditingImagen = false;
  isUploading = false;
  archivoSeleccionado: File | null = null;
  categoriaFiltro: string = '';
  
  // Categorías - ahora editables
  categorias: string[] = [
    'Portada',
    'Instalaciones',
    'Equipo',
    'Clases',
    'Eventos',
    'Testimonios'
  ];
  
  nuevaCategoria: string = '';
  editandoCategorias: boolean = false;
  categoriaEditando: string = '';
  categoriaEditandoIndex: number = -1;

  isEditingPortada = false;
  originalConfig: any;

  constructor(private imagenesService: GestionImagenesService) {}

  ngOnInit(): void {
    this.cargarImagenes();
  }

  // ========== MÉTODOS PARA CONFIGURACIÓN DE PORTADA ==========

  editarPortada(): void {
    this.isEditingPortada = true;
    this.originalConfig = JSON.parse(JSON.stringify(this.configPortada));
  }

  guardarPortada(): void {
    this.isEditingPortada = false;
    // Aquí iría la llamada al servicio para guardar en el backend
    console.log('Configuración de portada guardada:', this.configPortada);
    alert('Configuración de portada guardada exitosamente');
  }

  cancelarEdicionPortada(): void {
    this.isEditingPortada = false;
    this.configPortada = JSON.parse(JSON.stringify(this.originalConfig));
  }

  agregarServicio(): void {
    if (this.nuevoServicio.trim()) {
      this.servicios.push(this.nuevoServicio.trim());
      this.nuevoServicio = '';
    }
  }

  eliminarServicio(index: number): void {
    this.servicios.splice(index, 1);
  }

  // ========== MÉTODOS PARA GESTIÓN DE CATEGORÍAS ==========

  agregarCategoria(): void {
    if (this.nuevaCategoria.trim() && !this.categorias.includes(this.nuevaCategoria.trim())) {
      this.categorias.push(this.nuevaCategoria.trim());
      this.nuevaCategoria = '';
    }
  }

  editarCategoria(categoria: string, index: number): void {
    this.categoriaEditando = categoria;
    this.categoriaEditandoIndex = index;
  }

  guardarCategoriaEditada(): void {
    if (this.categoriaEditando.trim()) {
      this.categorias[this.categoriaEditandoIndex] = this.categoriaEditando.trim();
      this.categoriaEditando = '';
      this.categoriaEditandoIndex = -1;
    }
  }

  cancelarEdicionCategoria(): void {
    this.categoriaEditando = '';
    this.categoriaEditandoIndex = -1;
  }

  eliminarCategoria(index: number): void {
    const categoria = this.categorias[index];
    
    // Verificar si hay imágenes en esta categoría
    const imagenesEnCategoria = this.imagenes.filter(img => img.categoria === categoria);
    
    if (imagenesEnCategoria.length > 0) {
      if (confirm(`No puedes eliminar esta categoría porque tiene ${imagenesEnCategoria.length} imagen(es). Primero mueve las imágenes a otra categoría.`)) {
        return;
      }
    }
    
    this.categorias.splice(index, 1);
  }

  // ========== MÉTODOS PARA GESTIÓN DE IMÁGENES ==========

  cargarImagenes(): void {
    this.imagenesService.getImagenes().subscribe({
      next: (imagenes: GymImage[]) => {
        this.imagenes = imagenes.sort((a: GymImage, b: GymImage) => a.orden - b.orden);
      },
      error: (error: any) => {
        console.error('Error al cargar imágenes:', error);
        alert('Error al cargar las imágenes');
      }
    });
  }

  createEmptyImage(): GymImage {
    return {
      titulo: '',
      descripcion: '',
      url: '',
      categoria: 'Instalaciones',
      orden: this.imagenes.length + 1,
      activa: true
    };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(file.type)) {
        alert('Solo se permiten imágenes (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      
      this.archivoSeleccionado = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenEditando.url = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  iniciarSubidaImagen(): void {
    if (!this.archivoSeleccionado && !this.isEditingImagen) {
      alert('Selecciona una imagen primero');
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    
    if (this.archivoSeleccionado) {
      formData.append('imagen', this.archivoSeleccionado);
    }
    
    formData.append('titulo', this.imagenEditando.titulo);
    formData.append('descripcion', this.imagenEditando.descripcion);
    formData.append('categoria', this.imagenEditando.categoria);
    formData.append('orden', this.imagenEditando.orden.toString());
    formData.append('activa', this.imagenEditando.activa.toString());

    if (this.isEditingImagen && this.imagenEditando.id) {
      // Actualizar imagen existente
      this.imagenesService.updateImagen(this.imagenEditando.id, formData).subscribe({
        next: (imagenActualizada: GymImage) => {
          const index = this.imagenes.findIndex(i => i.id === imagenActualizada.id);
          if (index !== -1) {
            this.imagenes[index] = imagenActualizada;
          }
          this.resetFormImagen();
          this.isUploading = false;
          alert('Imagen actualizada exitosamente');
        },
        error: (error: any) => {
          console.error('Error al actualizar imagen:', error);
          this.isUploading = false;
          alert('Error al actualizar la imagen');
        }
      });
    } else {
      // Crear nueva imagen
      this.imagenesService.createImagen(formData).subscribe({
        next: (imagen: GymImage) => {
          this.imagenes.push(imagen);
          this.resetFormImagen();
          this.isUploading = false;
          alert('Imagen subida exitosamente');
        },
        error: (error: any) => {
          console.error('Error al subir imagen:', error);
          this.isUploading = false;
          alert('Error al subir la imagen');
        }
      });
    }
  }

  editarImagen(imagen: GymImage): void {
    this.isEditingImagen = true;
    this.imagenEditando = { ...imagen };
    this.archivoSeleccionado = null;
    
    // Hacer scroll al formulario
    setTimeout(() => {
      const formElement = document.querySelector('.upload-section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  actualizarImagen(): void {
    this.iniciarSubidaImagen();
  }

  confirmarEliminacionImagen(imagen: GymImage): void {
    this.imagenParaEliminar = imagen;
  }

  eliminarImagen(): void {
    if (!this.imagenParaEliminar?.id) return;

    this.imagenesService.deleteImagen(this.imagenParaEliminar.id).subscribe({
      next: () => {
        this.imagenes = this.imagenes.filter(i => i.id !== this.imagenParaEliminar?.id);
        this.imagenParaEliminar = null;
        alert('Imagen eliminada exitosamente');
      },
      error: (error: any) => {
        console.error('Error al eliminar imagen:', error);
        alert('Error al eliminar la imagen');
      }
    });
  }

  cancelarEliminacionImagen(): void {
    this.imagenParaEliminar = null;
  }

  resetFormImagen(): void {
    this.imagenEditando = this.createEmptyImage();
    this.archivoSeleccionado = null;
    this.isEditingImagen = false;
  }

  moverArribaImagen(imagen: GymImage): void {
    const index = this.imagenes.findIndex(i => i.id === imagen.id);
    if (index > 0) {
      [this.imagenes[index], this.imagenes[index - 1]] = [this.imagenes[index - 1], this.imagenes[index]];
      this.actualizarOrdenesImagenes();
    }
  }

  moverAbajoImagen(imagen: GymImage): void {
    const index = this.imagenes.findIndex(i => i.id === imagen.id);
    if (index < this.imagenes.length - 1) {
      [this.imagenes[index], this.imagenes[index + 1]] = [this.imagenes[index + 1], this.imagenes[index]];
      this.actualizarOrdenesImagenes();
    }
  }

  actualizarOrdenesImagenes(): void {
    this.imagenes.forEach((imagen, index) => {
      imagen.orden = index + 1;
    });
    this.imagenesService.reorderImagenes(this.imagenes).subscribe({
      next: () => {
        console.log('Imágenes reordenadas correctamente');
      },
      error: (error: any) => {
        console.error('Error al reordenar imágenes:', error);
        alert('Error al reordenar las imágenes');
      }
    });
  }

  getImagenesPorCategoria(categoria: string): GymImage[] {
    return this.imagenes.filter(img => img.categoria === categoria);
  }

  get imagenesFiltradas(): GymImage[] {
    if (!this.categoriaFiltro) {
      return this.imagenes;
    }
    return this.imagenes.filter(img => img.categoria === this.categoriaFiltro);
  }
}