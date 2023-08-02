import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, take } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss']
})
export class NewChatComponent implements OnDestroy {
  allUsers: Array<any> = [];
  addedUsers: Array<any> = [];

  // Subscriptions
  userSub!: Subscription;
  userSub2!: Subscription;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private snackBar: MatSnackBar,
  ) {
    this.getAllUsers();
  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.userSub2.unsubscribe();
  }

  /**
   * Get all users of 'users' document in firestore and
   * push whole Object to 'allUsers'
   */
  getAllUsers() {
    this.userSub = this.userService.users$.subscribe(data => {
      this.allUsers = this.removeCurrentUser(data);
    });
  }

  /** compare all users with current user and
   * remove it from array
    */
  removeCurrentUser(allUsers: any) {
    const currentUser = this.userService.currentUser;
    let newAllUsers: Array<any> = [];
    allUsers.forEach((e: any) => {
      if (currentUser != e.userId) {
        newAllUsers.push(e);
      }
    });
    return newAllUsers;
  }

  /**
   * get data as Object of specific user and filter duplicates
   * @param userId input id of user as string
   */
  addUser(userId: string) {
    this.userSub2 = this.userService.get(userId).pipe(take(1)).subscribe(data => {
      if (this.addedUsers.length < 5) {
        this.filterDuplicates(data);
      } else this.snackBar.open("Limit of chat members reached. (max 5)", "OK", {
        duration: 5000,
      })
    })
  }

  /**
   * filter duplicates in addedUsers Array 
   * @param user input as a Object
   */
  filterDuplicates(user: any) {
    this.addedUsers.push(user);
    this.addedUsers = this.addedUsers.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.userId === value.userId
      )))
  }

  /**
   * create a new chat with all added users
   * @param users added Users as Object
   */
  async createNewChat(users: any) {
    const userExists = await this.checkCurrentUserChats();
    if (users.length >= 1) {
      const chatId = this.generateRandomId();
      if (userExists === true){
        this.chatService.updateUserChatData(chatId);
      } else this.chatService.setUserChatData(chatId);
      this.chatService.setChatData(chatId, users);
      this.addedUsers = [];
    } else this.snackBar.open("Add atleast one member to chat", "OK", {
      duration: 5000,
    });
  }

  /** get all userChat IDs and compare with current user
   * @returns true - if currentUser has already a doc
   */
  async checkCurrentUserChats() {
    const chatIds = await this.chatService.returnUserChatIds();
    const currentUser = this.userService.currentUser;
    return chatIds.includes(currentUser);
  }

  /** removes user in html of already added users 
   * based on index of addedUsers array */
  removeUser(userIndex: number) {
    this.addedUsers.splice(userIndex, 1);
  }


  /** Generate a random ID with 20 chars
   * @returns string
   */
  generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
    return randomId;
  }
}