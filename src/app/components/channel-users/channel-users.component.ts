import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.class';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-channel-users',
  templateUrl: './channel-users.component.html',
  styleUrls: ['./channel-users.component.scss']
})
export class ChannelUsersComponent implements OnInit {
  user = new User();
  user$!: Observable<any>;
  allUsers: any[] = [];
  searchResults!: string[];

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private searchService: SearchService,
  ) {

    // Fetch all users from the UserService and subscribe to the data.
    this.userService.getAllUsers().subscribe((users: any[]) => {
      this.allUsers = users;
      // Do any additional processing here, if required.
    });
  }


  ngOnInit(): void {
    // Search filter (import from searchService)
    this.searchResults = this.searchService.getSearchResults();
    this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
  }
}
