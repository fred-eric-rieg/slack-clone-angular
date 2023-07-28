import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { DialogUserEditComponent } from '../dialog-user-edit/dialog-user-edit.component';
import { DialogPictureEditComponent } from '../dialog-picture-edit/dialog-picture-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from './../../shared/services/sidenav.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit {
  users: any;
  userId: string = '';
  user: User = new User();
  isSidenavHidden = true;
  imgUrl: string = '';


  constructor(
    public firestore: Firestore,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public sidenavService: SidenavService,
    public authService: AuthService,
    private auth: AngularFireAuth,
    private userService: UserService,
  ) {}


  /**
   * ngOnInit is called, and the 'users' collection is fetched from Firestore.
   * The collection is converted into an Observable and stored in this.users.
   * Within the subscription, you can access the data and make a copy if needed.
   */
  ngOnInit() {
    const collectionInstance = collection(this.firestore, 'users');
    this.users = collectionData(collectionInstance);
    this.users.subscribe((data: any) => {
    });

    this.auth.user.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
        this.getUser();
      } else {
        this.userId = 'Zta41sUcC7rLGHbpMmn4';
        this.getUser();
      }
    });


    /**
     * Checks if sidenav with profile info is oppened.
     */
    this.sidenavService.sidenavOpened.subscribe((response) => {
      this.isSidenavHidden = response;
      //console.log(this.isSidenavHidden);
    });
  }


  /**
   * Retrieves user data from Firestore based on the provided user ID.
   * Subscribes to the document data and maps it to a User object.
   * The UserService is used to get user data.
   * The retrieved user data is used to create a new User object.
   */
  getUser() {
    this.userService.getUserData(this.userId).subscribe((user: any) => {
      this.user = new User(user);
    });
  }


  /**
   * Opens input fields to edit user info.
   */
  openDialogUserEdit() {
    const dialog = this.dialog.open(DialogUserEditComponent);
    dialog.componentInstance.user = new User(this.user.toJson());
    dialog.componentInstance.userId = this.userId;
  }


  /**
   * Opens the dialog for editing the user's profile pic.
   */
    editPictureDetail() {
      const dialog = this.dialog.open(DialogPictureEditComponent);
      dialog.componentInstance.user = new User(this.user.toJson());
      dialog.componentInstance.userId = this.userId;
    }


  /**
   * Closes Sidenav with profile information
   */
  closeSidenav() {
    this.isSidenavHidden = true;
  }
}
