import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';
import { Subscription } from 'rxjs';
import { User } from 'src/models/user.class';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-channel-users',
  templateUrl: './channel-users.component.html',
  styleUrls: ['./channel-users.component.scss']
})
export class ChannelUsersComponent implements OnInit, OnDestroy {

  user = new User();
  allUsers: User[] = [];
  searchResults!: string[];

  // Subscriptions
  usersSub!: Subscription;
  searchSub!: Subscription;


  constructor(
    private userService: UserService,
    private searchService: SearchService
  ) {
    // Get snapshot of all users.
    this.usersSub = this.userService.users.subscribe((users: User[]) => {
      this.allUsers = users;
    });
  }


  ngOnInit(): void {
    // Search filter (import from searchService)
    this.searchResults = this.searchService.getSearchResults();
    this.searchSub = this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
  }


  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
    this.searchSub.unsubscribe();
  }

}
