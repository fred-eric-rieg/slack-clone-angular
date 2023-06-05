import { Component } from '@angular/core';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent {
  collapsed: boolean = false;
  
  constructor(public dialog: MatDialog,) {}


  openDialog() {
    setTimeout(() => {
      this.dialog.open(DialogAddChannelComponent);
    }, 100);
  }

  toggleDropdown() {
    this.collapsed = !this.collapsed;
  }
}
