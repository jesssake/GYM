import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-servicios.component.html',
  styleUrls: ['./gestion-servicios.component.css']
})
export class GestionServiciosComponent implements OnInit {
  // Datos principales
  servicios: any[] = [];
  categorias: any[] = [];
  
  // Estados UI
  tabActiva: string = 'servicios';
  showModalServicio: boolean = false;
  showModalCategoria: boolean = false;
  modoEdicionServicio: boolean = false;
  modoEdicionCategoria: boolean = false;
  
  // Filtros
  filtroServicio: string = '';
  filtroCategoria: string = '';
  filtroCategoriaBusqueda: string = '';
  
  // Selecciones
  servicioSeleccionado: any = {};
  categoriaSeleccionada: any = {};
  
  // Opciones de diseño
  colores: string[] = [
    '#3B82F6', // Azul
    '#10B981', // Verde
    '#8B5CF6', // Violeta
    '#F59E0B', // Ámbar
    '#EF4444', // Rojo
    '#06B6D4', // Cian
    '#EC4899'  // Rosa
  ];
  
  iconos: string[] = [
    '🏋️', '👥', '🧘', '💆',
    '🏊', '🚴', '🤸', '🥊',
    '🥋', '🤼', '🏓', '🎯'
  ];
  
  // Estadísticas calculadas
  totalServicios: number = 0;
  serviciosActivos: number = 0;
  serviciosDestacados: number = 0;
  totalCategorias: number = 0;
  categoriasEnUso: number = 0;
  serviciosPorCategoria: string = '0.0';
  
  // Datos filtrados
  serviciosFiltrados: any[] = [];
  categoriasFiltradas: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.inicializarDatos();
    this.actualizarEstadisticas();
  }

  // =================== INICIALIZACIÓN ===================
  private inicializarDatos(): void {
    // Servicios de ejemplo
    this.servicios = [
      {
        id: 1,
        nombre: 'Entrenamiento Personalizado',
        descripcion: 'Plan de entrenamiento individualizado con seguimiento constante',
        activo: true,
        categoriaId: 1,
        destacado: true,
        fechaCreacion: '2024-01-15'
      },
      {
        id: 2,
        nombre: 'Clase de Spinning',
        descripcion: 'Sesiones grupales de ciclismo indoor con música energizante',
        activo: true,
        categoriaId: 2,
        destacado: false,
        fechaCreacion: '2024-01-10'
      },
      {
        id: 3,
        nombre: 'Yoga Integral',
        descripcion: 'Práctica completa de yoga para todos los niveles',
        activo: true,
        categoriaId: 3,
        destacado: true,
        fechaCreacion: '2024-01-05'
      },
      {
        id: 4,
        nombre: 'Pilates Reformer',
        descripcion: 'Entrenamiento de fuerza y flexibilidad con máquina reformer',
        activo: false,
        categoriaId: 1,
        destacado: false,
        fechaCreacion: '2024-01-20'
      }
    ];

    // Categorías de ejemplo
    this.categorias = [
      {
        id: 1,
        nombre: 'Entrenamiento',
        descripcion: 'Servicios de entrenamiento físico personalizado',
        color: '#3B82F6',
        icono: '🏋️',
        activa: true,
        fechaCreacion: '2024-01-01'
      },
      {
        id: 2,
        nombre: 'Clases Grupales',
        descripcion: 'Actividades en grupo dirigidas por instructores',
        color: '#10B981',
        icono: '👥',
        activa: true,
        fechaCreacion: '2024-01-01'
      },
      {
        id: 3,
        nombre: 'Bienestar',
        descripcion: 'Servicios para la salud mental y física',
        color: '#8B5CF6',
        icono: '🧘',
        activa: true,
        fechaCreacion: '2024-01-01'
      },
      {
        id: 4,
        nombre: 'Especializados',
        descripcion: 'Servicios técnicos y especializados',
        color: '#F59E0B',
        icono: '⭐',
        activa: false,
        fechaCreacion: '2024-01-02'
      }
    ];

    this.actualizarDatos();
  }

  // =================== ACTUALIZACIÓN DE DATOS ===================
  private actualizarDatos(): void {
    this.actualizarEstadisticas();
    this.filtrarServicios();
    this.filtrarCategorias();
  }

  private actualizarEstadisticas(): void {
    this.totalServicios = this.servicios.length;
    this.serviciosActivos = this.servicios.filter(s => s.activo).length;
    this.serviciosDestacados = this.servicios.filter(s => s.destacado).length;
    this.totalCategorias = this.categorias.length;
    
    const categoriasIdsUsadas = new Set(this.servicios.map(s => s.categoriaId));
    this.categoriasEnUso = categoriasIdsUsadas.size;
    
    this.serviciosPorCategoria = this.totalCategorias > 0 
      ? (this.totalServicios / this.totalCategorias).toFixed(1)
      : '0.0';
  }

  private filtrarServicios(): void {
    let resultado = [...this.servicios];

    // Filtrar por búsqueda de texto
    if (this.filtroServicio.trim()) {
      const busqueda = this.filtroServicio.toLowerCase().trim();
      resultado = resultado.filter(servicio =>
        servicio.nombre.toLowerCase().includes(busqueda) ||
        (servicio.descripcion && servicio.descripcion.toLowerCase().includes(busqueda))
      );
    }

    // Filtrar por categoría
    if (this.filtroCategoria) {
      const categoriaId = parseInt(this.filtroCategoria);
      resultado = resultado.filter(servicio => servicio.categoriaId === categoriaId);
    }

    this.serviciosFiltrados = resultado;
  }

  private filtrarCategorias(): void {
    let resultado = [...this.categorias];

    if (this.filtroCategoriaBusqueda.trim()) {
      const busqueda = this.filtroCategoriaBusqueda.toLowerCase().trim();
      resultado = resultado.filter(categoria =>
        categoria.nombre.toLowerCase().includes(busqueda) ||
        (categoria.descripcion && categoria.descripcion.toLowerCase().includes(busqueda))
      );
    }

    this.categoriasFiltradas = resultado;
  }

  // =================== MANEJO DE SERVICIOS ===================
  abrirModalCrearServicio(): void {
    this.servicioSeleccionado = {
      nombre: '',
      descripcion: '',
      activo: true,
      categoriaId: this.categorias[0]?.id || null,
      destacado: false
    };
    this.modoEdicionServicio = false;
    this.showModalServicio = true;
  }

  abrirModalEditarServicio(servicio: any): void {
    this.servicioSeleccionado = { ...servicio };
    this.modoEdicionServicio = true;
    this.showModalServicio = true;
  }

  guardarServicio(): void {
    if (!this.validarServicio()) return;

    if (this.modoEdicionServicio) {
      const index = this.servicios.findIndex(s => s.id === this.servicioSeleccionado.id);
      if (index !== -1) {
        this.servicios[index] = { ...this.servicioSeleccionado };
      }
    } else {
      const nuevoId = this.generarNuevoId(this.servicios);
      this.servicioSeleccionado.id = nuevoId;
      this.servicioSeleccionado.fechaCreacion = new Date().toISOString().split('T')[0];
      this.servicios.push({ ...this.servicioSeleccionado });
    }

    this.cerrarModalServicio();
    this.mostrarMensaje(this.modoEdicionServicio ? 'Servicio actualizado' : 'Servicio creado');
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Está seguro de eliminar este servicio?')) {
      this.servicios = this.servicios.filter(s => s.id !== id);
      this.actualizarDatos();
      this.mostrarMensaje('Servicio eliminado');
    }
  }

  cerrarModalServicio(): void {
    this.showModalServicio = false;
    this.servicioSeleccionado = {};
  }

  // =================== MANEJO DE CATEGORÍAS ===================
  abrirModalCrearCategoria(): void {
    this.categoriaSeleccionada = {
      nombre: '',
      descripcion: '',
      color: this.colores[0],
      icono: this.iconos[0],
      activa: true
    };
    this.modoEdicionCategoria = false;
    this.showModalCategoria = true;
  }

  abrirModalEditarCategoria(categoria: any): void {
    this.categoriaSeleccionada = { ...categoria };
    this.modoEdicionCategoria = true;
    this.showModalCategoria = true;
  }

  guardarCategoria(): void {
    if (!this.validarCategoria()) return;

    if (this.modoEdicionCategoria) {
      const index = this.categorias.findIndex(c => c.id === this.categoriaSeleccionada.id);
      if (index !== -1) {
        this.categorias[index] = { ...this.categoriaSeleccionada };
      }
    } else {
      const nuevoId = this.generarNuevoId(this.categorias);
      this.categoriaSeleccionada.id = nuevoId;
      this.categoriaSeleccionada.fechaCreacion = new Date().toISOString().split('T')[0];
      this.categorias.push({ ...this.categoriaSeleccionada });
    }

    this.cerrarModalCategoria();
    this.mostrarMensaje(this.modoEdicionCategoria ? 'Categoría actualizada' : 'Categoría creada');
  }

  eliminarCategoria(id: number): void {
    const serviciosEnCategoria = this.servicios.filter(s => s.categoriaId === id).length;

    if (serviciosEnCategoria > 0) {
      alert(`No se puede eliminar: ${serviciosEnCategoria} servicio(s) asociado(s)`);
      return;
    }

    if (confirm('¿Está seguro de eliminar esta categoría?')) {
      this.categorias = this.categorias.filter(c => c.id !== id);
      this.actualizarDatos();
      this.mostrarMensaje('Categoría eliminada');
    }
  }

  cerrarModalCategoria(): void {
    this.showModalCategoria = false;
    this.categoriaSeleccionada = {};
  }

  // =================== MÉTODOS AUXILIARES ===================
  private generarNuevoId(items: any[]): number {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

  private validarServicio(): boolean {
    if (!this.servicioSeleccionado.nombre?.trim()) {
      alert('El nombre del servicio es obligatorio');
      return false;
    }
    if (!this.servicioSeleccionado.categoriaId) {
      alert('Seleccione una categoría');
      return false;
    }
    return true;
  }

  private validarCategoria(): boolean {
    if (!this.categoriaSeleccionada.nombre?.trim()) {
      alert('El nombre de la categoría es obligatorio');
      return false;
    }
    return true;
  }

  private mostrarMensaje(mensaje: string): void {
    alert(`✅ ${mensaje}`);
    this.actualizarDatos();
  }

  // =================== MÉTODOS PÚBLICOS UTILES ===================
  cambiarTab(tab: string): void {
    this.tabActiva = tab;
  }

  alternarActivoServicio(servicio: any): void {
    servicio.activo = !servicio.activo;
    this.actualizarDatos();
    this.mostrarMensaje(servicio.activo ? 'Servicio activado' : 'Servicio desactivado');
  }

  alternarDestacadoServicio(servicio: any): void {
    servicio.destacado = !servicio.destacado;
    this.actualizarDatos();
    this.mostrarMensaje(servicio.destacado ? 'Servicio destacado' : 'Servicio normal');
  }

  alternarActivaCategoria(categoria: any): void {
    categoria.activa = !categoria.activa;
    this.actualizarDatos();
    this.mostrarMensaje(categoria.activa ? 'Categoría activada' : 'Categoría desactivada');
  }

  // =================== GETTERS PARA TEMPLATE ===================
  obtenerIconoCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria?.icono || '📋';
  }

  obtenerNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  }

  contarServiciosPorCategoria(categoriaId: number): number {
    return this.servicios.filter(s => s.categoriaId === categoriaId).length;
  }

  obtenerServiciosPorCategoria(categoriaId: number): any[] {
    return this.servicios.filter(s => s.categoriaId === categoriaId);
  }

  obtenerColorEstado(activo: boolean): string {
    return activo 
      ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/20 text-green-400 border border-green-800/50' 
      : 'bg-gradient-to-r from-red-900/30 to-pink-900/20 text-red-400 border border-red-800/50';
  }

  obtenerTextoEstado(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  exportarDatos(): void {
    const datos = {
      servicios: this.servicios,
      categorias: this.categorias,
      exportado: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gym-servicios-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.mostrarMensaje('Datos exportados');
  }

  // Eventos de filtros
  onFiltroChange(): void {
    this.filtrarServicios();
  }

  onFiltroCategoriaBusquedaChange(): void {
    this.filtrarCategorias();
  }
}