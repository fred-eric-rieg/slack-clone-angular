import { Component, Input } from '@angular/core';
import { Message } from 'src/models/message.class';
import { Thread } from 'src/models/thread.class';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {

  @Input() users!: User[];
  @Input() message!: Message;
  @Input() thread!: Thread;


  constructor(
  ) { }

  /**
   * Used in HTML component.
   * @param messageId as string.
   * @returns number of messages in a thread.
   */
  countThreadMessages(thread: Thread) {
    return thread.messages.length - 1;
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