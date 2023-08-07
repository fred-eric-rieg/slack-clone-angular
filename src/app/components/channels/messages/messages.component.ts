import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { Message } from 'src/models/message.class';
import { Thread } from 'src/models/thread.class';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  @Input() users!: User[];
  @Input() message!: string;
  @Input() thread!: Thread;

  loadedMessage!: Message;

  // Subscriptions
  searchSub!: Subscription;

  searchResults!: string[];

  constructor(
    private searchService: SearchService,
    private messageService: MessageService,
  ) { }


  ngOnInit(): void {
    this.handleSearchbar();
  }


  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }

  /**
   * Used in HTML component.
   * @param messageId as string.
   * @returns number of messages in a thread.
   */
  countThreadMessages(thread: Thread) {
    return thread.messages.length - 1;
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

  getUserProfile(message: Message) {
    let user = this.users.find(user => user.userId === message.creatorId);
    return user?.profilePicture != '' ? user?.profilePicture : '/../../assets/img/profile.png';
  }
}