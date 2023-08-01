import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';


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
    public dialogRef: MatDialogRef<DialogUserEditComponent>,
    public authService: AuthService,
    public userService: UserService,
  ) {}


  /**
   * Updates user information in Firestore.
   * This method is called when the "Save" button is clicked in the dialog.
   * It uses the UserService to update the user data.
   * When the update operation is in progress, the loading flag is set to true.
   * After the update is complete, the loading flag is set to false, and the dialog is closed.
   */
  updateUserInfo() {
    this.loading = true;
    this.userService.update(this.user)
      .then(() => {
        this.loading = false;
        this.dialogRef.close();
      });
  }
}
