import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component'; // ¡Ruta actualizada!
import { HeroComponent } from './hero/hero.component';
import { ServicesComponent } from './services/services.component';
import { FooterComponent } from '../../layout/footer/footer.component'; // ¡Ruta actualizada!

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, HeroComponent, ServicesComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
