export class FileUpload {
  key: string;
  name: string;
  url: string;
  file: File;
  parentUUID: string;

  constructor(file: File) {
    this.file = file;
  }
}
