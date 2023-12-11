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
  id: string;
  constructor(
    //TODO: add files [{ name, url }]
    public title: string,
    public desc: string,
    public timestamp: number,
    public notifyPeople: NotifyPerson[]
  ) {}
}
