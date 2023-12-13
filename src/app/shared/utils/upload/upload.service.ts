import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { AuthService } from 'src/app/shared/auth/auth.service';
import { FileUpload } from './file-upload.model';
import { FsService } from '../fs/fs.service';
import { DbService } from '../db/db.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  //* ==================== Properties ====================
  private basePath = '/uploads';

  //* ==================== Constructor ====================
  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private dbUtils: DbService,
    private authService: AuthService
  ) {}

  //* ==================== Methods ====================
  Upload(fileUpload: FileUpload): Observable<number | undefined> {
    const filePath = `/uploads/${fileUpload.file.name}`; // path used to store upload
    const storageRef = this.storage.ref(filePath); // filepath of where metadata is stored in fire realtime database
    const uploadTask = this.storage.upload(filePath, fileUpload.file); // observable of the upload event
    let userId: string;
    this.authService.currentUser.subscribe((user) => {
      userId = user.id;
    });
    uploadTask
      .snapshotChanges() // returns observable with metadata of the upload as they change (bytes transferred, metadata, ref, state, task, totalbytes)
      .pipe(
        finalize(() => {
          // returns observable which mirrors source observable but calls function when source terminates on complete or error
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            // Fetches metadata for the object at this location, if one exists.
            fileUpload.authorID = userId;
            fileUpload.url = downloadURL; // saves metadata url
            fileUpload.name = fileUpload.file.name; // saves metadata file.name
            this.dbUtils.saveDbEntry(fileUpload, '/uploads');
          });
        })
      )
      .subscribe();
    return uploadTask.percentageChanges(); // returns an observable of the upload progress percentage
  }
}
