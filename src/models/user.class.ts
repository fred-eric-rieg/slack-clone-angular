export class User {
  userId: string;
  fullName: string;
  displayName: string;
  profilePicture: string;
  title: string;
  timezone: string;
  email: string;
  phone: string;


  constructor(obj?: any) {
    this.userId = obj && obj.userId || '';
    this.fullName = obj && obj.fullName || '';
    this.displayName = obj && obj.displayName || '';
    this.profilePicture = obj && obj.profilePicture || '';
    this.title = obj && obj.title || '';
    this.timezone = obj && obj.timezone || '';
    this.email = obj && obj.email || '';
    this.phone = obj && obj.phone || '';
  }

  public toJson() {
    return {
      userId: this.userId,
      fullName: this.fullName,
      displayName: this.displayName,
      profilePicture: this.profilePicture,
      title: this.title,
      timezone: this.timezone,
      email: this.email,
      phone: this.phone,
    }
  }
}
