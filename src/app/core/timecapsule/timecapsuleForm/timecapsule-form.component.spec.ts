import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimecapsuleFormComponent } from './timecapsule-form.component';

describe('TimecapsuleComponent', () => {
  let component: TimecapsuleFormComponent;
  let fixture: ComponentFixture<TimecapsuleFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimecapsuleFormComponent],
    });
    fixture = TestBed.createComponent(TimecapsuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
