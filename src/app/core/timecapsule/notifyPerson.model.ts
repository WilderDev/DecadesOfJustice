interface Address {
  street: string;
  aptartment?: string;
  city: string;
  state: string;
  zipCode: string;
}

export class NofifyPerson {
  constructor(
    firstName: string,
    lastName: string,
    email: string,
    address: Address,
    phone?: string
  ) {}
}
