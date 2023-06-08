import { Component } from '@angular/core';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { Channel } from 'src/models/channel.class';
import { addDoc, collection } from '@firebase/firestore';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent {
  collapsed: boolean = false;
  channels: Array<any> = [];

  constructor(
    public dialog: MatDialog,
    private firestore: Firestore,
    public router: Router,
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);
  
    dialogRef.afterClosed().subscribe(async (dialogData) => {
      if (dialogData && dialogData.name) {
        await this.createChannel(dialogData);
      }
    });
  }
  
  createChannel(dialogData?: any) {
    const channelId = 'your-channel-id';
    const title = dialogData && dialogData.name ? dialogData.name : 'Your Channel Title';
  
    const channelData = {
      channelId: channelId,
      title: title
    };
  
    addDoc(collection(this.firestore, 'channels'), channelData)
      .then((docRef) => {
        console.log('Channel created with ID: ', docRef.id);
      })
      .catch((error) => {
        console.error('Error creating channel: ', error);
      });
  }
  toggleDropdown() {
    this.collapsed = !this.collapsed;
  }
}
