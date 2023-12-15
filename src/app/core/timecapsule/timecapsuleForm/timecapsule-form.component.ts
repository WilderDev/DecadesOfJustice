import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Address, NotifyPerson, Timecapsule } from '../timecapsule.model';
import { TimecapsuleService } from '../timecapsule.service';
import { UploadService } from '../../../shared/utils/upload/upload.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { DbService } from 'src/app/shared/utils/db/db.service';
import { TimeService } from 'src/app/shared/utils/time/time.service';

@Component({
  selector: 'app-timecapsule-form',
  templateUrl: './timecapsule-form.component.html',
  styleUrls: ['./timecapsule-form.component.scss'],
})
export class TimecapsuleFormComponent {
  //* ==================== Properties ====================
  @ViewChild('timecapsuleForm') timecapsuleForm: NgForm;

  // currentFileUpload?: FileUpload;
  selectedFile?: FileList;
  public selectedFileList?: File[] | null = [];

  public notifyPeople: NotifyPerson[] = [];

  // Form placeholder text
  defaultFirstName: string = 'John';
  defaultLastName: string = 'Doe';
  defaultPhone: string = '312-555-5556';
  defaultEmail: string = 'john@gmail.com';
  defaultStreet: string = '235 Main St';
  defaultApt: string = 'Apt 3';
  defaultCity: string = 'Chicago';
  defaultState: string = 'IL';
  defaultZip: number = 60131;
  defaultTitle: string = 'A Catchy Title';
  defaultDesc: string =
    'Details about the moment that you would like to put in the Memory Box.';
  defaultUrl: string = 'Link';
  defaultTime: string = '00:00';
  showMsg: boolean = true;
  submitSuccess: boolean = false;
  currentPage: number = 1;

  //* ==================== Constructor ====================
  constructor(
    private authService: AuthService,
    private timecapsuleService: TimecapsuleService,
    private dbUtils: DbService,
    public timeUtils: TimeService,
    private uploadService: UploadService
  ) {}

  //* ==================== Methods ====================

  // Create address object => used for the addPerson method
  createAddressObj = (): Address => {
    return new Address(
      this.timecapsuleForm.form.value.street,
      this.timecapsuleForm.form.value.city,
      this.timecapsuleForm.form.value.state,
      this.timecapsuleForm.form.value.zip,
      this.timecapsuleForm.form.value.apt
    );
  };

  // Add person to notify people array
  addPerson = (): void => {
    let notifyPerson: NotifyPerson = new NotifyPerson(
      this.timecapsuleForm.form.value.fName,
      this.timecapsuleForm.form.value.lName,
      this.timecapsuleForm.form.value.email,
      this.createAddressObj(),
      this.timecapsuleForm.form.value.phone
    );
    this.notifyPeople.push(notifyPerson);
    this.timecapsuleForm.reset(this.addPerson);
  };

  // Remove person from notifyPeople array
  removePerson = (i): void => {
    this.notifyPeople.splice(i, 1);
  };

  // Take all fields from form and create the timecapsule object and upload any files from selectedFiles array to firebse storage.
  onSubmit = () => {
    const { title, desc, date } = this.timecapsuleForm.form.value;
    let userId: string;
    let newTimeCapsule: Timecapsule;
    this.authService.currentUser.subscribe((user) => {
      userId = user.id;
      newTimeCapsule = this.timecapsuleService.createTimecapsule(
        userId,
        title,
        desc,
        this.timeUtils.getUNIXTimestamp(date),
        this.notifyPeople
      );
    });
    this.uploadService.uploadQueue(this.selectedFileList, newTimeCapsule.uuid); // Upload file list
    this.dbUtils.saveDbEntry(newTimeCapsule, '/timecapsules'); // Add New Timecapsule to Firebase
    let newTimecapsuleList: Timecapsule[] =
      this.timecapsuleService.loadedTimecapsules; // Add New Timecapsule to loadedTimecapsules (in timecapsule.service.ts)
    newTimecapsuleList.push(newTimeCapsule);
    this.timecapsuleService.timecapsulesChanged.next(
      newTimecapsuleList.slice() // Update loadedTimecapsules in timecapsule.service.ts
    );
    this.submitSuccess = true;
    setTimeout(() => {
      this.submitSuccess = false;
    }, 3000);
    this.timecapsuleForm.resetForm(); // Reset form
  };

  // File input on form has a change event which assigns a single file as selectedFile
  selectFile(event: any): void {
    this.selectedFile = event.target.files;
  }

  // Add file button click listener adds selected file to array from the and clears selected file for next file input
  addSelectedFile(): void {
    if (this.selectedFile) {
      this.selectedFileList.push(this.selectedFile.item(0)); // By default, the form input of type file returns a value of FileList which is an array with only 1 item. We first need to remove the file from the array.
      this.selectedFile = undefined;
    }
  }

  nextPage(): void {
    this.currentPage = this.currentPage + 1;
  }

  prevPage(): void {
    this.currentPage = this.currentPage - 1;
  }
}
