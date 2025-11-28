import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecomendacionesComponent } from './recomendaciones.component'; // 🚨 CORRECCIÓN: Usar el nombre de la clase con Component

describe('RecomendacionesComponent', () => { // 🚨 CORRECCIÓN: Usar el nombre de la clase con Component
  let component: RecomendacionesComponent;
  let fixture: ComponentFixture<RecomendacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
