import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NotifyPerson, Address } from './notifyPerson.model';

@Component({
  selector: 'app-timecapsule',
  templateUrl: './timecapsule.component.html',
  styleUrls: ['./timecapsule.component.scss'],
})
export class TimecapsuleComponent {
  @ViewChild('timecapsuleForm') timecapsuleForm: NgForm;

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

  constructor() {}

  setAddress = (): Address => {
    this.address.street = this.timecapsuleForm.form.value.street;
    this.address.city = this.timecapsuleForm.form.value.city;
    this.address.state = this.timecapsuleForm.form.value.state;
    this.address.zipCode = this.timecapsuleForm.form.value.zip;
    this.address.apartment = this.timecapsuleForm.form.value.apt;

    console.log(this.address);
    return this.address;
  };

  addPerson = (): void => {
    this.firstName = this.timecapsuleForm.form.value.fName;
    this.lastName = this.timecapsuleForm.form.value.lName;
    this.email = this.timecapsuleForm.form.value.email;
    this.phone = this.timecapsuleForm.form.value.phone;

    let notifyPerson: NotifyPerson = new NotifyPerson(
      this.firstName,
      this.lastName,
      this.email,
      this.setAddress(),
      this.phone
    );

    this.notifyPeople.push(notifyPerson);
    console.log(this.notifyPeople);
  };

  removePerson = (i): void => {
    this.notifyPeople.splice(i, 1);
  };

  onSubmit = () => {
    console.log(this.timecapsuleForm);
  };
}
