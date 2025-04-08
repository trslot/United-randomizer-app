import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Season2Component } from './season2.component';

describe('Season2Component', () => {
  let component: Season2Component;
  let fixture: ComponentFixture<Season2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Season2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Season2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
