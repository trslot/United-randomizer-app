import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Season1DcComponent } from './season1-dc.component';

describe('Season1DcComponent', () => {
  let component: Season1DcComponent;
  let fixture: ComponentFixture<Season1DcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Season1DcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Season1DcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
