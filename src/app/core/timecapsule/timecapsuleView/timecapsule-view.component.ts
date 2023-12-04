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
  loadedTimecapsules: Timecapsule[];

  //* ==================== Constructor ====================
  constructor(public timecapsuleService: TimecapsuleService) {}

  //* ==================== Lifecycle Hooks ====================
  ngOnInit(): void {
    this.timecapsuleService.onFetchTimecapsule().subscribe((timecapsules) => {
      this.loadedTimecapsules = timecapsules;
      //console.log(timecapsules);
    });
  }

  //* ==================== Methods ====================

  deleteTimecapsule = (i) => {
    this.timecapsuleService
      .onDeleteTimecapsule(this.loadedTimecapsules[i].id)
      .subscribe(() => this.loadedTimecapsules.splice(i, 1));
  };
}
