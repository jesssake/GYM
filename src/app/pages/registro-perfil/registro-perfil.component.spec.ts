import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPerfilComponent } from './registro-perfil.component';

describe('RegistroPerfil', () => {
  let component: RegistroPerfilComponent;
  let fixture: ComponentFixture<RegistroPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
