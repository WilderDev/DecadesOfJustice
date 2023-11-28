import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimecapsuleComponent } from './timecapsule.component';

describe('TimecapsuleComponent', () => {
  let component: TimecapsuleComponent;
  let fixture: ComponentFixture<TimecapsuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimecapsuleComponent]
    });
    fixture = TestBed.createComponent(TimecapsuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
