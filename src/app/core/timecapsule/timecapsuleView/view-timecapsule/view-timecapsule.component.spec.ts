import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTimecapsuleComponent } from './view-timecapsule.component';

describe('ViewTimecapsuleComponent', () => {
  let component: ViewTimecapsuleComponent;
  let fixture: ComponentFixture<ViewTimecapsuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTimecapsuleComponent]
    });
    fixture = TestBed.createComponent(ViewTimecapsuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
