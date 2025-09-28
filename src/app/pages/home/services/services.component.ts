import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de tener CommonModule si usas alguna directiva

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="services-section">
      <div class="services-container">
        <h2 class="section-title">Nuestros Servicios</h2>
        <div class="services-grid">
          <div class="service-item">
            <i class="fas fa-dumbbell"></i>
            <h3>Entrenamiento Personalizado</h3>
            <p>Programas de entrenamiento diseñados específicamente para tus objetivos y nivel de forma física.</p>
          </div>
          <div class="service-item">
            <i class="fas fa-running"></i>
            <h3>Clases de Grupo</h3>
            <p>Participa en nuestras clases de alta energía como Zumba, Spinning y Yoga para mantenerte motivado.</p>
          </div>
          <div class="service-item">
            <i class="fas fa-utensils"></i>
            <h3>Asesoría Nutricional</h3>
            <p>Planes de alimentación personalizados para complementar tu rutina de ejercicios y optimizar resultados.</p>
          </div>
          <div class="service-item">
            <i class="fas fa-heartbeat"></i>
            <h3>Cardio y Resistencia</h3>
            <p>Acceso a nuestra zona de cardio con la última tecnología en cintas, elípticas y bicicletas estáticas.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './services.component.css'
})
export class ServicesComponent {

}
