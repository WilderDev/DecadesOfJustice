import { Injectable } from '@angular/core';

import { NotifyPerson, Timecapsule } from './timecapsule.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class TimecapsuleService {
  //* ==================== Properties ====================
  timecapsulesChanged = new Subject<Timecapsule[]>();
  loadedTimecapsules: Timecapsule[] = [];
  FIREBASE_URL: string = 'https://memorybox-80ee9-default-rtdb.firebaseio.com';
  basePath = `/timecapsules`;

  //* ==================== Constructor ====================
  constructor(private http: HttpClient, private db: AngularFireDatabase) {}

  //* ==================== Methods ====================
  // Create timecapsule
  createTimecapsule = (
    userId: string,
    title: string,
    desc: string,
    timestamp: number,
    notifyPeople: NotifyPerson[]
  ) => {
    return new Timecapsule(userId, title, desc, timestamp, notifyPeople);
  };

  // Post Timecapsule
  // onPostTimecapsule = (timecapsule) => {
  //   this.http
  //     .post<Timecapsule>(
  //       `${this.FIREBASE_URL}${this.basePath}.json`,
  //       timecapsule
  //     )
  //     .subscribe(
  //       (res) => {
  //         //console.log(res);
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // };

  onPostTimecapsule(timecapsule: Timecapsule): void {
    this.db.list(this.basePath).push(timecapsule);
  }

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

  // Get entries in realtime database
  getAllEntries() {
    return this.db.object(this.basePath).valueChanges();
  }

  // Update timecapsule
  onUpdateTimecapsule = (uuid, newTimecapsule) => {
    let id;
    this.getAllEntries().subscribe((data) => {
      let entries = Object.entries(data);
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        if (entry[1].uuid === uuid) {
          id = entry[0].toString();
          this.db.list(this.basePath).update(id, newTimecapsule);
        }
      }
    });
  };

  // Delete timecapsule
  onDeleteTimecapsule = (uuid) => {
    let id;
    this.getAllEntries().subscribe((data) => {
      let entries = Object.entries(data);
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        if (entry[1].uuid === uuid) {
          id = entry[0].toString();
          this.db.list(this.basePath).remove(id);
        }
      }
    });
  };
}
