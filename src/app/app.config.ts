import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // 🚨 NUEVO: Función requerida para usar HttpClient en Standalone Components

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding()
    ),
    provideHttpClient() // 🚨 CORRECCIÓN CLAVE: Habilita el módulo HTTP para toda la aplicación.
  ]
};
