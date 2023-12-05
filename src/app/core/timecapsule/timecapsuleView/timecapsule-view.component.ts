import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimecapsuleService } from '../timecapsule.service';
import { Timecapsule } from '../timecapsule.model';
import { Subject, Subscription } from 'rxjs';

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

  //* ==================== Constructor ====================
  constructor(public timecapsuleService: TimecapsuleService) {}

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
    this.timecapsuleService.onFetchAllTimecapsules().subscribe(
      (timecapsules) => {
        this.isLoading = false;
        // console.log(timecapsules);
        this.timecapsuleService.timecapsulesChanged.next(timecapsules.slice());
      },
      (error) => {
        this.error = error.message;
        console.log(error);
      }
    );
  };

  deleteTimecapsule = (i) => {
    this.timecapsuleService
      .onDeleteTimecapsule(this.timecapsuleService.loadedTimecapsules[i].id)
      .subscribe(
        () => this.timecapsuleService.loadedTimecapsules.splice(i, 1),
        (error) => {
          this.error = error.message;
          console.log(error);
        }
      );
  };
}
