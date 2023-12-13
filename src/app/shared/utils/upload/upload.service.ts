import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { AuthService } from 'src/app/shared/auth/auth.service';
import { FileUpload } from './file-upload.model';

import { DbService } from '../db/db.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  //* ==================== Constructor ====================
  constructor(
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

  // Upload File list loops through each file in selectedFileList array and takes each item of the array (type File) and creates a new FileUpload which has properties needed for adding them to firebase storage.
  uploadQueue(fileList: File[], parentUUID: string) {
    if (fileList) {
      fileList.forEach((f) => {
        let newFileUpload: FileUpload = new FileUpload(f);
        let uploadQueue: FileUpload[] = [];
        // Assign each fileUpload's parentUUID property in currentUploadQueue to have the uuid of the newly generated timecapsule
        newFileUpload.parentUUID = parentUUID;
        // Once the File is converted to FileUpload, we then can push it back into a new array called uploadQueue
        uploadQueue.push(newFileUpload);
        // We need to finally loop through uploadQueue and take each item and run pushFileToStorage() which uploads them to firebase storage and creates an reference entry in realtime db.
        uploadQueue.forEach((f) => {
          this.Upload(f).subscribe(
            (percentage) => {
              percentage = Math.round(percentage ? percentage : 0);
            },
            (error) => console.log(error)
          );
        });
      });
    }
  }
}
