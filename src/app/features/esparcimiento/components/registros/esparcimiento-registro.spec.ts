import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsparcimientoRegistro } from './esparcimiento-registro';

describe('EsparcimientoRegistro', () => {
  let component: EsparcimientoRegistro;
  let fixture: ComponentFixture<EsparcimientoRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsparcimientoRegistro],
    }).compileComponents();

    fixture = TestBed.createComponent(EsparcimientoRegistro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
