import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';


import { Timestamp } from '@angular/fire/firestore';
import { DialogAddDescriptionComponent } from '../dialog-add-description/dialog-add-description.component';
import { MatDialog } from '@angular/material/dialog';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill/public-api';
import 'quill-emoji/dist/quill-emoji.js';

// Models
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';

// Services
import { MessageService } from 'src/app/shared/services/message.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { ThreadService } from 'src/app/shared/services/thread.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Channel } from 'src/models/channel.class';
import { Thread } from 'src/models/thread.class';
import { getAuth } from '@angular/fire/auth';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogAddPeopleComponent } from '../dialog-add-people/dialog-add-people.component';
import { DialogViewPeopleComponent } from '../dialog-view-people/dialog-view-people.component';


@Component({
  selector: 'app-channel-threads',
  templateUrl: './channel-threads.component.html',
  styleUrls: ['./channel-threads.component.scss']
})
export class ChannelThreadsComponent implements OnInit {
  
  searchResults!: string[];
  messages!: Message[];


  constructor(
    private searchService: SearchService,
  ) { }

  ngOnInit(): void {
    // Search filter (import from searchService)
    this.searchResults = this.searchService.getSearchResults();
    this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
  }
}

