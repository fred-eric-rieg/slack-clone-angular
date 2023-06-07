import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userColl: CollectionReference<DocumentData>;
  private user!: User;

  constructor(
    private firestore: Firestore,
  ) { 
    this.userColl = collection(this.firestore, 'users');
  }

  setNewUser() {
    console.log(this.userColl);
  }
}
