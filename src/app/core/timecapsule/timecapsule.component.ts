import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NotifyPerson, Address } from './notifyPerson.model';
import { TimecapsuleService } from './timecapsule.service';

@Component({
  selector: 'app-timecapsule',
  templateUrl: './timecapsule.component.html',
  styleUrls: ['./timecapsule.component.scss'],
})
export class TimecapsuleComponent {
  //* ==================== Properties ====================
  @ViewChild('timecapsuleForm') timecapsuleForm: NgForm;
  public notifyPeople: NotifyPerson[] = [];

  //* ==================== Constructor ====================
  constructor(private timecapsuleService: TimecapsuleService) {}

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
  };

  // Remove person from notifyPeople array
  removePerson = (i): void => {
    this.notifyPeople.splice(i, 1);
  };

  // Submit form
  onSubmit = () => {
    this.timecapsuleService.onCreateTimecapsule(
      this.timecapsuleForm.form.value.title,
      this.timecapsuleForm.form.value.desc,
      this.timecapsuleForm.form.value.url,
      this.timecapsuleForm.form.value.date,
      this.notifyPeople
    );
    console.log(this.timecapsuleService.timecapsule);
  };
}
