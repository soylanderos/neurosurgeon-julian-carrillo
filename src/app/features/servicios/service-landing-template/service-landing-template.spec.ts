import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLandingTemplate } from './service-landing-template';

describe('ServiceLandingTemplate', () => {
  let component: ServiceLandingTemplate;
  let fixture: ComponentFixture<ServiceLandingTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceLandingTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceLandingTemplate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
