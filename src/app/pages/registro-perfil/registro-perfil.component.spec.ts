import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPerfil } from './registro-perfil.component';

describe('RegistroPerfil', () => {
  let component: RegistroPerfil;
  let fixture: ComponentFixture<RegistroPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPerfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPerfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
