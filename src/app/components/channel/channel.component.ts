import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Mdels
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


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  channels!: Channel[];
  users!: User[];
  threads!: Thread[];
  messages!: Message[];

  @Input() activeChannel!: Channel;

  private destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private threadService: ThreadService,
    private channelService: ChannelService,
    private userService: UserService,
  ) { }


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      message: ['', [Validators.required]]
    });
    this.loadThreads();
    this.loadUsers();
    this.loadMessages();
    this.loadActiveChannel();
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


  loadActiveChannel() {
    this.channelService.channels.pipe(
      takeUntil(this.destroy$)
    ).subscribe((channels: Channel[]) => {
      this.channels = channels;
      this.channels.forEach((channel: Channel) => {
        if (channel.channelId === this.activeChannel.channelId) {
          this.activeChannel = channel;
        }
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


  loadThreads() {
    this.threadService.threads.pipe(
      takeUntil(this.destroy$)
    ).subscribe(threads => {
      this.threads = threads;
    });
  }


  loadMessages() {
    this.messageService.messages.pipe(
      takeUntil(this.destroy$)
    ).subscribe((messages: Message[]) => {
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


  sendMessage() {
    let now = new Date().getTime() / 1000;
    let message = new Message('', this.loggedUser(), new Timestamp(now, 0), this.form.value.message);
    let messageId = this.messageService.createMessage(message);

    // Create thread and add it to the channel
    let threadId = this.threadService.createThread(messageId);
    this.channelService.addThreadToChannel(this.activeChannel, threadId);

    this.form.reset();
  }
}
