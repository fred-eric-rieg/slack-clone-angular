import { Component, Input } from '@angular/core';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { Channel } from 'src/models/channel.class';
import { Thread } from 'src/models/thread.class';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent {

  @Input() channel!: Channel;
  @Input() users!: User[];


  constructor(
    public channelService: ChannelService,
  ) {}


  openThread(thread: Thread) {
    return `/dashboard/thread/${thread.threadId}`;
  }
}