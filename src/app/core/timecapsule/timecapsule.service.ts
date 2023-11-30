import { Injectable } from '@angular/core';

import { NotifyPerson, Timecapsule } from './timecapsule.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimecapsuleService {
  //* ==================== Properties ====================
  timecapsule: Timecapsule;
  loadedTimecapsules: Timecapsule[];
  FIREBASE_URL: string = 'https://memorybox-80ee9-default-rtdb.firebaseio.com';

  //* ==================== Constructor ====================
  constructor(private http: HttpClient) {}

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

    this.http
      .post<Timecapsule>(`${this.FIREBASE_URL}/posts.json`, this.timecapsule)
      .subscribe((res) => {
        console.log(res);
      });
  };

  // Read timecapsule
  onReadTimecapsule = () => {
    this.http
      .get<Timecapsule[]>(`${this.FIREBASE_URL}/posts.json`)
      .pipe(
        map((res) => {
          const timecapsules = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              timecapsules.push({ ...res[key], id: key });
            }
          }
          return timecapsules;
        })
      )
      .subscribe((timecapsules) => {
        this.loadedTimecapsules = timecapsules;
        console.log(timecapsules);
      });
  };

  // Update timecapsule
  onUpdateTimecapsule = () => {};

  // Delete timecapsule
  onDeleteTimecapsule = () => {};
}
