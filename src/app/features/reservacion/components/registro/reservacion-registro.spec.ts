import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionRegistro } from './reservacion-registro';

describe('ReservacionRegistro', () => {
  let component: ReservacionRegistro;
  let fixture: ComponentFixture<ReservacionRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservacionRegistro],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservacionRegistro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
