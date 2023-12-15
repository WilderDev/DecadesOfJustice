import { Injectable } from '@angular/core';

import { NotifyPerson, Timecapsule } from './timecapsule.model';
import { Subject, map } from 'rxjs';
import { DbService } from 'src/app/shared/utils/db/db.service';
import { FsService } from 'src/app/shared/utils/fs/fs.service';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class TimecapsuleService {
  //* ==================== Properties ====================
  timecapsulesChanged = new Subject<Timecapsule[]>();
  timecapsulesUploadsChanged = new Subject();
  loadedTimecapsules: Timecapsule[] = [];
  FIREBASE_URL: string = 'https://memorybox-80ee9-default-rtdb.firebaseio.com';
  basePath = `/timecapsules`;

  // ! BG: timecapsule files
  timecapsuleUploads: any[] = [];

  //* ==================== Constructor ====================
  constructor(
    private dbUtil: DbService,
    private fs: FsService,
    private http: HttpClient,
    private db: AngularFireDatabase
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

  // * Get timecapsule uploads
  getTimecapsuleUploads() {
    return this.http.get(`${this.FIREBASE_URL}/uploads.json`).pipe(
      map((res) => {
        const uploads = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            uploads.push({ ...res[key], id: key });
          }
        }
        return uploads;
      })
    );
  }

  // Delete timecapsule
  onDeleteTimecapsule = (uuid: string) => {
    // delete timecapsule entry in /timecapsule
    // subscribe to the returned observable from /timecapsules
    this.dbUtil.getAllEntries('/timecapsules').subscribe((data) => {
      // take the data returned and create an array of entries (which is in itself an array)
      let entries = data;
      // loop through the arrays
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        // find the entry with a uuid property that matched the parameter
        if (entry.uuid === uuid) {
          // grab the key from the found entry
          const key = entry.key;
          // remove the entry using the found id
          this.dbUtil.deleteDbEntry(key, '/timecapsules');
        }
      }
    });

    //delete uploads entry in /uploads then delete upload in storage
    //subscribe to the returned observable from /uploads
    this.dbUtil.getAllEntries('/uploads').subscribe((data) => {
      // take the data returned and create an array of entries (which is in itself an array)
      let entries = data;
      // loop through the arrays
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        // find the entry with a parentUUID property that matches the parameter
        if (entry.parentUUID === uuid) {
          const key = entry.key; // grab the key from the found entry
          const fileNames: string[] = [];
          fileNames.push(entry.name); // grab the url from the found entry
          this.dbUtil.deleteDbEntry(key, '/uploads'); // remove the entry using the found id
          for (let name of fileNames) {
            this.fs.deleteFileStorage(name, '/uploads'); // Delete file from Firebase Storage /uploads
          }
        }
      }
    });
  };
}
