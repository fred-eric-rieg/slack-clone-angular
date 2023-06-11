import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { Firestore, collection, doc, updateDoc} from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog-user-edit',
  templateUrl: './dialog-user-edit.component.html',
  styleUrls: ['./dialog-user-edit.component.scss']
})


export class DialogUserEditComponent {
  user!: User;
  loading = false;
  firestore: Firestore = inject(Firestore);
  userId!: string;

  constructor(public dialogRef: MatDialogRef<DialogUserEditComponent>) {}

  updateUserInfo() {
    this.loading = true;
    const userCollection = collection(this.firestore, 'users');
    const docRef = doc(userCollection, this.userId);
    updateDoc(docRef, this.user.toJson())
      .then(() => {
        // Stop loader and close dialog
        this.loading = false;
        this.dialogRef.close();
      }
    );
  }
}
