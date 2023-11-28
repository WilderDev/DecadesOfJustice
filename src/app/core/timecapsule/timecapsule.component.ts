import { Component } from '@angular/core';

import { NofifyPerson } from './notifyPerson.model';

@Component({
  selector: 'app-timecapsule',
  templateUrl: './timecapsule.component.html',
  styleUrls: ['./timecapsule.component.scss'],
})
export class TimecapsuleComponent {
  public notifyPeople: NofifyPerson[] = [];

  constructor() {}

  addNofityPerson = (
    fName: string,
    lName: string,
    email: string,
    address,
    phone: string
  ): void => {
    let person: NofifyPerson = new NofifyPerson(
      fName,
      lName,
      email,
      address,
      phone
    );
    this.notifyPeople.push(person);
  };
}
