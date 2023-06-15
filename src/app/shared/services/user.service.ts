import { User } from './../../../models/user.class';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CollectionReference, DocumentData, addDoc, setDoc, collection, deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userCollection: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore) {
      this.userCollection = collection(this.firestore, 'users');
    }


    /**
     * Gets all user info.
     * @returns all of the user in the collection.
     */
    getAll() {
      return collectionData(this.userCollection, {
        idField: 'customIdName',
      }) as Observable<User[]>;
    }


    /**
     * Gets user info based on id.
     * @param id
     * @returns the user that matches the id.
     */
    get(customIdName: string) {
      const userDocRef = doc(this.firestore, 'users', customIdName);
      return docData(userDocRef, { idField: 'customIdName' });
    }


    /**
     * Creates new user.
     * @param user
     * @returns a new user to the collection.
     */
    create(user: User) {
      return addDoc(this.userCollection, user);
    }


    /**
     * Updates user info.
     * @param user
     * @returns an update to the user collection.
     */
    update(user: User) {
      const userDocRef = doc(this.firestore,`user/${user.customIdName}`);
      return updateDoc(userDocRef, { ...user });
    }


    /**
     * Deletes selected user.
     * @param id
     * @returns a deletion of the user that matches the id.
     */
    delete(customIdName: string) {
      const userDocRef = doc(this.firestore,`user/${customIdName}`);
      return deleteDoc(userDocRef);
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
