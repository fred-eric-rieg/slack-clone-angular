import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { getAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

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


@Component({
  selector: 'app-channel-threads',
  templateUrl: './channel-threads.component.html',
  styleUrls: ['./channel-threads.component.scss']
})
export class ChannelThreadsComponent implements OnInit, OnDestroy {
  user = new User();
  users: User[] = [];
  allUsers!: User[];

  thread!: Thread;
  threadId!: string;
  allThreads!: Thread[];

  messageIds!: string[];
  messages!: Message[];
  channel!: Channel;

  searchResults!: string[];

  // Subscriptions
  paramsSub!: Subscription;
  usersSub!: Subscription;
  searchSub!: Subscription;


  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private threadService: ThreadService,
    private messageService: MessageService,
    private channelService: ChannelService,
    private route: ActivatedRoute,
  ) {
    // Get snapshot of all users.
    this.usersSub = this.userService.allUsers$.subscribe((users: User[]) => {
      this.allUsers = users;
    });
  }


  ngOnInit(): void {
    // Loading the logged user
    this.userService.getSingleUserSnapshot(this.loggedUser()).then((onSnapshot) => {
      this.users.push(onSnapshot.data() as User);
    });

    this.paramsSub = this.route.params.subscribe(async (params) => {
      if (params['id']) {
        this.threadId = params['id'];

        // Loading the channel
        this.channel = this.channelService.getChannelViaThread(params['id']);

        this.loadThread(params['id']);
      }
    });

      // Search filter (import from searchService)
      this.searchResults = this.searchService.getSearchResults();
      this.searchSub = this.searchService.searchResultsChanged.subscribe((results: string[]) => {
        this.searchResults = results;
      });
  }


  ngOnDestroy(): void {
    console.log('ThreadComponent destroyed');
    this.paramsSub.unsubscribe();
  }


  async loadThread(threadId: string) {
    console.log('Loading thread:', threadId);

    this.threadService.loadChannelThreads([threadId]).then(thread => {
      this.thread = thread.docs[0].data() as Thread;
      this.messageIds = thread.docs[0].data()['messages'];

      this.loadMessages();
    });
  }


  async loadMessages() {
    console.log('Loading messages:', this.messageIds);

    this.messageService.loadThreadMessages(this.messageIds).then((querySnapshot) => {
      /**this.messages = querySnapshot.docs.map((doc) => {
        return doc.data() as Message;
      });*/
      this.messages.sort((a, b) => a.creationDate.seconds - b.creationDate.seconds);

      // Loading all users in the thread
      this.userService.getAllUsersThreadSnapshot(this.messages.map(message => message.creatorId)).then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          this.users.push(doc.data() as User);
        });
      });
    });
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
