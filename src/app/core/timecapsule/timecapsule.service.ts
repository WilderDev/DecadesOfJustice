import { Injectable } from '@angular/core';

import { Timecapsule } from './timecapsule.model';
import { NotifyPerson } from './notifyPerson.model';

@Injectable({
  providedIn: 'root',
})
export class TimecapsuleService {
  //* ==================== Properties ====================
  timecapsule: Timecapsule;

  //* ==================== Constructor ====================
  constructor() {}

  //* ==================== Methods ====================
  // Create timecapsule
  onCreateTimecapsule = (
    title: string,
    desc: string,
    url: string,
    timestamp: number,
    notifyPeople: NotifyPerson[]
  ) => {
    this.timecapsule = new Timecapsule(
      title,
      desc,
      url,
      timestamp,
      notifyPeople
    );
  };

  // Read timecapsule
  onReadTimecapsule = () => {};

  // Update timecapsule
  onUpdateTimecapsule = () => {};

  // Delete timecapsule
  onDeleteTimecapsule = () => {};
}
