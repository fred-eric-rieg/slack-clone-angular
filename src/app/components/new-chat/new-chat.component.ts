import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss']
})
export class NewChatComponent {
  allUsers: Array<any> = [];
  addedUsers: Array<any> = [];

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private snackBar: MatSnackBar,
  ){
    this.getAllUsers();
  }

  /**
   * Get all users of 'users' document in firestore and
   * push whole Object to 'allUsers'
   */
  getAllUsers(){
    this.userService.users.subscribe(data => {
      this.allUsers = this.removeCurrentUser(data);
    });
  }

  /** compare all users with current user and
   * remove it from array
    */
  removeCurrentUser(allUsers: any){
    const currentUser = this.userService.currentUser;
    let newAllUsers: Array<any> = [];
    allUsers.forEach((e: any) => {
      if (currentUser != e.userId){
        newAllUsers.push(e);
      }
    });
    return newAllUsers;
  }

  /**
   * get data as Object of specific user and filter duplicates
   * @param userId input id of user as string
   */
  addUser(userId: string){
    this.userService.get(userId).pipe(take(1)).subscribe(data => {
      this.filterDuplicates(data);
    })
  }

  /**
   * filter duplicates in addedUsers Array 
   * @param user input as a Object
   */
  filterDuplicates(user: any){
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
  createNewChat(users: any){
    if (users.length >= 1){
      const chatId = this.generateRandomId();
      this.chatService.updateUserChatData(chatId);
      this.chatService.setChatData(chatId, users);
    } else this.snackBar.open("Add atleast one member to chat", "OK", {
      duration: 5000,
    });
  }

  /** removes user in html of already added users 
   * based on index of addedUsers array */
  removeUser(userIndex: number){
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