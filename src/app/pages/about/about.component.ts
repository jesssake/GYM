import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <-- CORRECCIÓN CLAVE: Importamos RouterLink para el botón CTA

// 1. Define un tipo para las claves válidas del objeto facilityDetails
type FacilityKey = 'pesas' | 'clases' | 'funcional';

@Component({
  selector: 'app-about',
  standalone: true,
  // CORRECCIÓN CLAVE: Agregamos RouterLink a los imports
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
    // 2. Usa el tipo de unión para activeFacility.
    // TypeScript ahora sabe que solo puede ser 'pesas', 'clases', 'funcional', o null.
    activeFacility: FacilityKey | null = null;
    activeTitle: string = '';

    // El tipo de este objeto se infiere correctamente: Record<FacilityKey, { ... }>
    facilityDetails = {
        'pesas': {
            title: 'Peso Libre e Integrado',
            description: 'Nuestra área de pesas cuenta con la maquinaria de última generación, mancuernas de hasta 150 libras y racks de sentadillas diseñados para entrenamientos de fuerza de alto rendimiento. ¡Tu zona ideal para construir músculo!',
            img: 'assets/images/instalacion-pesas.jpg'
        },
        'clases': {
            title: 'Salón de Clases',
            description: 'Un espacio amplio con iluminación dinámica y equipo de sonido profesional. Aquí impartimos clases de Zumba, Spinning, Yoga y HIIT. ¡Energía garantizada para todos los niveles!',
            img: 'assets/images/instalacion-clases.jpg'
        },
        'funcional': {
            title: 'Áreas Funcionales',
            description: 'Equipado con cuerdas, balones medicinales, kettlebells y zonas de entrenamiento de agilidad. Perfecto para mejorar tu resistencia, coordinación y movilidad en sesiones de grupo o individuales.',
            img: 'assets/images/instalacion-funcional.jpg'
        }
    };

    // 3. Modificamos la función openModal para tipar la clave de entrada
    openModal(key: FacilityKey) {
        if (this.activeFacility === key) {
            this.activeFacility = null;
        } else {
            this.activeFacility = key;
            this.activeTitle = this.facilityDetails[key].title;
        }
    }

    closeModal() {
        this.activeFacility = null;
    }
}
