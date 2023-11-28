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
  title: string = '';
  desc: string = '';
  url: string = '';

  year: number = 0;
  month: number = 0;
  day: number = 0;
  date: Date = new Date(this.year, this.month, this.day);

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  address: Address = {
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: 0,
  };

  public notifyPeople: NotifyPerson[] = [];

  //* ==================== Constructor ====================
  constructor(private timecapsuleService: TimecapsuleService) {}

  //* ==================== Methods ====================
  // Create date => used for the onCreateTimecapsule method in timecapsule service
  createDate = (year, month, day) => {
    return new Date(year, month, day);
  };

  // Create address object => used for the addPerson method
  createAddressObj = (): Address => {
    this.address.street = this.timecapsuleForm.form.value.street;
    this.address.city = this.timecapsuleForm.form.value.city;
    this.address.state = this.timecapsuleForm.form.value.state;
    this.address.zipCode = this.timecapsuleForm.form.value.zip;
    this.address.apartment = this.timecapsuleForm.form.value.apt;

    console.log(this.address);
    return this.address;
  };

  // Add person to notify people array
  addPerson = (): void => {
    this.firstName = this.timecapsuleForm.form.value.fName;
    this.lastName = this.timecapsuleForm.form.value.lName;
    this.email = this.timecapsuleForm.form.value.email;
    this.phone = this.timecapsuleForm.form.value.phone;

    let notifyPerson: NotifyPerson = new NotifyPerson(
      this.firstName,
      this.lastName,
      this.email,
      this.createAddressObj(),
      this.phone
    );

    this.notifyPeople.push(notifyPerson);
    console.log(this.notifyPeople);
  };

  // Remove person from notifyPeople array
  removePerson = (i): void => {
    this.notifyPeople.splice(i, 1);
  };

  // Submit form
  onSubmit = () => {
    this.timecapsuleService.onCreateTimecapsule(
      this.title,
      this.desc,
      this.url,
      this.createDate(this.year, this.month, this.day),
      this.notifyPeople
    );
    console.log(this.timecapsuleService.timecapsule);
  };
}
