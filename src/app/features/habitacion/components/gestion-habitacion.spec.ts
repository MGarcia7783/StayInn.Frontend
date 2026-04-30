import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionHabitacion } from './gestion-habitacion';

describe('GestionHabitacion', () => {
  let component: GestionHabitacion;
  let fixture: ComponentFixture<GestionHabitacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionHabitacion],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionHabitacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
