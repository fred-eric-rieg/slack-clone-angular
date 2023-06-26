import { Component, OnInit } from '@angular/core';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Firestore, Timestamp, doc } from '@angular/fire/firestore';
import { Channel } from 'src/models/channel.class';
import { addDoc, collection } from '@firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  collapsed = false;
  channel!: Channel;

  constructor(
    public dialog: MatDialog,
    private firestore: Firestore,
    public router: Router,
    public auth: AngularFireAuth,

  ) {

  }

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      // this.channel.creatorId = user?.uid as string;
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);

    dialogRef.afterClosed().subscribe(async (dialogData) => {
      if (dialogData && dialogData.name) {
        this.createChannel(dialogData);
      }
    });
  }

  getAllChannels() {
    const channelColl = collection(this.firestore, 'channels');
    const channelDoc = doc(channelColl);


  }

  createChannel(dialogData?: any) {
    const channelColl = collection(this.firestore, 'channels');
    const channelDoc = doc(channelColl);

    this.channel.channelId = channelDoc.id;
    this.channel.name = dialogData && dialogData.name ? dialogData.name : 'Your Channel Title';

    const channelData = this.channel;

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
