import { Component, OnInit } from '@angular/core';
import { CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable, take } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Chat } from 'src/models/chat.class';


@Component({
  selector: 'app-direct-messages-section',
  templateUrl: './direct-messages-section.component.html',
  styleUrls: ['./direct-messages-section.component.scss']
})
export class DirectMessagesSectionComponent implements OnInit {
  collapsed: boolean = false;
  chatIds: Array<string> = [];
  currentUserId: any;
  allChats: any[] = [];

  creationDate: any = [];
  memberIds: any = [];
  memberNames: any = [];
  threads: any = [];


  constructor(
    private userService: UserService,
    public chatService: ChatService,
  ) {
    this.currentUserId = this.userService.currentUser;
    // this.getCurrentUserChats();
  }

  async ngOnInit(): Promise<void> {
    await this.getCurrentUserId();
    this.getCurrentUserChats();
    this.setNameFirstUser();
  }

  /**
   * Get current logged in user id from UserServie
   */
  async getCurrentUserId() {
    await this.userService.getCurrentUser()
      .then((currentUserId) => {
        this.currentUserId = currentUserId;
      })
  }

  getCurrentUserChats() {
    this.chatService.returnCurrentUserChats(this.currentUserId)
      .subscribe(snap => {
        this.chatIds = snap.get('chatIds');
        this.getChatDataById(this.chatIds);

      })
  }

  getChatDataById(chatIds: Array<string>) {
    chatIds.forEach(chatId => {
      const data = this.chatService.returnChatData(chatId);
      data
      .pipe(take(1))
      .subscribe(chat => {
        this.creationDate.push(chat['creationDate']);
        this.memberIds.push(chat['members']);
        this.threads.push(chat['threads']);
      })
    })
  }

  setNameFirstUser(){
    setTimeout(() => {
      this.memberIds.forEach((user: any) => {
        this.userService.getUserData(user[0])
          .pipe(take(1))
          .subscribe((user) => {
            this.memberNames.push(user['displayName']);
          })
      })
    }, 600)
  }

  test(){
    this.userService.getUserData(this.currentUserId)
        .subscribe(name => {
          // console.log(name);
        })
  }

  toggleDropdown() {
    this.collapsed = !this.collapsed;
  }

}
