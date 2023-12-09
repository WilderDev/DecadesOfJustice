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

  // currentFileUpload?: FileUpload;
  selectedFile?: FileList;
  public selectedFileList?: File[] | null = [];
  currentUploadQueue?: FileUpload[] | null = [];

  percentage = 0;
  public notifyPeople: NotifyPerson[] = [];
  showMsg: boolean = true;

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

  // Take all fields from form and create the timecapsule object and upload any files from selectedFiles array to firebse storage.
  onSubmit = () => {
    const { title, desc } = this.timecapsuleForm.form.value;

    let newTimeCapsule: Timecapsule = this.timecapsuleService.createTimecapsule(
      title,
      desc,
      this.getUNIXTimestamp(),
      this.notifyPeople
    );

    // Upload file list
    this.uploadCurrentQueue(newTimeCapsule.uuid);

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

    // Show message in template that form submission was successful
    this.showMsg = true;
    setTimeout(() => {
      // Show message for 3 secs.
      this.showMsg = false;
    }, 3000);

    // Reset form
    this.timecapsuleForm.resetForm();
  };

  // File imput change event assigns single file to selected file
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

  // Upload File list loops through each file in selectedFileList array and takes each item of the array (type File) and creates a new FileUpload which has properties needed for adding them to firebase storage.
  uploadCurrentQueue(parentUUID) {
    if (this.selectedFileList) {
      this.selectedFileList.forEach((f) => {
        let newFileUpload = new FileUpload(f);
        // Assign each fileUpload's parentUUID property in currentUploadQueue to have the uuid of the newly generated timecapsule
        newFileUpload.parentUUID = parentUUID;
        // Once the File is converted to FileUpload, we then can push it back into a new array called uploadQueue
        this.currentUploadQueue.push(newFileUpload);
        // We need to finally loop through uploadQueue and take each item and run pushFileToStorage() which uploads them to firebase storage and creates an reference entry in realtime db.
        this.currentUploadQueue.forEach((f) => {
          this.uploadService.pushFileToStorage(f).subscribe(
            (percentage) => {
              this.percentage = Math.round(percentage ? percentage : 0);
            },
            (error) => console.log(error)
          );
        });
      });
    }
  }

  // Deprecated:
  // Send file to firebase
  // upload(): void {
  //   if (this.selectedFile) {
  //     const file: File | null = this.selectedFile.item(0);
  //     this.selectedFile = undefined;
  //     if (file) {
  //       this.currentFileUpload = new FileUpload(file);
  //       this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
  //         (percentage) => {
  //           this.percentage = Math.round(percentage ? percentage : 0);
  //         },
  //         (error) => console.log(error)
  //       );
  //     }
  //   }
  // }

  // Todo: remove for production. for testing purposes only
  console() {
    console.log(this.selectedFileList);
  }
}
