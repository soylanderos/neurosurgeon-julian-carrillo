import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsPreview } from './testimonials-preview';

describe('TestimonialsPreview', () => {
  let component: TestimonialsPreview;
  let fixture: ComponentFixture<TestimonialsPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialsPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
