import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel-item',
  templateUrl: './channel-item.component.html',
  styleUrls: ['./channel-item.component.scss']
})
export class ChannelItemComponent {

  constructor(private route: Router) {}


  openChannel() {
    
  }
}
