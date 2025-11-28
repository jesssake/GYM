import { ComponentFixture, TestBed } from '@angular/core/testing';
// 🚨 CORRECCIÓN: Usar el nombre de la clase con Component
import { DashboardClienteComponent } from './dashboard-cliente.component';

describe('DashboardClienteComponent', () => { // 🚨 CORRECCIÓN: Usar el nombre de la clase con Component
  let component: DashboardClienteComponent;
  let fixture: ComponentFixture<DashboardClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Usar el nombre de la clase con Component
      imports: [DashboardClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
