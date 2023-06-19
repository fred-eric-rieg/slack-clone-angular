import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { collection, doc } from '@firebase/firestore';
import { Firestore, docData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SidenavService } from './../../shared/services/sidenav.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { DialogUserEditComponent } from '../dialog-user-edit/dialog-user-edit.component';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit {
  userId: string = '';
  user: User = new User();
  isSidenavHidden = false;

  constructor(
    private firestore: Firestore,
    private sidenavService: SidenavService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.route.paramMap.subscribe(paramMap => {
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
    dialog.componentInstance.user = new User(this.user.toJson());
    dialog.componentInstance.userId = this.userId;
  }

  closeSidenav() {
    this.isSidenavHidden = true;
  }
}
