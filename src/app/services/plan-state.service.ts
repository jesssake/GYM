import { Injectable, signal, Signal } from '@angular/core';

// Interfaz para definir la estructura de un Plan
export interface Plan {
  id: number;
  nombre: string;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlanStateService {
  // Signal para almacenar el plan que el usuario ha seleccionado.
  // Es inicializado como null (ningún plan seleccionado).
  private _selectedPlan = signal<Plan | null>(null);

  // Exponer el Signal como solo lectura al exterior
  readonly selectedPlan: Signal<Plan | null> = this._selectedPlan.asReadonly();

  constructor() { }

  /**
   * Guarda el plan seleccionado por el usuario antes de la autenticación o pago.
   * @param plan El objeto Plan seleccionado.
   */
  setPlan(plan: Plan): void {
    this._selectedPlan.set(plan);
    console.log(`[PlanStateService] Plan Guardado: ${plan.nombre}`);
    // Opcionalmente, podrías guardar esto en localStorage/sessionStorage
    // para que persista en recargas, pero lo mantendremos en memoria por ahora.
  }

  /**
   * Limpia el plan seleccionado después de que la compra se haya completado.
   */
  clearPlan(): void {
    this._selectedPlan.set(null);
    console.log('[PlanStateService] Plan limpiado.');
  }
}
