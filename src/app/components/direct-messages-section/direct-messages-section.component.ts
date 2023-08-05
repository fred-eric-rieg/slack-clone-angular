import { Component, OnInit } from '@angular/core';
import { CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable, Subscription, take } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/models/user.class';


@Component({
  selector: 'app-direct-messages-section',
  templateUrl: './direct-messages-section.component.html',
  styleUrls: ['./direct-messages-section.component.scss']
})
export class DirectMessagesSectionComponent implements OnInit {
  allUsers: User[] = [];
  collapsed: boolean = false;
  chatIds: Array<string> = [];
  currentUserId: any;
  allChats: any[] = [];
  threads: any = [];

  // Subscriptions
  chatSub!: Subscription;
  userSub!: Subscription;

  constructor(
    private userService: UserService,
    public chatService: ChatService,
  ) {
    //this.currentUserId = this.userService.currentUser;
    // this.getCurrentUserChats();
  }

  async ngOnInit(): Promise<void> {
    this.allUsers = await this.getAllUsers();
    await this.getCurrentUserId();
    await this.getCurrentUserChats();
  }


  ngOnDestroy(): void {
    this.chatSub.unsubscribe();
    if (this.userSub != undefined) {
      this.userSub.unsubscribe();
    }
  }

  async getAllUsers() {
    const allUsers: any = [];
    const qSnap = await this.userService.getAllUsersSnapshot();
    qSnap.forEach((doc) => {
      allUsers.push(doc.data());
    });
    return allUsers;
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
  
  async getCurrentUserChats() {
    this.chatSub = this.chatService.returnCurrentUserChats(this.currentUserId)
    .subscribe(snap => {
      this.chatIds = snap.get('chatIds');
      this.getChatDataById(this.chatIds);
    })
  }

  /////////////////////////////////////////////////////////////////////////////////


  async getChatDataById(chatIds: Array<string>) {
    this.allChats = [];
    if (chatIds != undefined) {
      chatIds.forEach(async (chatId: string) => {
        const chatData: any = await this.chatService.returnQueryChatData(chatId);
        this.allChats.push(chatData);
      })
      //await this.setNameFirstUser();
    }
  }

  setNameFirstUser(memberId: string) {
    let name: string = '';
    this.allUsers.forEach((user: any) => {
      if (user.userId === memberId[0]) {
        name = user.displayName
      }
    });
    return name;
  }

  /**
   * get the profile picture of the user
   * @param userId as string
   * @returns the profile image url of the user
   */
  getChatUserImage(memberId: string) {
    let img = '';
    this.allUsers.forEach((user: any) => {
      if (user.userId === memberId[0]) {
        img = user.profilePicture
      }
    });
    return img;
  }

  toggleDropdown() {
    this.collapsed = !this.collapsed;
  }

}
