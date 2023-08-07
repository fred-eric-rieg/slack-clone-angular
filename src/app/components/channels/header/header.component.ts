import { Component, Input } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { User } from 'src/models/user.class';

import { MatDialog } from '@angular/material/dialog';

import { DialogViewPeopleComponent } from '../dialog-view-people/dialog-view-people.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() channel!: Channel;
  @Input() users!: User[];

  constructor(public dialog: MatDialog,
    ) { }


  getMembers(channel: Channel) {
    return this.users.filter(user => channel.members.includes(user.userId));
  }


  getUserProfileAlt(index: number, channel: Channel) {
    let user = this.users.find(user => user.userId === channel.members[index]);
    return user?.profilePicture != '' ? user?.profilePicture : '/../../assets/img/profile.png';
  }


  openViewPeopleDialog() {
    const dialogRef = this.dialog.open(DialogViewPeopleComponent, {
      width: '350px',
      data: {
        channel: this.channel,
        users: this.users
      }
    });
  }
}
