import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { DialogAddDescriptionComponent } from '../dialog-add-description/dialog-add-description.component';
import { MatDialog } from '@angular/material/dialog';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill/public-api';
import 'quill-emoji/dist/quill-emoji.js';
import { SearchService } from 'src/app/shared/services/search.service';
import { Observable, Subscription, combineLatest } from 'rxjs';

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
import { ActivatedRoute } from '@angular/router';
import { DialogAddPeopleComponent } from '../dialog-add-people/dialog-add-people.component';
import { DialogViewPeopleComponent } from '../dialog-view-people/dialog-view-people.component';


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

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

  // Variables
  allUsers$!: Observable<User[]>;
  users!: User[];
  threads!: Thread[];
  messages!: Message[];
  allChannels$!: Observable<Channel[]>;
  activeChannel!: Channel;
  activeChannelId!: string;
  placeholder = 'Type your message here...';
  searchResults!: string[];

  data$ = combineLatest([this.channelService.allChannels$, this.userService.users$]);

  // Subscriptions
  searchSub!: Subscription;
  paramsSub!: Subscription;
  usersSub!: Subscription;
  channelSub!: Subscription;


  constructor(
    public dialog: MatDialog,
    private messageService: MessageService,
    private threadService: ThreadService,
    private channelService: ChannelService,
    private userService: UserService,
    private route: ActivatedRoute,
    private searchService: SearchService,
  ) { }


  ngOnInit(): void {
    console.log('ChannelComponent initialized');
    this.loadUsers();
    this.loadActiveChannel();
    this.handleSearchbar();
  }

  /**
   * To avoid memory leaks, unsubscribe from all subscriptions on destruction of the component.
   */
  ngOnDestroy(): void {
    console.log('ChannelComponent destroyed');
    this.searchSub.unsubscribe();
    this.paramsSub.unsubscribe();
    this.usersSub.unsubscribe();
    this.channelSub.unsubscribe();
  }

  /**
   * Calls the channelService to load the active channel via the route params.
   * Is destroyed on component destruction.
   */
  async loadActiveChannel() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.activeChannelId = params['id'];

      if (this.isActiveChannelInCache(params['id'])) {
        this.loadChannelFromCache();
        return;
      } else {
        this.loadChannelFromFirestore(params['id']);
      }
    });
  }


  loadChannelFromFirestore(channelId: string) {
    console.log('loadChannelFromFirestore');
    this.clearCache(); // Clear the cache.
    localStorage.setItem('activeChannelId', channelId); // Cache the active channelId.

    this.allChannels$ = this.channelService.allChannels$;

    this.channelSub = this.allChannels$.subscribe(channels => {
      let channel = channels.filter(channel => channel.channelId === channelId)[0];
      if (channel) {
        this.activeChannel = channel;
        localStorage.setItem('activeChannel', JSON.stringify(channel)); // Cache the active channel object.
        this.activeChannel.threads.length > 0 ? this.loadThreads() : this.setEmptyCache();
      }
    });
  }


  setEmptyCache() {
    this.threads = [];
    this.messages = [];
    localStorage.setItem('activeChannelThreads', JSON.stringify(this.threads));
    localStorage.setItem('activeChannelMessages', JSON.stringify(this.messages))
  }


  clearCache() {
    localStorage.removeItem('activeChannel');
    localStorage.removeItem('activeChannelId');
    localStorage.removeItem('activeChannelThreads');
    localStorage.removeItem('activeChannelMessages');
  }

  /**
  * Load all threads of the active channel.
  */
  loadThreads() {
    this.threadService.loadChannelThreads(this.activeChannel.threads).then((querySnapshot) => {
      this.threads = querySnapshot.docs.map((doc) => {
        return doc.data() as Thread;
      });
      localStorage.setItem('activeChannelThreads', JSON.stringify(this.threads)); // Cache the active channel threads.
      this.loadMessages(); // After the threads are loaded, load the messages.
    });
  }

  /**
   * Load all messages of the active channel once.
   */
  loadMessages() {
    let messageIds = this.threads.map(thread => thread.messages[0]).flat();
    this.messageService.loadThreadMessages(messageIds).then((querySnapshot) => {
      this.messages = querySnapshot.docs.map((doc) => {
        return doc.data() as Message;
      });
      this.messages.sort((a, b) => a.creationDate.seconds - b.creationDate.seconds);
      localStorage.setItem('activeChannelMessages', JSON.stringify(this.messages)); // Cache the active channel messages.
    });
  }


  isActiveChannelInCache(channelId: string) {
    return localStorage.getItem('activeChannelId') === channelId;
  }

  /**
   * Gets activeChannel, its threads and messages from localStorage.
   * Dates are converted to Timestamps, because they are not stored as Timestamps in localStorage
   * which causes errors with the date pipe in the HTML component.
   */
  loadChannelFromCache() {
    console.log('loadChannelFromCache');
    let channel = JSON.parse(localStorage.getItem('activeChannel') || '{}') as Channel;
    channel.creationDate = new Timestamp(channel.creationDate.seconds, channel.creationDate.nanoseconds);
    this.activeChannel = channel;
    this.allChannels$ = new Observable<Channel[]>((observer) => {
      observer.next([channel]);
    });
    if (this.activeChannel.threads.length > 0) {
      this.threads = JSON.parse(localStorage.getItem('activeChannelThreads') || '{}') as Thread[];
      let messages = JSON.parse(localStorage.getItem('activeChannelMessages') || '{}') as Message[];
      this.messages = messages.map((message) => {
        message.creationDate = new Timestamp(message.creationDate.seconds, message.creationDate.nanoseconds);
        return message;
      });
    } else {
      this.threads = [];
      this.messages = [];
    }
  }

  /**
   * @returns the displayName of the creator of the active channel.
   */
  getCreator(channel: Channel) {
    return this.users.find(user => user.userId === channel.creatorId)?.displayName;
  }


  getMembers(channel: Channel) {
    return this.users.filter(user => channel.members.includes(user.userId));
  }


  loadUsers() {
    this.usersSub = this.userService.users$.subscribe((users: User[]) => {
      this.users = users;
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

  /**
   * Filles collectedContent with the current content in the editor.
   * @param event
   */
  async collectContent(event: EditorChangeContent | EditorChangeSelection) {
    event.event === 'text-change' ? this.collectedContent = event.html : null;
  }


  async sendMessage() {
    if (this.collectedContent != null && this.collectedContent != '') {
      let now = new Date().getTime() / 1000;
      let message = new Message('', this.loggedUser(), new Timestamp(now, 0), this.collectedContent);
      let messageId = await this.messageService.createMessage(message); // Create message
      let threadId = await this.threadService.createThread(messageId); // Create thread and add message
      await this.channelService.updateChannel(this.attachThreadToChannel(threadId)); // Update Channel
      this.loadThreads(); // Reload threads
      this.scrollDown(); // Scroll down to the latest message
    }
  }


  scrollDown() {
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }, 500);
  }

  /**
   * Attaches a thread to a copy of the active channel.
   * @param threadId as string.
   * @returns channel with the attached thread.
   */
  attachThreadToChannel(threadId: string) {
    console.log('attachThreadToChannel');
    console.log("threadID: ", threadId)
    this.activeChannel.threads.push(threadId);
    console.log("threadId added to CHannel: ", this.activeChannel)
    return this.activeChannel;
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


  getUserProfile(message: Message) {
    let user = this.users.find(user => user.userId === message.creatorId);
    return user?.profilePicture != '' ? user?.profilePicture : '/../../assets/img/profile.png';
  }


  getUserProfileAlt(index: number, channel: Channel) {
    let user = this.users.find(user => user.userId === channel.members[index]);
    return user?.profilePicture != '' ? user?.profilePicture : '/../../assets/img/profile.png';
  }


  /**
   * Opens the description dialog and subscribes to the dialog data
   * to update the channel description.
   */
  openDescriptionDialog() {
    const dialogRef = this.dialog.open(DialogAddDescriptionComponent);

    let sub = dialogRef.afterClosed().subscribe(async (dialogData) => {
      if (dialogData && dialogData.description) {
        this.updateDescription(dialogData.description);
      }
      sub.unsubscribe();
    });
  }


  /**
   * Calls the channelService to update the channel description.
   * @param dialogData as string.
   */
  updateDescription(dialogData: string) {
    this.activeChannel.description = dialogData;
    this.channelService.updateChannel(this.activeChannel);
  }


  openAddPeopleDialog() {
    const dialogRef = this.dialog.open(DialogAddPeopleComponent, {
      width: '350px',
      data: {
        people: this.activeChannel.members,
      }
    });

    let sub = dialogRef.afterClosed().subscribe(async (dialogData) => {
      if (dialogData && dialogData.people) {
        this.addPeople(dialogData.people);
      }
      sub.unsubscribe();
    });
  }


  addPeople(people: string[]) {
    people.forEach((person) => {
      let user = this.users.find(user => user.userId === person);
      if (user) {
        this.activeChannel.members.push(user.userId);
      }
    });
    this.channelService.updateChannel(this.activeChannel);
  }


  openViewPeopleDialog() {
    const dialogRef = this.dialog.open(DialogViewPeopleComponent, {
      width: '350px',
      data: {
        channel: this.activeChannel,
        users: this.users
      }
    });
  }


  openThread(message: Message) {
    return `/dashboard/thread/${this.threads.find(thread => thread.messages[0].includes(message.messageId))?.threadId}`;
  }


  handleSearchbar() {
    // Search filter (import from searchService)
    this.searchResults = this.searchService.getSearchResults();
    this.searchSub = this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
  }
}
