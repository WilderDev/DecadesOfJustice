import { Injectable } from '@angular/core';

import { NotifyPerson, Timecapsule } from './timecapsule.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class TimecapsuleService {
  //* ==================== Properties ====================
  timecapsulesChanged = new Subject<Timecapsule[]>();
  loadedTimecapsules: Timecapsule[] = [];
  FIREBASE_URL: string = 'https://memorybox-80ee9-default-rtdb.firebaseio.com';
  basePathTimecapsules = `/timecapsules`;
  basePathUploads = `/uploads`;

  //* ==================== Constructor ====================
  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

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
    this.db.list(this.basePathTimecapsules).push(timecapsule);
  }

  // Read timecapsule
  onFetchAllTimecapsules = () => {
    return this.http
      .get<Timecapsule[]>(
        `${this.FIREBASE_URL}${this.basePathTimecapsules}.json`
      )
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

  // Get entries in realtime database - returns a observable object represending the stored db
  getAllEntries(path) {
    return this.db.object(path).valueChanges();
  }

  /*
  // Update timecapsule
  onUpdateTimecapsule = (uuid, newTimecapsule) => {
    let id: string;

    // subscribe to the returned observable
    this.getAllEntries(this.basePathTimecapsules).subscribe((data) => {
      // take the data returned and create an array of entries (which is in itself an array)
      let entries = Object.entries(data);

      // loop through the arrays
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];

        // find the entry with a uuid property that matched the parameter
        if (entry[1].uuid === uuid) {
          // grab the id from the found entry
          id = entry[0];

          // update the entry using the found id
          this.db.list(this.basePathTimecapsules).update(id, newTimecapsule);
        }
      }
    });
  };
*/

  // Delete timecapsule
  onDeleteTimecapsule = (uuid) => {
    let id: string;

    // subscribe to the returned observable from /timecapsules
    this.getAllEntries(this.basePathTimecapsules).subscribe((data) => {
      if (data === null) {
        return;
      }
      // take the data returned and create an array of entries (which is in itself an array)

      let entries = Object.entries(data);

      // loop through the arrays
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];

        // find the entry with a uuid property that matched the parameter
        if (entry[1].uuid === uuid) {
          // grab the id from the found entry
          id = entry[0];

          // remove the entry using the found id
          this.db.list(this.basePathTimecapsules).remove(id);
        }
      }
    });

    //subscribe to the returned observable from /uploads
    this.getAllEntries(this.basePathUploads).subscribe((data) => {
      if (data === null) {
        return;
      }

      // take the data returned and create an array of entries (which is in itself an array)
      let entries = Object.entries(data);

      // loop through the arrays
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];

        // find the entry with a parentUUID property that matches the parameter
        if (entry[1].parentUUID === uuid) {
          // grab the id from the found entry
          id = entry[0];

          // grab the url from the found entry
          const fileNames: string[] = [];
          fileNames.push(entry[1].name);

          // remove the entry using the found id
          this.db.list(this.basePathUploads).remove(id);

          // Delete file from Firebase Storage /uploads
          for (let name of fileNames) {
            this.storage.ref(this.basePathUploads).child(name).delete();
          }
        }
      }
    });
  };
}
