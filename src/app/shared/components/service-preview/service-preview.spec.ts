import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePreview } from './service-preview';

describe('ServicePreview', () => {
  let component: ServicePreview;
  let fixture: ComponentFixture<ServicePreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
