import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { Firestore, collection, doc, updateDoc} from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-dialog-user-edit',
  templateUrl: './dialog-user-edit.component.html',
  styleUrls: ['./dialog-user-edit.component.scss']
})

@Injectable({
  providedIn: 'root'
})


export class DialogUserEditComponent {
  user!: User;
  loading = false;
  userId!: string;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    public dialogRef: MatDialogRef<DialogUserEditComponent>
  ) {}


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
        // Stop loader and close dialog
        this.loading = false;
        this.dialogRef.close();
      }
    );
  }
}
