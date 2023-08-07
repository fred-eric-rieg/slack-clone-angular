import { Component, Input } from '@angular/core';

// Models
import { Channel } from 'src/models/channel.class';
import { User } from 'src/models/user.class';

// Material
import { MatDialog } from '@angular/material/dialog';

// Components
import { DialogAddDescriptionComponent } from '../dialog-add-description/dialog-add-description.component';
import { DialogAddPeopleComponent } from '../dialog-add-people/dialog-add-people.component';

// Services
import { ChannelService } from 'src/app/shared/services/channel.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent {

  @Input() channel!: Channel;
  @Input() users!: User[];

  constructor(
    private dialog: MatDialog,
    private channelService: ChannelService,
    ) { }


  /**
   * @returns the displayName of the creator of the active channel.
   */
  getCreator(channel: Channel) {
    return this.users.find(user => user.userId === channel.creatorId)?.displayName;
  }

  /**
   * Opens the description dialog and subscribes to the dialog data
   * to update the channel description.
   */
  openDescriptionDialog() {
    const dialogRef = this.dialog.open(DialogAddDescriptionComponent);

    let sub = dialogRef.afterClosed().subscribe(async (dialogData) => {
      if (dialogData && dialogData.description) {
        this.updateDescription(dialogData.description);
      }
      sub.unsubscribe();
    });
  }


  /**
   * Calls the channelService to update the channel description.
   * @param dialogData as string.
   */
  updateDescription(dialogData: string) {
    this.channel.description = dialogData;
    this.channelService.updateChannel(this.channel);
  }


  openAddPeopleDialog() {
    const dialogRef = this.dialog.open(DialogAddPeopleComponent, {
      width: '350px',
      data: {
        people: this.channel.members,
      }
    });

    let sub = dialogRef.afterClosed().subscribe(async (dialogData) => {
      if (dialogData && dialogData.people) {
        this.addPeople(dialogData.people);
      }
      sub.unsubscribe();
    });
  }


  addPeople(people: string[]) {
    people.forEach((person) => {
      let user = this.users.find(user => user.userId === person);
      if (user) {
        this.channel.members.push(user.userId);
      }
    });
    this.channelService.updateChannel(this.channel);
  }
}
