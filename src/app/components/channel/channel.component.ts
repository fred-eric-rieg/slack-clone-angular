import { Component, Input, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  form!: FormGroup;

  channels!: Channel[];
  users!: User[];
  threads!: Thread[];
  messages!: Message[];

  @Input() activeChannel!: Channel;
  userId = 'guest';
  creatorID = 'Rqrrqz1YfpZGRjI8Xm6TER1aS2r1';

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private threadService: ThreadService,
    private channelService: ChannelService,
    private userService: UserService
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
    this.channelService.channels.subscribe((channels: Channel[]) => {
      this.channels = channels;
      this.channels.forEach((channel: Channel) => {
        if (channel.channelId === this.activeChannel.channelId) {
          this.activeChannel = channel;
        }
      });
    });
  }


  loadUsers() {
    this.userService.users.subscribe((users: User[]) => {
      this.users = users;
    });
  }


  loadThreads() {
    this.threadService.threads.subscribe(threads => {
      this.threads = threads;
    });
  }


  loadMessages() {
    this.messageService.messages.subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }


  sendMessage() {
    let now = new Date().getTime() / 1000;
    let message = new Message('', this.userId, new Timestamp(now, 0), this.form.value.message);
    let messageId = this.messageService.createMessage(message);

    // Create thread and add it to the channel
    let threadId = this.threadService.createThread(messageId);
    this.channelService.addThreadToChannel(this.activeChannel, threadId);

    this.form.reset();
  }
}
