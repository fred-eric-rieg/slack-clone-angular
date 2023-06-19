import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/models/message.class';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/models/user.class';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { Timestamp } from '@angular/fire/firestore';


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

  user!: User;
  channels!: any;
  channelId = 'twJAVM7WFrGQvkib9jrQ';

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private channelService: ChannelService
  ) {

  }


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      message: ['', [Validators.required]]
    });
    this.channelService.channels.subscribe(channels => {
      this.channels = channels;
    });
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


  sendMessage() {
    console.log('Send message');
    let now = new Date().getTime() / 1000;
    let message = { creator: 'Guest_id', firstName: 'Guest', id: `message${this.channels[0].messages.length + 1}`, lastName: '', text: this.form.value.message, timestamp: new Timestamp(now, 0) };
    this.channelService.saveMessage(message, this.channels[0]);
    console.log(message);
    this.form.reset();
  }
}
