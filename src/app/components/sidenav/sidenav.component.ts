import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from 'src/models/channel.class';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Timestamp } from '@angular/fire/firestore';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { authState } from '@angular/fire/auth';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class sidenavComponent implements OnInit, OnDestroy {

  channelsCollapsed = false;
  messagesCollapsed = false;

  sidenavOpened = true;

  channel: Channel = new Channel();
  allChannels!: Array<Channel>;


  constructor(
    public dialog: MatDialog,
    public auth: AngularFireAuth,
    private channelService: ChannelService,
    public sidenavService: SidenavService,
  ) { }


  ngOnInit(): void {
    this.loadChannels();
    this.handleSidenavVisibility();
  }


  ngOnDestroy(): void {
    this.sidenavService.openSidenav.unsubscribe();
  }


  /**
   * Loads all channels from the database once on initialization.
   */
  loadChannels() {
    this.channelService.onetimeLoadChannels().then((querySnapshot) => {
      this.allChannels = querySnapshot.docs.map(doc => {
        return doc.data() as Channel;
      });
    });
  }


  handleSidenavVisibility() {
    this.sidenavService.openSidenav.subscribe((response) => {
      this.sidenavOpened = response;
    });
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogAddChannelComponent);

    let sub = dialogRef.afterClosed().subscribe(async (dialogData) => {
      if (dialogData && dialogData.name) {
        this.createChannel(dialogData.name);
      }
    });
    sub.unsubscribe();
  }


  createChannel(dialogData: string) {
    this.putLoggedUserInNewChannel();
    this.channel.name = dialogData;
    let now = new Date().getTime() / 1000;
    this.channel.creationDate = new Timestamp(now, 0);
    this.channelService.createNewChannel(this.channel);
  }


  putLoggedUserInNewChannel() {
    let sub = this.auth.authState.subscribe((user) => {
      user ? (
        this.channel.creatorId = user.uid,
        this.channel.members.push(user.uid)
        ) : null;
      });
    sub.unsubscribe();
  }


  toggleChannelsDropdown() {
    this.channelsCollapsed = !this.channelsCollapsed;
  }


  toggleMessagesDropdown() {
    this.messagesCollapsed = !this.messagesCollapsed;
  }
}
