import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { SearchService } from 'src/app/shared/services/search.service';
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

  // Subscriptions
  searchSub!: Subscription;

  searchResults!: string[];


  constructor(
    public channelService: ChannelService,
    private searchService: SearchService
  ) {}


  ngOnInit(): void {
    this.handleSearchbar();
  }


  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }


  handleSearchbar() {
    // Search filter (import from searchService)
    this.searchResults = this.searchService.getSearchResults();
    this.searchSub = this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
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


  openThread(thread: Thread) {
    return `/dashboard/thread/${thread.threadId}`;
  }
}