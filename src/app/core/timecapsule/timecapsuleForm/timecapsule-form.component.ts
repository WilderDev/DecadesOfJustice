import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Address, NotifyPerson, Timecapsule } from '../timecapsule.model';
import { TimecapsuleService } from '../timecapsule.service';
import { UploadService } from '../../upload/upload.service';
import { FileUpload } from '../../upload/file-upload.model';
@Component({
  selector: 'app-timecapsule-form',
  templateUrl: './timecapsule-form.component.html',
  styleUrls: ['./timecapsule-form.component.scss'],
})
export class TimecapsuleFormComponent {
  //* ==================== Properties ====================
  @ViewChild('timecapsuleForm') timecapsuleForm: NgForm;
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  public notifyPeople: NotifyPerson[] = [];
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

  //* ==================== Constructor ====================
  constructor(
    private timecapsuleService: TimecapsuleService,
    private uploadService: UploadService
  ) {}

  //* ==================== Methods ====================
  // Get future date and format it for form
  getYearFromNow = () => {
    const dateNotFormatted = new Date(Date.now() + 31556926000);
    let dateString = dateNotFormatted.getFullYear() + '-';
    if (dateNotFormatted.getMonth() < 9) {
      dateString += '0';
    }
    dateString += dateNotFormatted.getMonth() + 1;
    dateString += '-';
    if (dateNotFormatted.getDate() < 10) {
      dateString += '0';
    }
    dateString += dateNotFormatted.getDate();
    return dateString;
  };

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
    this.timecapsuleForm.resetForm();
  };

  // Remove person from notifyPeople array
  removePerson = (i): void => {
    this.notifyPeople.splice(i, 1);
  };

  // Change date format
  getUNIXTimestamp = (): number => {
    return Date.parse(this.timecapsuleForm.form.value.date);
  };

  onSubmit = () => {
    const { title, desc, url } = this.timecapsuleForm.form.value;

    let newTimeCapsule: Timecapsule = this.timecapsuleService.createTimecapsule(
      title,
      desc,
      url,
      this.getUNIXTimestamp(),
      this.notifyPeople
    );

    // Add New Timecapsule to Firebase
    this.timecapsuleService.onPostTimecapsule(newTimeCapsule);

    // Add New Timecapsule to loadedTimecapsules (in timecapsule.service.ts)
    let newTimecapsuleList: Timecapsule[] =
      this.timecapsuleService.loadedTimecapsules;
    newTimecapsuleList.push(newTimeCapsule);

    // Update loadedTimecapsules in timecapsule.service.ts
    this.timecapsuleService.timecapsulesChanged.next(
      newTimecapsuleList.slice()
    );

    this.showMsg = true;
    setTimeout(() => {
      this.showMsg = false;
    }, 3000);
    this.timecapsuleForm.resetForm();
  };

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
          (percentage) => {
            this.percentage = Math.round(percentage ? percentage : 0);
          },
          (error) => console.log(error)
        );
      }
    }
  }
}
