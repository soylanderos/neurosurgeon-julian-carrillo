import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosIndex } from './servicios-list';

describe('ServiciosIndex', () => {
  let component: ServiciosIndex;
  let fixture: ComponentFixture<ServiciosIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
