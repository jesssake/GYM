import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestablecerSolicitudComponent } from './restablecer-solicitud.component';

describe('RestablecerSolicitud', () => {
  let component: RestablecerSolicitudComponent;
  let fixture: ComponentFixture<RestablecerSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestablecerSolicitudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestablecerSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
