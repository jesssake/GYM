import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestablecerSolicitud } from './restablecer-solicitud.component';

describe('RestablecerSolicitud', () => {
  let component: RestablecerSolicitud;
  let fixture: ComponentFixture<RestablecerSolicitud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestablecerSolicitud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestablecerSolicitud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
