import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { getAuth } from '@angular/fire/auth';

// Models
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { Channel } from 'src/models/channel.class';
import { Thread } from 'src/models/thread.class';

// Services + Subscription
import { UserService } from 'src/app/shared/services/user.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { ThreadService } from 'src/app/shared/services/thread.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';


@Component({
  selector: 'app-channel-threads',
  templateUrl: './sidenav-threads.component.html',
  styleUrls: ['./sidenav-threads.component.scss']
})
export class SidenavThreadsComponent implements OnInit, OnDestroy {

  activeUser!: User;

  // Quill editor content
  collectedContent!: any;

  // Quill editor config
  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['emoji'],
      ['link'],
      ['image'],
    ],
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
    keyboard: {
      bindings: {
        short_enter: {
          key: 13,
          shortKey: true,
          handler: () => {
            this.sendMessage();
          },
        },
      },
    },
  };

  placeholder = 'Write a message...';

  searchResults!: string[];

  // Subscriptions
  searchSub!: Subscription;


  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private threadService: ThreadService,
    private messageService: MessageService,
    private channelService: ChannelService,
  ) {}


  ngOnInit(): void {
    // Loading the logged user
    this.userService.getSingleUserSnapshot(this.loggedUser()).then((onSnapshot) => {
      this.activeUser = onSnapshot.data() as User;
    });
    // Search filter (import from searchService)
    this.searchResults = this.searchService.getSearchResults();
    this.searchSub = this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
  }


  ngOnDestroy(): void {
    console.log('ThreadComponent destroyed');
  }


  async loadThread() {
   
  }


  async loadMessages() {
    
  }


  /**
   * Returns either the logged user or a default user id.
   * @returns the logged user id.
   */
  loggedUser() {
    const auth = getAuth();
    if (auth.currentUser) {
      return auth.currentUser.uid;
    } else {
      return 'Zta41sUcC7rLGHbpMmn4';
    }
  }


  sendMessage() {

  }

  /**
   * Filles collectedContent with the current content in the editor.
   * @param event
   */
  async collectContent(event: EditorChangeContent | EditorChangeSelection) {
    event.event === 'text-change' ? this.collectedContent = event.html : null;
  }
}
