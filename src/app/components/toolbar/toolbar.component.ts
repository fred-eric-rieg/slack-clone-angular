import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelpComponent } from '../dialog-help/dialog-help.component';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
// Import des AngularFireAuth Service
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() sidenavOpened = new EventEmitter<void>();


  constructor(public dialog: MatDialog, public asService: AngularFireAuth, private sidenavService: SidenavService, private router: Router) {}

  openDialogHelp() {
    const dialogRef = this.dialog.open(DialogHelpComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openUserProfile() {
    this.sidenavService.sidenavOpened.emit();
  }


  logoutUser() {
    this.asService.signOut();
    this.router.navigate(['']);
  }
}
