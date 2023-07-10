import { Component, OnInit } from '@angular/core';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from 'src/models/channel.class';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Timestamp } from '@angular/fire/firestore';
import { SidenavService } from 'src/app/shared/services/sidenav.service';

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
  isLeftSidenavHidden = false;


  constructor(
    public dialog: MatDialog,
    public auth: AngularFireAuth,
    private channelService: ChannelService,
    public sidenavService: SidenavService,
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
    })


    /**
    * Opens and closes the left sidenav.
    * Checks if sidenav is oppened. If oppened, then the sidenav will be closed after pushing the button in vice-versa.
    */
    this.sidenavService.leftSidenavOpened.subscribe(() => {
      this.sidenavService.isLeftSidenavHidden = !this.sidenavService.isLeftSidenavHidden;
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


  toggleChannelsDropdown() {
    this.channelsCollapsed = !this.channelsCollapsed;
  }


  toggleMessagesDropdown() {
    this.messagesCollapsed = !this.messagesCollapsed;
  }
}
