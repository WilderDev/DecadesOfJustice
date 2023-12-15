import { v4 as uuidv4 } from 'uuid';

export class Address {
  constructor(
    public street: string,
    public city: string,
    public state: string,
    public zipCode: number,
    public apartment?: string
  ) {}
}

export class NotifyPerson {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public address: Address,
    public phone?: string
  ) {}
}

export class Timecapsule {
  public uuid: string;
  constructor(
    public userID: string,
    public title: string,
    public desc: string,
    public timestamp: number,
    public notifyPeople: NotifyPerson[]
  ) {
    this.uuid = uuidv4();
  }
}
