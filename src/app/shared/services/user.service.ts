import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userColl: CollectionReference<DocumentData>;
  public user = new User();

  users!: Observable<any>;

  constructor(private firestore: Firestore) {
    this.userColl = collection(this.firestore, 'users');
    this.getAllUsers();
  }

  /**
   * after signup (with mail/with google) it creates a new user
   * in firestore database with uID as doc id
   * @param uID id of user in fs authentication
   * @param email email to get the name 
   */
  setNewUser(uID: string, email: string) {
    this.user.userId = uID;
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


  getAllUsers() {
    const userCollection = collection(this.firestore, 'users');
    this.users = collectionData(userCollection);
  }
}
