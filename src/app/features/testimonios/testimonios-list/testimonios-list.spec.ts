import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestiomoniosList } from './testimonios-list';

describe('TestiomoniosList', () => {
  let component: TestiomoniosList;
  let fixture: ComponentFixture<TestiomoniosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestiomoniosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestiomoniosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
