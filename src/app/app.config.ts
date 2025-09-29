import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// Importamos solo lo necesario, eliminando withRouterConfig
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // CORRECCIÓN CLAVE: Eliminamos la configuración de scroll que causa error
    provideRouter(
      routes,
      // Opcional: si necesitas la entrada de componentes, déjalo. Si no, quítalo para más seguridad.
      withComponentInputBinding()
    )
  ]
};
