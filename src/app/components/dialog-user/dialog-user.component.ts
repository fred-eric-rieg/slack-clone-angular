import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { collection, doc } from '@firebase/firestore';
import { Firestore, docData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SidenavService } from './../../shared/services/sidenav.service';

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

export class DialogUserComponent implements OnInit {
  userId: string = '';
  user: User = new User();
  isSidenavHidden = false;

  constructor
  (
    private firestore: Firestore,
    private sidenavService: SidenavService,
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


  ngOnInit() {
    this.sidenavService.sidenavOpened.subscribe(() => {
      this.isSidenavHidden = false;
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


  closeSidenav() {
    this.isSidenavHidden = true;
  }
}


/*
import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/models/user.class';
import { DialogUserEditComponent } from '../dialog-user-edit/dialog-user-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { SidenavService } from './../../shared/services/sidenav.service';

import { Firestore, collection, doc, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidenav-profile',
  templateUrl: './sidenav-profile.component.html',
  styleUrls: ['./sidenav-profile.component.scss']
})
export class SidenavProfileComponent {
  userId: string = '';
  user: User = new User();
  firestore: Firestore = inject(Firestore);
  isSidenavHidden = false;


  constructor(
    private sidenavService: SidenavService,
    private route: ActivatedRoute,
    private dialog: MatDialog)
  {
    this.route.paramMap.subscribe( paramMap => {
      this.userId = paramMap.get('id') ?? '';
      console.log('Got Id', this.userId);
      this.getUser();
    });
  }

  ngOnInit() {
    this.sidenavService.sidenavOpened.subscribe(() => {
      this.isSidenavHidden = false;
    });
  }


  closeSidenav() {
    this.isSidenavHidden = true;
  }


  getUser() {
    const userCollection = collection(this.firestore, 'users');
    const docRef = doc(userCollection, this.userId);

    docData(docRef).subscribe((userCollection: any) => {
      this.user = new User(userCollection);
      console.log('Retrieved user', this.user);
    });
  }

  openDialogUserEdit() {
    const dialog = this.dialog.open(DialogUserEditComponent);
    dialog.componentInstance.user = new User (this.user.toJson());
    dialog.componentInstance.userId = this.userId;
  }
}
*/
