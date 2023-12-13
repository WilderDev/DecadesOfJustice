import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor() {}

  // Get future date and format it for form
  getYearFromNow = () => {
    const dateNotFormatted = new Date(Date.now() + 31556926000);
    let dateString = dateNotFormatted.getFullYear() + '-';
    if (dateNotFormatted.getMonth() < 9) {
      dateString += '0';
    }
    dateString += dateNotFormatted.getMonth() + 1;
    dateString += '-';
    if (dateNotFormatted.getDate() < 10) {
      dateString += '0';
    }
    dateString += dateNotFormatted.getDate();
    return dateString;
  };

  // Change date format
  getUNIXTimestamp = (timeFromForm): number => {
    return Date.parse(timeFromForm);
  };
}
