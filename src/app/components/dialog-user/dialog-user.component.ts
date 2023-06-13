import { Component, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { DialogUserEditComponent } from '../dialog-user-edit/dialog-user-edit.component';
import { MatDialog } from '@angular/material/dialog';

import { Firestore, collection, doc, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent {
  userId: string = '';
  user: User = new User();
  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, private dialog: MatDialog) {
    this.route.paramMap.subscribe( paramMap => {
      this.userId = paramMap.get('id') ?? '';
      console.log('Got Id', this.userId);
      this.getUser();
    });
  }


  getUser() {
    const userCollection = collection(this.firestore, 'users');
    const docRef = doc(userCollection, this.userId);

    docData(docRef).subscribe((userCollection: any) => {
      this.user = new User(userCollection);
      console.log('Retrieved user', this.user);
    });
  }


  /**
   * Opens input fields to edit user info.
   */
  openDialogUserEdit() {
    const dialog = this.dialog.open(DialogUserEditComponent);
    dialog.componentInstance.user = new User (this.user.toJson());
    dialog.componentInstance.userId = this.userId;
  }
}
