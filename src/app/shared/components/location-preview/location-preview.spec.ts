import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPreview } from './location-preview';

describe('LocationPreview', () => {
  let component: LocationPreview;
  let fixture: ComponentFixture<LocationPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
