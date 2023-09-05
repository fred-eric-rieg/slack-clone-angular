import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/models/user.class';
import { DialogUserEditComponent } from '../dialog-user-edit/dialog-user-edit.component';
import { DialogPictureEditComponent } from '../dialog-picture-edit/dialog-picture-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from './../../shared/services/sidenav.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit, OnDestroy {

  userId: string = '';
  user!: User;
  userDialogOpen = false;
  imgUrl: string = '';

  // Subscriptions
  userSub!: Subscription;
  sidenavSub!: Subscription;
  allUsersSub!: Subscription;


  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public sidenavService: SidenavService,
    public authService: AuthService,
    private auth: AngularFireAuth,
    private userService: UserService
  ) { }


  ngOnInit() {
    this.getLoggedInUser();
    this.listenToSidenavService();
  }


  ngOnDestroy(): void {
    console.log('DialogUserComponent destroyed');
    this.userSub.unsubscribe();
    this.sidenavSub.unsubscribe();
    this.allUsersSub.unsubscribe();
  }


  getLoggedInUser() {
    this.userSub = this.auth.user.subscribe((user: any) => {
      user ? this.userId = user.uid : null;
    });
    this.allUsersSub = this.userService.allUsers$.subscribe((users) => {
      console.log('users: ', users)
      let user = users.find((user) => user.userId === this.userId);
      user ? this.user = user : null;
    });
  }


  listenToSidenavService() {
    this.sidenavSub = this.sidenavService.openUserProfile.subscribe((response) => {
      this.userDialogOpen = response;
    });
  }


  /**
   * Opens input fields to edit user info.
   */
  openDialogUserEdit() {
    const dialog = this.dialog.open(DialogUserEditComponent);
    dialog.componentInstance.user = this.user;
    dialog.componentInstance.userId = this.userId;
  }


  /**
   * Opens the dialog for editing the user's profile pic.
   */
  editPictureDetail() {
    const dialog = this.dialog.open(DialogPictureEditComponent);
    dialog.componentInstance.user = this.user;
    dialog.componentInstance.userId = this.userId;
  }


  /**
   * Closes Dialog with profile information.
   */
  closeDialog() {
    this.sidenavService.openUserProfile.emit(false);
  }
}
