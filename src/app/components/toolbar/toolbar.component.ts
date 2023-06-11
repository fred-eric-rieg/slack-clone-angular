import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelpComponent } from '../dialog-help/dialog-help.component';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  constructor(public dialog: MatDialog) {}

  openDialogHelp() {
    const dialogRef = this.dialog.open(DialogHelpComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogUser() {
    const dialogRef = this.dialog.open(DialogUserComponent, {restoreFocus: false});
  }

  searchChannel() {

  }

  openSidenavProfile() {

  }

  openSidenavChannel() {

  }

}
