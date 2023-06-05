import { Component } from '@angular/core';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class sidenavComponent {

  constructor(
    public dialog: MatDialog
  ) {
    
  }

  openDialog() {
    setTimeout(() => {
      this.dialog.open(DialogAddChannelComponent);
    }, 100)
  }
}
