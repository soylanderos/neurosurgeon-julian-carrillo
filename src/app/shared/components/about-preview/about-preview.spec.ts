import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPreview } from './about-preview';

describe('AboutPreview', () => {
  let component: AboutPreview;
  let fixture: ComponentFixture<AboutPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
