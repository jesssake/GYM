import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActividadesExtrasComponent } from './actividades-extras.component'; // 🚨 CORRECCIÓN: Usar el nombre de la clase con Component

describe('ActividadesExtrasComponent', () => { // 🚨 CORRECCIÓN: Usar el nombre de la clase con Component
  let component: ActividadesExtrasComponent;
  let fixture: ComponentFixture<ActividadesExtrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesExtrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
