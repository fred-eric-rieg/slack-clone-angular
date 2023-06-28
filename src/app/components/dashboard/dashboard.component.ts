import { Component } from '@angular/core';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  activeChannel!: Channel;


  constructor() { }


  setActiveChannel(event: Channel) {
    this.activeChannel = event;
    console.log(this.activeChannel)
  }
    
}
