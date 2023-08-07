import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';
import { ThreadService } from 'src/app/shared/services/thread.service';
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

  threads$: Observable<Thread[]> = this.threadService.channelThreads$;


  constructor(
    private threadService: ThreadService,
    public messageService: MessageService
  ) {}


  openThread(thread: Thread) {
    return `/dashboard/thread/${thread.threadId}`;
  }
}