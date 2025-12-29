import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePreviewCarousel } from './service-preview-carousel';

describe('ServicePreviewCarousel', () => {
  let component: ServicePreviewCarousel;
  let fixture: ComponentFixture<ServicePreviewCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePreviewCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePreviewCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
