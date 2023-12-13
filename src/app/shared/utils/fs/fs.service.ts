import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';
import { FileUpload } from '../upload/file-upload.model';
import { DbService } from '../db/db.service';

@Injectable({
  providedIn: 'root',
})
export class FsService {
  constructor(
    private storage: AngularFireStorage,
    private dbUtils: DbService
  ) {}

  //* Create
  // Creates entry in firebase storage

  // Delete upload from firebase storage
  deleteFileStorage(name: string, path: string): void {
    this.storage.ref(path).child(name).delete();
  }

  //* Delete
  // Delete database metadata for upload then delete file in firebase storage
  deleteFile(fileUpload: FileUpload): void {
    this.dbUtils
      .deleteDbEntry(fileUpload.key, '/uploads')
      .then(() => {
        this.deleteFileStorage(fileUpload.name, '/uploads');
      })
      .catch((error) => console.log(error));
  }
}
