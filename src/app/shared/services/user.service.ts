import { User } from './../../../models/user.class';
import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import {
  Firestore, Unsubscribe, addDoc, collection,
  collectionData, deleteDoc, doc, docData, getDoc,
  getDocs, onSnapshot, query, setDoc, updateDoc, where
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection = collection(this.firestore, 'users');
  allUsers$ = collectionData(this.userCollection) as Observable<User[]>;

  currentUser!: string;
  activeUser!: User;

  // Setting up the query to listen for changes in the user collection.
  private q = query(this.userCollection);
  unsubscribe!: Unsubscribe;


  constructor(private firestore: Firestore) { }

  /**
  * Subscribes to the user collection and listens for changes.
  * If a change occurs, the change is processed.
  */
  startListening() {
    this.unsubscribe = onSnapshot(this.q, (snapshot: { docChanges: () => any[]; }) => {
      snapshot.docChanges().forEach((change) => {
        change.type === "added" ? this.addNewUser(change.doc.data()) : null;
        change.type === "modified" ? this.modifyUser(change.doc.data()) : null;
        change.type === "removed" ? this.removeUser(change.doc.data()) : null;
      });
    });
  }

  /**
   * Adds a new user to the allUsers$ Observable.
   * @param change as any.
   */
  private addNewUser(change: any) {
    console.log("New user: ", change);
    this.allUsers$.pipe(map(users => {
      return [...users, new User(change)];
    }));
  }

  /**
   * Modifies a user in the allUsers$ Observable.
   * @param change as any.
   */
  private modifyUser(change: any) {
    console.log("Modified user: ", change);
    this.allUsers$.pipe(map(users => {
      return users.map(user => {
        if (user.userId === change.userId) {
          return change;
        }
        return user;
      });
    }));
  }

  /**
   * Removes a user from the allUsers$ Observable.
   * @param change as any.
   */
  private removeUser(change: any) {
    console.log("Removed user: ", change);
    this.allUsers$.pipe(map(users => {
      return users.filter(user => user.userId !== change.userId);
    }));
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
      let allUsers = await this.getAllUsersSnapshot();
      let allUserIds: Array<string> = [];
      allUsers.forEach(user => {
        allUserIds.push(user.id);
      })
      if (!allUserIds.includes(res)) this.createUser(uID, email);
    })
  }


  createUser(uID: string, email: string) {
    let user = new User();
    user.userId = uID;
    user.displayName = this.splitMail(email);
    user.email = email;
    setDoc(doc(this.userCollection, uID), user.toJson());
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

  /**
   * Returns all users snapshot.
   * @returns DocumentData[].
   */
  getAllUsersSnapshot() {
    return getDocs(this.userCollection);
  }

  /**
   * Returns a single user snapshot.
   * @param userId as string.
   * @returns DocumentSnapshot.
   */
  getSingleUserSnapshot(userId: string) {
    const userDocument = doc(this.userCollection, userId);
    return getDoc(userDocument);
  }

  /**
   * A query snapshot that returns all users that match an array of userIds.
   * @param userIds as string.
   * @returns DocumentData[].
   */
  getAllUsersThreadSnapshot(userIds: string[]) {
    const q = query(this.userCollection, where('userId', 'in', userIds));
    return getDocs(q);
  }
}