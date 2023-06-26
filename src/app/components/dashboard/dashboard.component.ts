import { Component, HostListener } from '@angular/core';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Channel } from 'src/models/channel.class';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  positionX: number = 0;
  channels: Channel[] = [];
  users: User[] = [];
  
  
  // Get the mouse position on the dashboard and emit it to the channel component.
  @HostListener('document:mousemove', ['$event'])
  getMousePosition($event: MouseEvent) {
    this.positionX = $event.clientX;
  }


  constructor(private channelService: ChannelService, private userService: UserService) {
    this.loadChannels();
    this.loadUsers();
  }


  loadChannels() {
    this.channelService.channels.subscribe((channels: Channel[]) => {
      this.channels = channels;
      console.log(this.channels);
    });
  }


  loadUsers() {
    this.userService.users.subscribe((users: User[]) => {
      this.users = users;
      console.log(this.users);
    });
  }

}
