import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Season1Component } from './season1.component';

describe('Season1Component', () => {
  let component: Season1Component;
  let fixture: ComponentFixture<Season1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Season1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Season1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
