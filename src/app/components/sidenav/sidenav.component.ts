import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogAddChannelComponent } from '../dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from 'src/models/channel.class';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Timestamp } from '@angular/fire/firestore';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { set } from '@angular/fire/database';


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
  allChannels$!: Observable<Channel[]>;

  // Subscriptions
  channelSub!: Subscription;


  constructor(
    public dialog: MatDialog,
    public auth: AngularFireAuth,
    private channelService: ChannelService,
    public sidenavService: SidenavService,
    private router: Router
  ) { }


  ngOnInit(): void {
    console.log('SidenavComponent initialized');
    this.loadChannels();
    this.handleSidenavVisibility();
  }


  ngOnDestroy(): void {
    console.log('SidenavComponent destroyed');
    this.sidenavService.openSidenav.unsubscribe();
    this.channelSub.unsubscribe();
  }


  /**
   * Loads all channels from the database as an observable. Then it pipes the response
   * of the promised observable in order to get the channel with the name 'Main' and
   * navigates to the dashboard/channel/:channelId route.
   */
  loadChannels() {
    this.allChannels$ = this.channelService.allChannels$;
    this.channelSub = this.allChannels$.subscribe(channels => {
      this.router.navigate(['dashboard/channel/' + channels.filter(channel => channel.name === 'Main')[0].channelId]);
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
