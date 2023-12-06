import { Injectable } from '@angular/core';

import { NotifyPerson, Timecapsule } from './timecapsule.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimecapsuleService {
  //* ==================== Properties ====================
  timecapsulesChanged = new Subject<Timecapsule[]>();
  loadedTimecapsules: Timecapsule[] = [];
  FIREBASE_URL: string = 'https://memorybox-80ee9-default-rtdb.firebaseio.com';
  basePath = '/timecapsules';

  //* ==================== Constructor ====================
  constructor(private http: HttpClient) {}

  //* ==================== Methods ====================
  // Create timecapsule
  createTimecapsule = (
    title: string,
    desc: string,
    url: string,
    timestamp: number,
    notifyPeople: NotifyPerson[]
  ) => {
    return new Timecapsule(title, desc, url, timestamp, notifyPeople);
  };

  // Post Timecapsule
  onPostTimecapsule = (timecapsule) => {
    this.http
      .post<Timecapsule>(
        `${this.FIREBASE_URL}${this.basePath}.json`,
        timecapsule
      )
      .subscribe(
        (res) => {
          //console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  // Read timecapsule
  onFetchAllTimecapsules = () => {
    return this.http
      .get<Timecapsule[]>(`${this.FIREBASE_URL}${this.basePath}.json`)
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
      );
  };

  // Update timecapsule
  onUpdateTimecapsule = (id) => {};

  // Delete timecapsule
  onDeleteTimecapsule = (id) => {
    return this.http.delete(`${this.FIREBASE_URL}${this.basePath}/${id}.json`);
  };
}
