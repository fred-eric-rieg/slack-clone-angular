import { Component, OnDestroy, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { DialogAddDescriptionComponent } from '../dialog-add-description/dialog-add-description.component';
import { MatDialog } from '@angular/material/dialog';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill/public-api';
import 'quill-emoji/dist/quill-emoji.js';
import { SearchService } from 'src/app/shared/services/search.service';
import { Subscription } from 'rxjs';

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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogAddPeopleComponent } from '../dialog-add-people/dialog-add-people.component';
import { DialogViewPeopleComponent } from '../dialog-view-people/dialog-view-people.component';


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy {

  collectedContent!: any;

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

  channels!: Channel[];
  users!: User[];
  threads!: Thread[];
  messages!: Message[];

  activeChannelId!: string;
  activeChannel!: Channel;
  placeholder = 'Type your message here...';
  searchResults!: string[];

  // Subscriptions
  searchSub!: Subscription;
  paramsSub!: Subscription;
  usersSub!: Subscription;


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
    this.loadActiveChannel();
    this.loadUsers();
    this.handleSearchbar();
  }


  /**
   * To avoid memory leaks, unsubscribe from all subscriptions on destruction of the component.
   */
  ngOnDestroy(): void {
    console.log('ChannelComponent destroyed');
    this.searchSub.unsubscribe();
    this.usersSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }


  handleSearchbar() {
    // Search filter (import from searchService)
    this.searchResults = this.searchService.getSearchResults();
    this.searchSub = this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
  }

  /**
   * Calls the channelService to load the active channel via the route params.
   * Is destroyed on component destruction.
   */
  loadActiveChannel() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.activeChannelId = params['id'];
      this.channelService.getChannel(this.activeChannelId).then((response) => {
        this.activeChannel = response.data() as Channel;
        this.loadThreads(); // After the active channel is loaded, load the threads.
      });
    });
  }

  /**
  * Load all threads of the active channel once.
  */
  loadThreads() {
    this.threadService.loadChannelThreads(this.activeChannel.threads).then((querySnapshot) => {
      this.threads = querySnapshot.docs.map((doc) => {
        return doc.data() as Thread;
      });
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
    });
  }

  /**
   * @returns the displayName of the creator of the active channel.
   */
  getCreator() {
    if (!this.users) return;
    return this.users.find(user => user.userId === this.activeChannel.creatorId)?.displayName;
  }


  getMembers() {
    if (!this.users) return "";
    return this.users.filter(user => this.activeChannel.members.includes(user.userId));
  }


  loadUsers() {
    this.usersSub = this.userService.users.subscribe((users: User[]) => {
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


  sendMessage() {
    if (this.collectedContent != null && this.collectedContent != '') {
      let now = new Date().getTime() / 1000;
      let message = new Message('', this.loggedUser(), new Timestamp(now, 0), this.collectedContent);
      let messageId = this.messageService.createMessage(message); // Create message
      let threadId = this.threadService.createThread(messageId); // Create thread and add message
      this.channelService.addThreadToChannel(this.activeChannel, threadId); // Add thread to channel
    }
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


  getUserProfileAlt(index: number) {
    let user = this.users.find(user => user.userId === this.activeChannel.members[index]);
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
}
