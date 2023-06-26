import { Component } from '@angular/core';
import { take } from 'rxjs';
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


  // ENDE
}
