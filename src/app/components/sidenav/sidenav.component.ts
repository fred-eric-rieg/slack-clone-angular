import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from 'src/models/channel.class';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class sidenavComponent implements OnInit {

  channelsCollapsed = false;
  messagesCollapsed = false;

  channel: Channel = new Channel();
  allChannels!: Array<Channel>;

  @Output() channelSelected: EventEmitter<Channel> = new EventEmitter<Channel>();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public auth: AngularFireAuth,
    private channelService: ChannelService
  ) { }


  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (user) {
        this.channel.creatorId = user.uid;
        this.channel.members = [user.uid];
      } else {
        // This is the default user ID for the guest user.
        this.channel.creatorId = 'Zta41sUcC7rLGHbpMmn4';
        this.channel.members = ['Zta41sUcC7rLGHbpMmn4'];
      }
    });
    this.channelService.channels.subscribe((channels) => {
      this.allChannels = channels;
      // Stets den ersten Channel als aktiven Channel übertragen.
      this.channelSelected.emit(this.allChannels[0]);
    })
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


  toggleChannelsDropdown() {
    this.channelsCollapsed = !this.channelsCollapsed;
  }


  toggleMessagesDropdown() {
    this.messagesCollapsed = !this.messagesCollapsed;
  }


  openChannel(channel?: Channel) {
    this.channelSelected.emit(channel || undefined);
  }
}
