import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsparcimientoListado } from './esparcimiento-listado';

describe('EsparcimientoListado', () => {
  let component: EsparcimientoListado;
  let fixture: ComponentFixture<EsparcimientoListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsparcimientoListado],
    }).compileComponents();

    fixture = TestBed.createComponent(EsparcimientoListado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
