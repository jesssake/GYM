import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionNotificaciones } from './gestion-notificaciones.component';

describe('GestionNotificaciones', () => {
  let component: GestionNotificaciones;
  let fixture: ComponentFixture<GestionNotificaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionNotificaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionNotificaciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
