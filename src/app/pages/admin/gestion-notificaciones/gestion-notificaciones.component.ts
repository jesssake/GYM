import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http'; // Se asume que HttpClient es inyectado en AuthService

interface ClientExpiration {
    name: string;
    email: string;
    expirationDate: string;
    status: string;
    statusClass: string;
}

@Component({
    selector: 'app-gestion-notificaciones',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './gestion-notificaciones.component.html',
    styleUrls: ['./gestion-notificaciones.component.css']
})
export class GestionNotificacionesComponent implements OnInit {

    // 🚨 Esta es la variable enlazada en el HTML: configDays
    configDays: number = 7;
    clients: ClientExpiration[] = [];
    isLoading: boolean = false;

    // Se asume que AuthService maneja la inyección de HttpClient
    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.cargarConfiguracionActual();
        this.cargarClientesExpirando();
    }

    cargarConfiguracionActual() {
        this.authService.getAlertConfig().subscribe({
            next: (response: any) => {
                if (response.ok && response.config) {
                    // Asigna el valor numérico de la BD a configDays
                    this.configDays = response.config.dias_antes;
                }
            },
            error: (err) => {
                console.error('❌ Error al cargar configuración inicial:', err);
            }
        });
    }

    cargarClientesExpirando() {
        this.isLoading = true;

        this.authService.getExpiringClients().subscribe({
            next: (response: any) => {
                if (response.ok && response.clientes) {
                    this.clients = response.clientes.map((client: any) => ({
                        // Nota: El backend devuelve 'nombre' y 'fecha_fin'
                        name: client.nombre || 'Cliente Desconocido',
                        email: client.email || 'N/A',
                        expirationDate: client.fecha_fin || 'N/A',
                        status: 'Por Expirar',
                        statusClass: 'status-warning',
                    }));
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('❌ Error al cargar clientes expirando:', err);
                this.isLoading = false;
            }
        });
    }

    guardarConfiguracion() {
        const daysValue = this.configDays; // Usa configDays, que ahora es un número por el HTML corregido

        if (daysValue === undefined || daysValue < 1 || isNaN(daysValue)) {
            console.error('❌ Validación Frontend: El valor debe ser un número positivo.');
            return;
        }

        // Se envía el valor numérico al servicio con la clave 'diasAntes'
        this.authService.updateAlertConfig(daysValue).subscribe({
            next: (response: any) => {
                console.log('✅ Configuración guardada:', response.msg);
                this.cargarClientesExpirando(); // Recarga la lista de clientes
            },
            error: (err) => {
                console.error('❌ Error al guardar configuración:', err.error.msg || 'Error de conexión.');
            }
        });
    }
}
