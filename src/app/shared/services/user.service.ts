import { User } from './../../../models/user.class';
import { Injectable } from '@angular/core';
import { setDoc, collection, doc, updateDoc } from '@firebase/firestore';
import { Firestore, docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User = new User();
  userId: string = '';
  userCollection = collection(this.firestore, 'users');
  loading: boolean = false;

  constructor(
    private firestore: Firestore) {}


    /**
   * Retrieves user data from Firestore based on the provided user ID.
   * Subscribes to the document data and maps it to a User object.
   * 'userCollection' is a firestore collection representing the 'users' collection.
   * 'docRef' is a document reference representing a specific user document.
   */
  getUser() {
    const userCollection = collection(this.firestore, 'users');
    const docRef = doc(userCollection, this.userId);

    docData(docRef).subscribe((userCollection: any) => {
      this.user = new User(userCollection);
    });
  }


  /**
   * Updates user information in Firestore.
   * Loading indicates whether the update operation is in progress.
   */
  updateUserInfo() {
    this.loading = true;
    const userCollection = collection(this.firestore, 'users');
    const docRef = doc(userCollection, this.userId);
    updateDoc(docRef, this.user.toJson())
      .then(() => {
        this.loading = false;
      }
    );
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
    setDoc(doc(this.userCollection, uID), this.user.toJson())
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
