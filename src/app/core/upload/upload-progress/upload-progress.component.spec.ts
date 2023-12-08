import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProgressComponent } from './upload-progress.component';

describe('UploadProgressComponent', () => {
  let component: UploadProgressComponent;
  let fixture: ComponentFixture<UploadProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadProgressComponent]
    });
    fixture = TestBed.createComponent(UploadProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
