import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-channel-item',
  templateUrl: './channel-item.component.html',
  styleUrls: ['./channel-item.component.scss']
})
export class ChannelItemComponent {
  allChannels!: Array<Channel>;
  test: string = '';
  constructor(private route: Router, private channelService: ChannelService) { }


  ngOnInit(): void {
    this.channelService.channels.subscribe((channels) => {
      this.allChannels = channels;
    })
  }


  openChannel(id?: string) {

  }
}
