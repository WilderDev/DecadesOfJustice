import { Component, Input } from '@angular/core';
import { TimecapsuleService } from '../../timecapsule.service';
import { Timecapsule } from '../../timecapsule.model';
import { Observable, Subject, Subscription, timestamp } from 'rxjs';
import { interval } from 'rxjs';

@Component({
  selector: 'app-timecapsule-item',
  templateUrl: './timecapsule-item.component.html',
  styleUrls: ['./timecapsule-item.component.scss']
})
export class TimecapsuleItemComponent {
 //* ==================== Properties ===================
 isLoading: boolean = false;
 error: null;

 @Input() timecapsule;
 countdownSub: Subscription;
 timer = interval(1000);
 isTime = false;
 curDate = new Date();
 second = 1000;
 minute = this.second * 60;
 hour = this.minute * 60;
 day = this.hour * 24;
 month = this.day * 30.437;
 year = this.month * 12;
 countdown: String;

 //* ==================== Constructor ====================
 constructor(public timecapsuleService: TimecapsuleService) {}

 //* ==================== Lifecycle Hooks ====================

 // ? Updates the Date every second
 ngOnInit(): void {
  this.countdownSub = this.timer.subscribe(x => {
   this.countdown = this.showRemaining(new Date())
   this.isTime = this.isDateRight(new Date())
  })
 }

 ngOnDestroy(): void {
  this.countdownSub.unsubscribe();
 }


 //* ==================== Methods ====================
 // TODO: RE-WRITE THE DELETE METHOD
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

 // ? BG: Checks to see if timecapsule is ready to be opened
 isDateRight(curDate) {
   const curDateTimestamp = curDate.getTime();
   const timeRemaining = this.timecapsule.timestamp - curDateTimestamp;
   if( timeRemaining <= 0) {
     return true;
   } else {
     return false;
   }
 }

 // ? BG: Shows the remaining time for the capsule
 showRemaining(curDate) {
  const timestamp = this.timecapsule.timestamp
   if(timestamp != null) {
   const setDate = timestamp;
   const distance = setDate - curDate.getTime();
   if (distance <= 0) {
     return 'DONE';
 }

 const years = Math.floor(distance / this.year);
 const months = Math.floor ((distance % this.year) / this.month)
 const days = Math.floor((distance % this.month) / this.day)
 const hours = Math.floor((distance % this.day) / this.hour);
 const minutes = Math.floor((distance % this.hour) / this.minute);
 const seconds = Math.floor((distance % this.minute) / this.second);

 return `${years} Years ${months} Months ${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;

 } else {
   return 'NO TIME ENTERED'
 }
 }

}



