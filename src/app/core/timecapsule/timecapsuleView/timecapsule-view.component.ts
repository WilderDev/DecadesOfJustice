import { Component, OnInit } from '@angular/core';
import { TimecapsuleService } from '../timecapsule.service';
import { Timecapsule } from '../timecapsule.model';

@Component({
  selector: 'app-timecapsule-view',
  templateUrl: './timecapsule-view.component.html',
  styleUrls: ['./timecapsule-view.component.scss'],
})
export class TimecapsuleViewComponent implements OnInit {
  //* ==================== Properties ====================

  //* ==================== Constructor ====================
  constructor(public timecapsuleService: TimecapsuleService) {}

  //* ==================== Lifecycle Hooks ====================
  ngOnInit(): void {
    this.timecapsuleService.onReadTimecapsule();
  }

  //* ==================== Methods ====================
}
