export class User {
  fullName!: string;
  displayName!: string;
  email!: string;
  phone!: number;
  title!: string;
  status!: string; // e.g. "active", "inactive", "away"
  customIdName!: string;
  // namePronunciation
  // timeZone

  constructor(obj?: any) {
    this.fullName = obj ? obj.fullName : '';
    this.displayName = obj ? obj.displayName : '';
    this.email = obj ? obj.email : '';
    this.phone = obj ? obj.email : '';
    this.title = obj ? obj.title : '';
    this.status = obj ? obj.status : '';
    this.customIdName = obj ? obj.customIdName : '';
  }

  public toJson() {
    return {
      fullName: this.fullName,
      displayName: this.displayName,
      email: this.email,
      phone: this.phone,
      title: this.title,
      status: this.status,
      customIdName: this.customIdName,
    }
  }
}
