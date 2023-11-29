import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimecapsuleViewComponent } from './timecapsule-view.component';

describe('TimecapsuleViewComponent', () => {
  let component: TimecapsuleViewComponent;
  let fixture: ComponentFixture<TimecapsuleViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimecapsuleViewComponent]
    });
    fixture = TestBed.createComponent(TimecapsuleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
