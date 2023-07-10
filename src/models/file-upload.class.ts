export class FileUpload {
  key!: string;
  name!: string;
  url!: string;
  file: File;

  constructor(file: File) {
    this.file = file;
  }

  /*
  constructor(file: File, key?: string, name?: string, url?: string) {
    this.file = file;
    this.key = key || '';
    this.name = name || '';
    this.url = url || '';
  }
  */
}
