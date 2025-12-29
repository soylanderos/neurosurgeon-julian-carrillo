import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustStrip } from './trust-strip';

describe('TrustStrip', () => {
  let component: TrustStrip;
  let fixture: ComponentFixture<TrustStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustStrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustStrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
