import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelpComponent } from '../dialog-help/dialog-help.component';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';
import { SidenavService } from 'src/app/shared/services/sidenav.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() sidenavOpened = new EventEmitter<void>();

  constructor(
    public dialog: MatDialog,
    private sidenavService: SidenavService
  ) {}

  openDialogHelp() {
    const dialogRef = this.dialog.open(DialogHelpComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openUserProfile() {
    this.sidenavService.sidenavOpened.emit();
  }
}
