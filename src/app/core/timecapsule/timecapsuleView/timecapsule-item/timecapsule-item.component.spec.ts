import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimecapsuleItemComponent } from './timecapsule-item.component';

describe('TimecapsuleItemComponent', () => {
  let component: TimecapsuleItemComponent;
  let fixture: ComponentFixture<TimecapsuleItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimecapsuleItemComponent]
    });
    fixture = TestBed.createComponent(TimecapsuleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
