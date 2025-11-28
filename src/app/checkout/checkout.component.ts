import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// Interfaz del plan
interface Plan {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
}

@Component({
  selector: 'app-registro-pago',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    RouterLink      // ✔️ SÍ lo necesitas
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class RegistroPagoComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  plan: Plan | undefined;
  paymentForm!: FormGroup;

  isProcessing = false;
  errorMessage: string | null = null;

  paymentMethods = [
    { name: 'Tarjeta de Crédito/Débito', icon: 'fa-credit-card', value: 'card' },
    { name: 'PayPal', icon: 'fa-paypal', value: 'paypal' },
    { name: 'Transferencia Bancaria', icon: 'fa-university', value: 'transfer' }
  ];

  selectedMethod: string = 'card';

  ngOnInit(): void {
    this.initForm();

    this.route.queryParams.subscribe(params => {
      if (params['id'] && params['nombre'] && params['precio']) {
        this.plan = {
          id: +params['id'],
          nombre: params['nombre'],
          precio: +params['precio'],
          descripcion: params['descripcion'] || 'Membresía del gimnasio'
        };
      } else {
        this.errorMessage = 'No se encontró información del plan. Regresa a la página de Planes.';
      }
    });
  }

  // Inicialización del formulario
  initForm(): void {
    this.paymentForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      cardExpiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cardCvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  // Cambio de método de pago
  selectPaymentMethod(method: string): void {
    this.selectedMethod = method;

    const controls = ['cardName', 'cardNumber', 'cardExpiry', 'cardCvv'];

    if (method !== 'card') {
      controls.forEach(c => this.paymentForm.get(c)?.disable());
    } else {
      controls.forEach(c => this.paymentForm.get(c)?.enable());
    }

    this.paymentForm.updateValueAndValidity();
  }

  // Procesar pago
  async processPayment(): Promise<void> {
    this.errorMessage = null;

    if (this.selectedMethod === 'card' && this.paymentForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos de la tarjeta correctamente.';
      return;
    }

    if (!this.plan) {
      this.errorMessage = 'Error: No se ha seleccionado ningún plan para procesar.';
      return;
    }

    this.isProcessing = true;

    try {
      const response = await fetch('http://localhost:5000/api/membresia/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('gym_auth_token')}`
        },
        body: JSON.stringify({
          planId: this.plan.id,
          paymentMethod: this.selectedMethod,
          paymentData: this.selectedMethod === 'card' ? this.paymentForm.value : {}
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al completar la compra.');
      }

      alert(`¡Pago exitoso! Tu membresía ${this.plan.nombre} ha sido activada.`);
      this.router.navigate(['/area-privada']);

    } catch (error) {
      this.errorMessage = `Error en el pago: ${
        error instanceof Error ? error.message : 'Problema de conexión.'
      }`;
    } finally {
      this.isProcessing = false;
    }
  }
}
