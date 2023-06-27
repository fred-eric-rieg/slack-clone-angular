import { Component, OnInit } from '@angular/core';
import { CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-direct-messages-section',
  templateUrl: './direct-messages-section.component.html',
  styleUrls: ['./direct-messages-section.component.scss']
})
export class DirectMessagesSectionComponent implements OnInit {
  collapsed: boolean = false;
  chatsColl!: CollectionReference;
  chats$!: Observable<DocumentData[]>;
  chats: Array<string> = [];
  currentUserId: any;

  constructor(
    private userServive: UserService,
    public chatService: ChatService,
  ) {
    this.currentUserId = this.userServive.currentUser;
    // this.getCurrentUserChats();
  }

  async ngOnInit(): Promise<void> {
    await this.getCurrentUserId();
    await this.getCurrentUserChats();
  }

  /**
   * Get current logged in user id from UserServie
   */
  async getCurrentUserId() {
    await this.userServive.getCurrentUser()
      .then((currentUserId) => {
        this.currentUserId = currentUserId;
      })
  }

  getUserChatData() {
    this.chatService.returnUserChatData(this.currentUserId)
    .subscribe(data => {
      console.log(data);

    });
  }

  async getCurrentUserChats() {
    await this.chatService.getUserChatData(this.currentUserId)
      .then((chatIds: any) => {
        this.chats = chatIds;
      });
  }

  toggleDropdown() {
    this.collapsed = !this.collapsed;
  }

}
