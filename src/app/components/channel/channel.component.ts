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

  @Input() positionX!: number;
  movable: boolean = false;
  width = 350;

  form!: FormGroup;

  channels!: Channel[];
  users!: User[];
  threads!: Thread[];
  activeChannelId = 'twJAVM7WFrGQvkib9jrQ';
  activeChannel!: Channel;
  userId = 'guest';
  creatorID = 'Rqrrqz1YfpZGRjI8Xm6TER1aS2r1';
  public user!: User;

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

  /**
   * Set the movable property to true or false whenever the user clicks on the right vertical channel bar
   * for resizing the channel.
   */
  setMovable() {
    console.log(this.width)
    if (this.movable) {
      this.movable = false;
    } else {
      this.movable = true;
    }
    this.moveBar();
  }

  /**
   * Move the channel bar to the right or left depending on the mouse position on the dashboard.
   */
  moveBar() {
    if (this.movable) {
      this.width = this.positionX - 327;
      setTimeout(() => {
        this.moveBar();
      }, 50);
    } else {
      // Nothing yet
    }
  }


  loadActiveChannel() {
    this.channelService.channels.subscribe((channels: Channel[]) => {
      this.channels = channels;
      this.channels.forEach((channel: Channel) => {
        if (channel.channelId === this.activeChannelId) {
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


  sendMessage(channelId: string) {
    let now = new Date().getTime() / 1000;
    let message = new Message('', this.userId, new Timestamp(now, 0), this.form.value.message);
    let messageId = this.messageService.createMessage(message);

    // Create thread and add it to the channel
    let threadId = this.threadService.createThread(messageId);
    this.channelService.addThreadToChannel(this.activeChannel, threadId);

    this.form.reset();
  }
}
