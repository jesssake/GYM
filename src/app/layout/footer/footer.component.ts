import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer-section">
      <div class="footer-container">
        <div class="footer-column">
          <img src="assets/images/logo.jpg" alt="Logo del gimnasio" class="footer-logo">
          <p class="footer-text">
            Transforma tu cuerpo y tu mente para un éxito duradero.
          </p>
        </div>
        <div class="footer-column">
          <h3>Horarios</h3>
          <ul>
            <li>Lunes - Viernes: 6:00 am - 10:00 pm</li>
            <li>Sábados: 8:00 am - 6:00 pm</li>
            <li>Domingos: 10:00 am - 2:00 pm</li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>Contacto</h3>
          <ul>
            <li><i class="fas fa-map-marker-alt"></i> Dirección: Tenabo,Campeche,Calle 19 entre 6 Y 4</li>
            <li><i class="fas fa-phone"></i> Teléfono: (999) 123-4567</li>
            <li><i class="fas fa-envelope"></i> Email: GYMStation@gmail.com</li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>Síguenos</h3>
            <div class="social-icons">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 GYM Train Station. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.css'
})
export class FooterComponent { }
