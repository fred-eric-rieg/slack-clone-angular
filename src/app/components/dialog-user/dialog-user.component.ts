import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { collection, doc } from '@firebase/firestore';
import { Firestore, docData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/models/user.class';
import { DialogUserEditComponent } from '../dialog-user-edit/dialog-user-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})

@Injectable({
  providedIn: 'root'
})

export class DialogUserComponent {
  userId: string = '';
  user: User = new User();

  constructor
  (
    private firestore: Firestore,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    /**
     * Subscribes to route parameter changes and fetches user data.
     * User ID is extracted from the route parameters.
     * Fetches user data based on the retrieved user ID.
     */
    this.route.paramMap.subscribe( paramMap => {
      this.userId = paramMap.get('id') ?? '';
      console.log('Got Id', this.userId); // TEST
      this.getUser();
    });
  }


  /**
   * Retrieves user data from Firestore based on the provided user ID.
   * Subscribes to the document data and maps it to a User object.
   * 'userCollection' is a firestore collection representing the 'users' collection.
   * 'docRef' is a document reference representing a specific user document.
   */
  getUser() {
    const userCollection = collection(this.firestore, 'users');
    const docRef = doc(userCollection, this.userId);

    docData(docRef).subscribe((userCollection: any) => {
      this.user = new User(userCollection);
      console.log('Retrieved user', this.user); // TEST
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
