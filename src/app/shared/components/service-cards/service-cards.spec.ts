import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCards } from './service-cards';

describe('ServiceCards', () => {
  let component: ServiceCards;
  let fixture: ComponentFixture<ServiceCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
