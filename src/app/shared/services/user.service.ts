import { User } from './../../../models/user.class';
import { Injectable, Input } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: any;
  activeUser!: any;
  user: User = new User();
  users!: Observable<any>;
  private userCollection: CollectionReference<DocumentData>;


  constructor(
    private firestore: Firestore) {
    this.userCollection = collection(this.firestore, 'users');
    this.getAllUsers();
  }

  /**
   * Gets user info based on id.
   * @param id
   * @returns the user that matches the id.
   */
  get(userId: string) {
    const userDocRef = doc(this.firestore, 'users', userId);
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
    const userDocRef = doc(this.firestore, `users/${user.userId}`);
    return updateDoc(userDocRef, { ...user });
  }

  /**
   * Deletes selected user.
   * @param id
   * @returns a deletion of the user that matches the id.
   */
  delete(userId: string) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return deleteDoc(userDocRef);
  }

  /**
   * after signup (with mail/with google) create a new user
   * if user dont already exist
   * in firestore database with uID as doc id
   * @param uID id of user in fs authentication
   * @param email email to get the name
   */
  async setNewUser(uID: string, email: string) {
    await this.getCurrentUser().then(async (res: any) => {
      let allUsers = await this.getAllUsersNotObservable();
      let allUserIds: Array<string> = [];
      allUsers.forEach(user => {
        allUserIds.push(user.id);
      })
      if (!allUserIds.includes(res)) this.createUser(uID, email);
    })
  }


  createUser(uID: string, email: string) {
    this.user.userId = uID;
    this.user.displayName = this.splitMail(email);
    this.user.email = email;
    setDoc(doc(this.userCollection, uID), this.user.toJson());
  }

  /**
   * Get current logged in User and return its ID
   */
  async getCurrentUser() {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = user.uid;
          resolve(this.currentUser);
        } else {
          reject(new Error("User is not logged in."))
        }
      })
    })
  }


  async getCompleteCurrentUser() {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.activeUser = user;
          resolve(this.activeUser);
        } else {
          reject(new Error("User is not logged in."))
        }
      })
    })
  }


  getUserData(userId: string) {
    const docRef = doc(this.userCollection, userId);
    return docData(docRef);
  }

  async getUser(userId: string) {
    const userData = await this.returnUserData(userId);
  }

  async returnUserData(userId: string) {
    const snap = await getDoc(doc(this.userCollection, userId));
    return snap.data();
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


  getAllUsers(): Observable<any> {
    return this.users = collectionData(this.userCollection);
  }


  getAllUsersNotObservable() {
    return getDocs(this.userCollection);
  }


  getUserNotObservable(userId: string) {
    const userDocument = doc(this.userCollection, userId);
    return getDoc(userDocument);
  }


  getAllUsersInThread(userIds: string[]) {
    const q = query(this.userCollection, where('userId', 'in', userIds));
    return getDocs(q);
  }
}
