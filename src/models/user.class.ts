export class User {
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  fullName: string;
  profilePicture: string;
  title: string;
  email: string;
  phone: string;


  constructor(obj?: any) {
    this.userId = obj && obj.userId || '';
    this.firstName = obj && obj.firstName || '';
    this.lastName = obj && obj.lastName || '';
    this.displayName = obj && obj.displayName || '';
    this.fullName = obj && obj.fullName || '';
    this.profilePicture = obj && obj.profilePicture || '';
    this.title = obj && obj.title || '';
    this.email = obj && obj.email || '';
    this.phone = obj && obj.phone || '';
  }

  public toJson() {
    return {
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      displayName: this.displayName,
      fullName: this.fullName,
      profilePicture: this.profilePicture,
      title: this.title,
      email: this.email,
      phone: this.phone,
    }
  }
}
