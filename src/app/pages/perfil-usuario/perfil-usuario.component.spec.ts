import { ComponentFixture, TestBed } from '@angular/core/testing';

// 🚨 CORRECCIÓN 1: La clase se llama PerfilUsuarioComponent
import { PerfilUsuarioComponent } from './perfil-usuario.component';

// 🚨 CORRECCIÓN 2: El 'describe' también debe usar el nombre correcto
describe('PerfilUsuarioComponent', () => {
  let component: PerfilUsuarioComponent;
  let fixture: ComponentFixture<PerfilUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Asegurarse de que el componente independiente se importe correctamente
      imports: [PerfilUsuarioComponent]
    })
    .compileComponents();

    // Usar el nombre de la clase corregido
    fixture = TestBed.createComponent(PerfilUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
