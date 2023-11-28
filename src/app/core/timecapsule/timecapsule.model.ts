import { NotifyPerson } from './notifyPerson.model';

export class Timecapsule {
  constructor(
    public title: string,
    public desc: string,
    public url: string,
    public timestamp: number,
    public notifyPeople: NotifyPerson[]
  ) {}
}
