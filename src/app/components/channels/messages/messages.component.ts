import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  @Input() messages!: Message[];
  @Input() threads!: Thread[];
  @Input() users!: User[];

  searchResults!: string[];

  // Subscriptions
  searchSub!: Subscription;

  constructor(private searchService: SearchService) { }


  ngOnInit(): void {
    this.handleSearchbar();
  }


  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }


  openThread(message: Message) {
    return `/dashboard/thread/${this.threads.find(thread => thread.messages[0].includes(message.messageId))?.threadId}`;
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
  countThreadMessages(messageId: string) {
    let thread = this.threads.find(thread => thread.messages[0].includes(messageId));
    if (thread) return thread.messages.length - 1;
    else return 0;
  }

  /**
   * Used in HTML component to sort messages by date.
   */
  sortMessagesByDate() {
    if (this.messages) {
      this.messages.forEach((message) => {
        message.creationDate.toDate();
      });
    }
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
