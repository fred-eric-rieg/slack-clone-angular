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

  setNewUser(uID: string, email: string) {
    this.user.customIdName = uID;
    this.user.displayName = this.splitMail(email);
    this.user.email = email;
    setDoc(doc(this.userColl, uID), this.user.toJson())
  }

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
