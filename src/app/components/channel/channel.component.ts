import { Component, OnDestroy, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

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
import { ActivatedRoute } from '@angular/router';


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

  private destroy$ = new Subject();

  constructor(
    private messageService: MessageService,
    private threadService: ThreadService,
    private channelService: ChannelService,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.loadActiveChannel();
    this.loadUsers();
  }

  /**
   * To avoid memory leaks, unsubscribe from all subscriptions on destruction of the component.
   */
  ngOnDestroy(): void {
    console.log('ChannelComponent destroyed');
    this.destroy$.next(true);
  }

  /**
   * Formatting a timestamp into a sting with the format: HH:MM AM/PM.
   * @param timestamp as Timestamp.
   * @returns a formatted date as string.
   */
  getFormattedDate(timestamp: Timestamp) {
    let date = new Date(timestamp.seconds * 1000);
    let hours = date.getHours() % 12 || 12;
    let minutes = date.getMinutes().toLocaleString();
    if (minutes.length == 1) {
      minutes = 0 + minutes;
    }
    return `${hours}:${minutes} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
  }

  /**
   * Calls the channelService to load the active channel via the route params.
   * Is destroyed on component destruction.
   */
  loadActiveChannel() {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.activeChannelId = params['id'];
      this.channelService.getChannel(this.activeChannelId).then((response) => {
        this.activeChannel = response.data() as Channel;
        this.loadThreads(); // After the active channel is loaded, load the threads.
      });
    });
  }


  loadUsers() {
    this.userService.users.pipe(
      takeUntil(this.destroy$)
    ).subscribe((users: User[]) => {
      this.users = users;
    });
  }

  /**
   * Subscribes to the threadService to load all threads and filters
   * the threads that are in the active channel.
   */
  loadThreads() {
    this.threadService.allThreads.pipe(
      takeUntil(this.destroy$)
    ).subscribe((threads: Thread[]) => {
      this.threads = threads.filter(thread => this.activeChannel.threads.includes(thread.threadId));
      this.loadMessages(); // After the threads are loaded, load the messages.
    });
  }

  /**
   * Subscribes to the messageService to load all messages and filters
   * the messages that are in the filtered threads.
   */
  loadMessages() {
    let messageIds = this.threads.map(thread => thread.messages[0]).flat();
    this.messageService.messages.pipe(
      takeUntil(this.destroy$)
    ).subscribe((messages: Message[]) => {
      messages = messages.filter(message => messageIds.includes(message.messageId));
      messages.sort((a, b) => a.creationDate.seconds - b.creationDate.seconds);
      this.messages = messages;
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
   * Filles collectedContent with the current content in the editor.
   * @param event 
   */
  async collectContent(event: EditorChangeContent | EditorChangeSelection) {
    console.log(event);
    if (event.event === 'text-change') {
      this.collectedContent = event.html;
    }
    console.log(event.event)
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


  countThreadMessages(messageId: string) {
    let counter;
    this.threads.forEach(thread => {
      counter = 0;
      if (thread.messages[0].includes(messageId)) {
        thread.messages.length == 1 ? null : counter = thread.messages.length;
      }
    });
    return counter;
  }


  // TODO: This function shall sort the messages by dates and cluster them by days.
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
}
