import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionHotel } from './gestion-hotel';

describe('GestionHotel', () => {
  let component: GestionHotel;
  let fixture: ComponentFixture<GestionHotel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionHotel],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionHotel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
