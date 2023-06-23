import { Component, OnInit } from '@angular/core';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Channel } from 'src/models/channel.class';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  collapsed = false;
  channel: Channel = new Channel();


  constructor(
    public dialog: MatDialog,
    private router: Router,
    public auth: AngularFireAuth,
    private channelService: ChannelService
  ) {}


  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if(user) {
        this.channel.creatorId = user.uid;
        this.channel.members = [user.uid];
      } else {
        // This is the default user ID for the guest user.
        this.channel.creatorId = '1EPTd99Hh1YYFjrxLPW0';
        this.channel.members = ['1EPTd99Hh1YYFjrxLPW0'];
      }
    });
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);

    dialogRef.afterClosed().subscribe(async (dialogData) => {
      if (dialogData && dialogData.name) {
        this.createChannel(dialogData.name);
      }
    });
  }


  createChannel(dialogData: string) {
    this.channel.name = dialogData;
    let now = new Date().getTime() / 1000;
    this.channel.creationDate = new Timestamp(now, 0);
    this.channelService.createNewChannel(this.channel);
  }


  toggleDropdown() {
    this.collapsed = !this.collapsed;
  }
}
