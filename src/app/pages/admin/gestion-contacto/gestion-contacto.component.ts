// gestión-contacto.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Pipe personalizado para truncar URLs
import { TruncateUrlPipe } from './truncate-url.pipe';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-gestion-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncateUrlPipe],
  templateUrl: './gestion-contacto.component.html',
  styleUrls: ['./gestion-contacto.component.css']
})
export class GestionContactoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('direccionInput') direccionInput!: ElementRef;

  // Dirección para búsqueda
  direccionBusqueda: string = '';
  
  // Información de contacto
  contactoInfo = {
    direccionGoogleMaps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.8888!2d-99.133208!3d19.4326077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f92b75aa014d%3A0x17c8b0c9e8a2a4a5!2sAv.%20Reforma%20123%2C%20Ju%C3%A1rez%2C%20Cuauht%C3%A9moc%2C%2006600%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX%2C%20M%C3%A9xico!5e0!3m2!1ses!2smx!4v1681234567890',
    direccionFisica: 'Av. Reforma 123, CDMX, México',
    telefono: '+525555123456',
    correoElectronico: 'info@gimnasiofitness.com'
  };

  mapaUrl: SafeResourceUrl;
  mostrarMapa: boolean = false;
  mostrarSelectorTipo: boolean = false;
  tipoLugarSeleccionado: string = 'place';
  coordenadas: { lat: number, lng: number } | null = null;
  
  // Opciones del mapa
  mostrarControles: boolean = true;
  mostrarEtiquetas: boolean = true;
  modoSatelite: boolean = false;
  zoom: number = 15;
  
  // Place ID (para lugares específicos de Google)
  placeId: string = '';

  private autocomplete: any;
  private googleMapsScriptLoaded: boolean = false;

  constructor(private sanitizer: DomSanitizer) {
    console.log('Gestión de contacto cargado');
    this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.contactoInfo.direccionGoogleMaps);
    
    // Cargar desde localStorage si existe
    const contactoGuardado = localStorage.getItem('contactoInfo');
    if (contactoGuardado) {
      try {
        const parsed = JSON.parse(contactoGuardado);
        this.contactoInfo = { ...this.contactoInfo, ...parsed };
        this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.contactoInfo.direccionGoogleMaps);
        this.mostrarMapa = true;
        if (parsed.direccionFisica) {
          this.direccionBusqueda = parsed.direccionFisica;
        }
      } catch (e) {
        console.error('Error al cargar datos de contacto:', e);
      }
    }
    
    this.cargarGoogleMapsAPI();
  }

  ngAfterViewInit() {
    // Inicializar autocomplete después de que la vista esté lista
    this.inicializarGoogleMaps();
  }

  ngOnDestroy() {
    // Limpiar listeners si es necesario
    if (this.autocomplete) {
      if (this.autocomplete.removeListener) {
        this.autocomplete.removeListener('place_changed');
      }
    }
  }

  // Cargar Google Maps API
  cargarGoogleMapsAPI() {
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      // Solo cargamos la API de Places, no la de Embed
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps API cargada correctamente');
        this.googleMapsScriptLoaded = true;
        this.inicializarAutocomplete();
      };
      script.onerror = () => {
        console.error('Error al cargar Google Maps API');
        this.googleMapsScriptLoaded = false;
      };
      document.head.appendChild(script);
    } else {
      this.googleMapsScriptLoaded = true;
      setTimeout(() => this.inicializarAutocomplete(), 100);
    }
  }

  // Inicializar Google Maps después de cargar
  inicializarGoogleMaps() {
    const checkGoogle = () => {
      if (typeof window.google !== 'undefined' && window.google.maps) {
        this.inicializarAutocomplete();
      } else {
        setTimeout(checkGoogle, 100);
      }
    };
    setTimeout(checkGoogle, 1000);
  }

  // Inicializar autocomplete de Google Places
  inicializarAutocomplete() {
    if (typeof window.google !== 'undefined' && window.google.maps && window.google.maps.places && this.direccionInput) {
      try {
        this.autocomplete = new window.google.maps.places.Autocomplete(
          this.direccionInput.nativeElement,
          {
            types: ['address'],
            componentRestrictions: { country: 'mx' },
            fields: ['formatted_address', 'geometry', 'name', 'place_id']
          }
        );

        // Escuchar cuando se selecciona un lugar
        this.autocomplete.addListener('place_changed', () => {
          const place = this.autocomplete.getPlace();
          if (place.geometry) {
            this.procesarLugarSeleccionado(place);
          }
        });
        
        console.log('Autocomplete de Google Places inicializado correctamente');
      } catch (error) {
        console.error('Error al inicializar autocomplete:', error);
      }
    } else {
      console.warn('Google Maps API no disponible para autocomplete');
    }
  }

  // Procesar lugar seleccionado del autocomplete
  procesarLugarSeleccionado(place: any) {
    // Actualizar dirección
    this.direccionBusqueda = place.formatted_address || place.name;
    this.contactoInfo.direccionFisica = this.direccionBusqueda;
    
    // Guardar coordenadas
    this.coordenadas = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    
    // Guardar place_id si existe
    this.placeId = place.place_id || '';
    
    // Mostrar selector de tipo
    this.mostrarSelectorTipo = true;
    
    // Generar URL del mapa
    this.generarUrlDesdeCoordenadas();
    this.mostrarMapa = true;
    
    console.log('Lugar seleccionado:', place);
  }

  // Generar URL desde coordenadas - CORREGIDO
  generarUrlDesdeCoordenadas() {
    if (!this.coordenadas) return;

    let urlBase = '';
    const apiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';
    
    switch (this.tipoLugarSeleccionado) {
      case 'place':
        if (this.placeId) {
          // Usar Place ID para mayor precisión
          urlBase = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${this.placeId}`;
        } else {
          // Usar coordenadas con dirección codificada
          const direccionCodificada = encodeURIComponent(this.direccionBusqueda);
          urlBase = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${direccionCodificada}`;
        }
        break;
        
      case 'view':
        urlBase = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${this.coordenadas.lat},${this.coordenadas.lng}&zoom=${this.zoom}`;
        break;
        
      case 'streetview':
        urlBase = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${this.coordenadas.lat},${this.coordenadas.lng}&heading=210&pitch=10&fov=90`;
        break;
    }
    
    // Agregar parámetros adicionales
    const params = new URLSearchParams();
    
    // Idioma
    params.append('language', 'es');
    params.append('region', 'MX');
    
    // Tipo de mapa
    if (this.modoSatelite) {
      params.append('maptype', 'satellite');
    }
    
    this.contactoInfo.direccionGoogleMaps = `${urlBase}&${params.toString()}`;
    console.log('URL generada:', this.contactoInfo.direccionGoogleMaps);
    this.actualizarUrlMapa();
  }

  // Usar ubicación actual del usuario
  usarMiUbicacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.coordenadas = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Convertir coordenadas a dirección (reverse geocoding)
          this.reverseGeocode(this.coordenadas.lat, this.coordenadas.lng);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          this.mostrarNotificacion('No se pudo obtener tu ubicación. Asegúrate de permitir el acceso a la ubicación.', 'error');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      this.mostrarNotificacion('Tu navegador no soporta geolocalización', 'error');
    }
  }

  // Convertir coordenadas a dirección
  reverseGeocode(lat: number, lng: number) {
    if (typeof window.google !== 'undefined' && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };
      
      geocoder.geocode({ location: latlng }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          this.direccionBusqueda = results[0].formatted_address;
          this.contactoInfo.direccionFisica = this.direccionBusqueda;
          this.mostrarSelectorTipo = true;
          this.generarUrlDesdeCoordenadas();
          this.mostrarMapa = true;
          this.mostrarNotificacion('Ubicación obtenida correctamente', 'success');
        } else {
          console.error('Error en reverse geocoding:', status);
          // Crear URL con coordenadas directamente
          this.contactoInfo.direccionFisica = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
          this.generarUrlDesdeCoordenadas();
          this.mostrarMapa = true;
          this.mostrarNotificacion('Ubicación obtenida (sin dirección específica)', 'info');
        }
      });
    } else {
      this.generarUrlBasica();
    }
  }

  // Buscar dirección manualmente
  buscarDireccion() {
    if (!this.direccionBusqueda.trim()) {
      this.mostrarNotificacion('Por favor, escribe una dirección', 'warning');
      return;
    }

    if (typeof window.google !== 'undefined' && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address: this.direccionBusqueda }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          this.procesarLugarSeleccionado(results[0]);
          this.mostrarNotificacion('Dirección encontrada', 'success');
        } else {
          this.mostrarNotificacion('No se encontró la dirección. Intenta con una dirección más específica.', 'error');
          // Generar URL básica como fallback
          this.generarUrlBasica();
        }
      });
    } else {
      // Fallback si Google Maps no está cargado
      this.generarUrlBasica();
    }
  }

  // Generar URL básica como fallback - CORREGIDO
  generarUrlBasica() {
    this.contactoInfo.direccionFisica = this.direccionBusqueda;
    const direccionCodificada = encodeURIComponent(this.direccionBusqueda);
    const apiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';
    
    // URL de embed con API key válida
    const urlConApi = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${direccionCodificada}&language=es&region=MX`;
    
    this.contactoInfo.direccionGoogleMaps = urlConApi;
    this.actualizarUrlMapa();
    this.mostrarMapa = true;
    this.mostrarSelectorTipo = false;
    this.coordenadas = null;
    this.mostrarNotificacion('Mapa generado (sin autocomplete)', 'info');
  }

  // Actualizar URL con tipo de lugar
  actualizarUrlConTipoLugar() {
    if (this.coordenadas || this.direccionBusqueda) {
      this.generarUrlDesdeCoordenadas();
    }
  }

  // Actualizar opciones del mapa
  actualizarOpcionesMapa() {
    if (this.coordenadas || this.direccionBusqueda) {
      this.generarUrlDesdeCoordenadas();
    }
  }

  // Actualizar URL del mapa con opciones
  actualizarUrlMapa() {
    if (this.contactoInfo.direccionGoogleMaps) {
      // Verificar que la URL sea válida
      if (!this.contactoInfo.direccionGoogleMaps.includes('key=')) {
        // Si no tiene API key, agregar una
        const apiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';
        if (this.contactoInfo.direccionGoogleMaps.includes('?')) {
          this.contactoInfo.direccionGoogleMaps += `&key=${apiKey}`;
        } else {
          this.contactoInfo.direccionGoogleMaps += `?key=${apiKey}`;
        }
      }
      
      this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.contactoInfo.direccionGoogleMaps);
    }
  }

  // Copiar URL al portapapeles
  async copiarUrl() {
    try {
      await navigator.clipboard.writeText(this.contactoInfo.direccionGoogleMaps);
      this.mostrarNotificacion('URL copiada al portapapeles', 'success');
    } catch (err) {
      console.error('Error al copiar:', err);
      this.mostrarNotificacion('No se pudo copiar la URL', 'error');
    }
  }

  // Abrir en nueva pestaña
  abrirEnNuevaPestana() {
    try {
      window.open(this.contactoInfo.direccionGoogleMaps, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Error al abrir en nueva pestaña:', err);
      this.mostrarNotificacion('No se pudo abrir el mapa', 'error');
    }
  }

  // Generar URL corta (simulación)
  async generarUrlCorta() {
    // En una implementación real, aquí llamarías a una API de acortamiento de URLs
    const urlCorta = this.acortarUrl(this.contactoInfo.direccionGoogleMaps);
    
    try {
      await navigator.clipboard.writeText(urlCorta);
      this.mostrarNotificacion('URL corta copiada al portapapeles', 'success');
    } catch (err) {
      console.error('Error al copiar URL corta:', err);
      this.mostrarNotificacion('No se pudo generar URL corta', 'error');
    }
  }

  // Función para acortar URL (simulada)
  private acortarUrl(url: string): string {
    // En producción, usarías un servicio como Bitly o Firebase Dynamic Links
    const hash = btoa(url).replace(/[+/=]/g, '').substring(0, 10);
    return `https://maps.gymfit.com/${hash}`;
  }

  // Probar mapa
  probarMapa() {
    // Recargar el iframe para probar
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
    this.mostrarNotificacion('Mapa actualizado. Prueba la navegación.', 'info');
  }

  // Editar mapa existente
  editarMapa() {
    this.mostrarMapa = true;
    this.mostrarSelectorTipo = true;
    if (this.contactoInfo.direccionFisica) {
      this.direccionBusqueda = this.contactoInfo.direccionFisica;
    }
  }

  // Guardar cambios
  guardarCambios() {
    console.log('Información de contacto guardada:', this.contactoInfo);
    
    // Asegurarnos de que el mapa se actualice
    this.actualizarUrlMapa();
    
    this.mostrarNotificacion('Información de contacto actualizada correctamente', 'success');
    
    // Guardar en localStorage para persistencia
    try {
      localStorage.setItem('contactoInfo', JSON.stringify(this.contactoInfo));
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
      this.mostrarNotificacion('Error al guardar en localStorage', 'error');
    }
  }

  // Mostrar notificación con tipo
  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning' = 'info') {
    const colors = {
      success: '#2ecc71',
      error: '#e74c3c',
      info: '#3498db',
      warning: '#f39c12'
    };

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = mensaje;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[tipo]};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 400px;
      word-break: break-word;
    `;
    
    // Remover notificaciones anteriores
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 3000);
  }
}