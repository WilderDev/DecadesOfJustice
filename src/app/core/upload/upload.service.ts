import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { FileUpload } from './file-upload.model';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  //* ==================== Properties ====================
  private basePath = '/uploads';

  //* ==================== Constructor ====================
  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  //* ==================== Methods ====================
  //* Create
  // Creates entry in firebase storage
  pushFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`; // path used to store upload
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
            console.log(fileUpload); //todo: remove for production.
            this.saveFileData(fileUpload);
            // right now it creates an entry in realtime db /uploads with name and url properties
            // needs to be added into the timecapsule entry with the associated timecapsule info
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges(); // returns an observable of the upload progress percentage
  }

  // Create reference of storage name and location
  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
    // this is the method that takes the fileUpload object (name and url) and puts them into the realtime db at the location specified by this.basePath
  }

  //* Read
  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, (ref) => ref.limitToLast(numberItems));
  }

  //* Delete
  // Delete database metadata for upload then delete file in firebase storage
  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch((error) => console.log(error));
  }

  // Delete metadata for upload from database
  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  // Delete upload from firebase storage
  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}
