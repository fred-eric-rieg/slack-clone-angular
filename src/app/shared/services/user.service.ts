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
}
