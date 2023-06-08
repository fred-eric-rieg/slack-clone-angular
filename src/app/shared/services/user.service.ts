import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, doc, docData, setDoc } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userColl: CollectionReference<DocumentData>;
  public user = new User();

  constructor(
    private firestore: Firestore,
  ) {
    this.userColl = collection(this.firestore, 'users');
  }

  /**
   * after signup (with mail/with google) it creates a new user
   * in firestore database with uID as doc id
   * @param uID id of user in fs authentication
   * @param email email to get the name 
   */
  setNewUser(uID: string, email: string) {
    this.user.customIdName = uID;
    this.user.displayName = this.splitMail(email);
    this.user.email = email;
    setDoc(doc(this.userColl, uID), this.user.toJson())
  }

  /**
   * deletes everything after a dot and @ and return only first name of email
   * @param email input as string
   * @returns a name as a string
   */
  splitMail(email: string): string {
    const atIndex = email.indexOf('@');
    const firstPart = email.substring(0, atIndex);
    const dotIndex = firstPart.indexOf('.');

    if (dotIndex === -1) {
      return firstPart;
    } else {
      return firstPart.substring(0, dotIndex);
    }
  }
}
