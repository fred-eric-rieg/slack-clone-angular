import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, combineLatest, map } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { ThreadService } from 'src/app/shared/services/thread.service';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { Thread } from 'src/models/thread.class';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  @Input() channel!: Channel;
  @Input() users!: User[];

  searchResults!: string[];

  data$: Observable<{ threads: Thread[]; messages: Message[]}> = combineLatest([this.threadService.channelThreads$, this.messageService.messages$])
  .pipe(map(([threads, messages]) => ({ threads, messages })));


  // Subscriptions
  searchSub!: Subscription;

  constructor(
    private searchService: SearchService,
    private threadService: ThreadService,
    private messageService: MessageService,
  ) { }


  ngOnInit(): void {
    this.handleSearchbar();
  }


  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }


  loadMessages(threads: Thread[]) {
    console.log('Loading messages in message component: ', threads);
  }


  openThread(thread: string) {
    return `/dashboard/thread/${thread}`;
  }


  getUserProfile(message: Message) {
    let user = this.users.find(user => user.userId === message.creatorId);
    return user?.profilePicture != '' ? user?.profilePicture : '/../../assets/img/profile.png';
  }

  /**
   * Used in HTML component.
   * @param messageId as string.
   * @returns number of messages in a thread.
   */
  countThreadMessages(thread: Thread) {
    return thread.messages.length - 1;
  }

  /**
   * Finds the user displayName by the user id.
   * @param userId as string.
   * @returns a string with the user displayName.
   */
  getUserName(userId: string) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].userId === userId) {
        return this.users[i].displayName;
      }
    }
    return 'Unknown';
  }


  handleSearchbar() {
    // Search filter (import from searchService)
    this.searchResults = this.searchService.getSearchResults();
    this.searchSub = this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
  }
}