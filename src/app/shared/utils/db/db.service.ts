import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FileUpload } from '../upload/file-upload.model';
import { Timecapsule } from 'src/app/core/timecapsule/timecapsule.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private db: AngularFireDatabase) {}

  updateFileDatabase(key: string, path: string) {}

  // Get entries in realtime database - returns a observable object represending the stored db
  getAllEntries(path: string): Observable<any[]> {
    return this.db
      .list(path)
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => {
            const key = c.payload.key;
            const data = c.payload.val() as Record<string, any>;
            return { key, ...data };
          });
        })
      );
  }

  // Create reference of storage name and location
  saveFileData(fileUpload: FileUpload | Timecapsule, path: string): void {
    this.db.list(path).push(fileUpload);
    // this is the method that takes the fileUpload object (name and url) and puts them into the realtime db at the location specified by this.basePath
  }

  // Delete metadata for upload from database
  deleteFileDatabase(key: string, path): Promise<void> {
    return this.db.list(path).remove(key);
  }
}
