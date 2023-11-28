import { TestBed } from '@angular/core/testing';

import { TimecapsuleService } from './timecapsule.service';

describe('TimecapsuleService', () => {
  let service: TimecapsuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimecapsuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
