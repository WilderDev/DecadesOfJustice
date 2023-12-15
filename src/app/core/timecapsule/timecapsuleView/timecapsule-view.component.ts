import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { TimecapsuleService } from '../timecapsule.service';
import { Subscription } from 'rxjs';
import { DbService } from 'src/app/shared/utils/db/db.service';

@Component({
  selector: 'app-timecapsule-view',
  templateUrl: './timecapsule-view.component.html',
  styleUrls: ['./timecapsule-view.component.scss'],
})
export class TimecapsuleViewComponent implements OnInit, OnDestroy {
  //* ==================== Properties ===================
  timecapsulesChangedSub: Subscription;
  isLoading: boolean = false;
  error: null;
  @Output() timecasule;

  //* ==================== Constructor ====================
  constructor(
    public timecapsuleService: TimecapsuleService,
    private dbUtils: DbService
  ) {}

  //* ==================== Lifecycle Hooks ====================
  ngOnInit(): void {
    this.fetchTimecapsules();
    this.timecapsulesChangedSub =
      this.timecapsuleService.timecapsulesChanged.subscribe(
        (updatedTimecapsulesList) => {
          this.timecapsuleService.loadedTimecapsules = updatedTimecapsulesList;
        }
      );
  }

  ngOnDestroy(): void {
    this.timecapsulesChangedSub.unsubscribe();
  }

  //* ==================== Methods ====================
  fetchTimecapsules = () => {
    this.isLoading = true;
    this.dbUtils.getAllEntries('/timecapsules').subscribe(
      (timecapsules) => {
        this.isLoading = false;
        this.timecapsuleService.timecapsulesChanged.next(timecapsules.slice());
      },
      (error) => {
        this.error = error.message;
        console.log(error);
      }
    );
  };

  deleteTimecapsule(i) {
    this.timecapsuleService.onDeleteTimecapsule(
      this.timecapsuleService.loadedTimecapsules[i].uuid
    );
    this.timecapsuleService.loadedTimecapsules.splice(i, 1);
  }
}
