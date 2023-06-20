export class User {
  userId: string = '';
  firstName: string = '';
  lastName: string = '';
  displayName: string = '';
  fullName: string = '';
  title: string = '';
  email: string = '';
  phone: string = '';
  profile: string = '';


  constructor(obj?: any) {
    this.userId = obj && obj.userId || '';
    this.firstName = obj && obj.firstName || '';
    this.lastName = obj && obj.lastName || '';
    this.displayName = obj && obj.displayName || '';
    this.fullName = obj && obj.fullName || '';
    this.title = obj && obj.title || '';
    this.email = obj && obj.email || '';
    this.phone = obj && obj.phone || '';
    this.profile = obj && obj.profile || '';
  }

  public toJson() {
    return {
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      displayName: this.displayName,
      fullName: this.fullName,
      title: this.title,
      email: this.email,
      phone: this.phone,
      profile: this.profile
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
