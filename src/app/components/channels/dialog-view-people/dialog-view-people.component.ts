import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { DialogAddPeopleComponent } from '../dialog-add-people/dialog-add-people.component';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-dialog-view-people',
  templateUrl: './dialog-view-people.component.html',
  styleUrls: ['./dialog-view-people.component.scss']
})
export class DialogViewPeopleComponent {

  activeChannel = new Channel();
  users!: User[];

  constructor(
    public dialog: MatDialog,
    private channelService: ChannelService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.users = this.data.users;
    this.activeChannel = this.data.channel;
  }


  openAddPeopleDialog() {
    console.log("openAddPeopleDialog");
    const dialogRef = this.dialog.open(DialogAddPeopleComponent, {
      width: '350px',
      data: {
        people: this.activeChannel.members,
      }
    });

    dialogRef.afterClosed().subscribe(async (dialogData) => {
      if (dialogData && dialogData.people) {
        this.addPeople(dialogData.people);
      }
    });
  }


  addPeople(people: string[]) {
    people.forEach((person) => {
      let user = this.users.find(user => user.userId === person);
      if (user) {
        this.activeChannel.members.push(user.userId);
      }
    });
    this.channelService.updateChannel(this.activeChannel);
  }


  removeUserFromChannel(userId: string) {
    this.activeChannel.members = this.activeChannel.members.filter(member => member !== userId);
    this.channelService.updateChannel(this.activeChannel);
  }
}
