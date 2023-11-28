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
