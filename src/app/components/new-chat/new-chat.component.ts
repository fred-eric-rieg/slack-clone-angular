import { Component } from '@angular/core';
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
  addedUsersId: Array<any> = [];
  userNames: Array<string> = [];

  constructor(
    private userService: UserService,
    private chatService: ChatService,
  ){
    this.getAllUsers();
  }

  /**
   * Get all users of 'users' document in firestore and
   * push whole Object to 'allUsers'
   */
  getAllUsers(){
    this.userService.returnAllUsers().subscribe(data => {
      this.allUsers = data;
    });
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

  createNewChat(users: any){
    console.log(users);
    const chatId = this.generateRandomId();
    this.chatService.updateUserChatData(chatId);
    this.chatService.setChatData(chatId, users);
  }


  
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
