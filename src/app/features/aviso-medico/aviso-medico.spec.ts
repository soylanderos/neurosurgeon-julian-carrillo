import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoMedico } from './aviso-medico';

describe('AvisoMedico', () => {
  let component: AvisoMedico;
  let fixture: ComponentFixture<AvisoMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisoMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisoMedico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
