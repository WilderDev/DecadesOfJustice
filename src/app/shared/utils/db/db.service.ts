import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  DatabaseSnapshot,
} from '@angular/fire/compat/database';
import { FileUpload } from '../upload/file-upload.model';
import { Timecapsule } from 'src/app/core/timecapsule/timecapsule.model';
import { Observable, map } from 'rxjs';
import { FsService } from '../fs/fs.service';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(
    private db: AngularFireDatabase,
    private dbUtils: DbService,
    private fs: FsService
  ) {}

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
  saveDbEntry(fileUpload: FileUpload | Timecapsule, path: string): void {
    this.db.list(path).push(fileUpload);
    // this is the method that takes the fileUpload object (name and url) and puts them into the realtime db at the location specified by this.basePath
  }

  // Delete metadata for upload from database
  deleteDbEntry(key: string, path): Promise<void> {
    return this.db.list(path).remove(key);
  }

  //* Read
  getFiles(numberItems: number, path): AngularFireList<FileUpload> {
    return this.db.list(path, (ref) => ref.limitToLast(numberItems));
  }
}
