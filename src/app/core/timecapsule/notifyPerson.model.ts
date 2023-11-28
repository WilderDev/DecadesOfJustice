export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: number;
  apartment?: string;
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
