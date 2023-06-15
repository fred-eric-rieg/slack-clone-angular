export class User {
  fullName?: string;
  displayName?: string;
  profile?: string;
  email?: string;
  phone?: number;
  title?: string;
  status?: string;
  customIdName?: string;

  constructor(obj?: any) {
    this.fullName = obj ? obj.fullName : '';
    this.displayName = obj ? obj.displayName : '';
    this.profile = obj ? obj.profile : '';
    this.email = obj ? obj.email : '';
    this.phone = obj ? obj.phone : '';
    this.title = obj ? obj.title : '';
    this.status = obj ? obj.status : '';
    this.customIdName = obj ? obj.customIdName : '';
  }

  public toJson() {
    return {
      fullName: this.fullName,
      displayName: this.displayName,
      profile: this.profile,
      email: this.email,
      phone: this.phone,
      title: this.title,
      status: this.status,
      customIdName: this.customIdName,
    }
  }
}


/*
export interface User {
  fullName?: string;
  displayName?: string;
  profile?: string;
  email?: string;
  phone?: number;
  title?: string;
  customIdName?: string;
}
*/
