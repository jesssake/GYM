import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionContenidoComponent } from './gestion-contenido.component';

describe('GestionContenido', () => {
  let component: GestionContenidoComponent;
  let fixture: ComponentFixture<GestionContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionContenidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
