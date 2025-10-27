import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesExtras } from './actividades-extras.component';

describe('ActividadesExtras', () => {
  let component: ActividadesExtras;
  let fixture: ComponentFixture<ActividadesExtras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesExtras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesExtras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
