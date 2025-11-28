import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestablecerConfirmarComponent } from './restablecer-confirmar.component';

describe('RestablecerConfirmar', () => {
  let component: RestablecerConfirmarComponent;
  let fixture: ComponentFixture<RestablecerConfirmarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestablecerConfirmarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestablecerConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
