import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Season3Component } from './season3.component';

describe('Season3Component', () => {
  let component: Season3Component;
  let fixture: ComponentFixture<Season3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Season3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Season3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
