import { Component, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { Firestore, collection, doc, addDoc, updateDoc} from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent {
  user = new User();
  loading = false;

  user$!: Observable<any>;
  firestore: Firestore = inject(Firestore);

  constructor(public dialogRef: MatDialogRef<DialogUserComponent>) {}

  async saveUser() {
    console.log('Current user: ', this.user);
    this.loading = true;
    const userCollection = collection(this.firestore, 'users'); // In Firestore wird Sammlung "users" mit JSON-Input erstellt.
    let result = await addDoc(userCollection, this.user.toJson());

    // Add ID to user.name
    const docRef = doc(userCollection, result['id']);
    this.user.customIdName = result['id'];
    console.log('Custom ID: ', this.user.customIdName);
    updateDoc(docRef, this.user.toJson());

    // Stop loader and close dialog
    this.loading = false;
    this.dialogRef.close();
  }
}
