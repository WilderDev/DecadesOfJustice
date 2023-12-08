import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimecapsuleService } from '../timecapsule.service';
import { Timecapsule } from '../timecapsule.model';
import { Observable, Subject, Subscription, timestamp } from 'rxjs';
import { interval } from 'rxjs';

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

// ! BG: properties for showing date
  test = true;

  curDate = new Date();
  second = 1000;
  minute = this.second * 60;
  hour = this.minute * 60;
  day = this.hour * 24;
  year = this.day * 365;

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

  //* BG: Checks to see if time is up yet
  isDateRight(timestamp) {
    const curDateTimestamp = new Date().getTime();
    const timeRemaining = timestamp - curDateTimestamp;
    if( timeRemaining <= 0) {
      return true;
    } else {
      return false;
    }
  }

  //* BG: Shows the remaining time for the capsule
  showRemaining(timestamp) {

    if(timestamp != null) {
    const setDate = new Date(timestamp).getTime();
    const distance = setDate - this.curDate.getTime();
    if (distance < 0) {

      return 'DONE';
  }

  const years = Math.floor( distance / this.year);
  const days = Math.floor((distance % this.year) / this.day);
  const hours = Math.floor((distance % this.day) / this.hour);
  const minutes = Math.floor((distance % this.hour) / this.minute);
  const seconds = Math.floor((distance % this.minute) / this.second);

  return `${years} Years ${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;

  } else {
    return 'NO TIME ENTERED'
  }

  }

  // timer(string){
  //    setInterval(() => {
  //     string;
  //   }, 1000)
  // }
}


