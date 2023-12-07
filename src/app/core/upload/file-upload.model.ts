export class FileUpload {
  fileRefs: { name: string; url: string }[];
  key: string;
  name: string;
  url: string;
  file: File;

  constructor(file: File) {
    this.file = file;
  }
}
