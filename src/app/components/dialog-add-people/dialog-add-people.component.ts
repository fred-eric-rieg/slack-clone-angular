import { Component, Inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { UserService } from 'src/app/shared/services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-people',
  templateUrl: './dialog-add-people.component.html',
  styleUrls: ['./dialog-add-people.component.scss']
})
export class DialogAddPeopleComponent {

  dialogData = {
    people: [""],
  };

  users!: User[];


  constructor(private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.userService.getAllUsersNotObservable().then((querySnapshot) => {
      this.users = querySnapshot.docs.map(doc => {
        return doc.data() as User;
      });
      let filteredUsers: User[] = [];
      this.users.forEach(user => {
        !this.data.people.includes(user.userId) ? filteredUsers.push(user) : null;
      });
      this.users = filteredUsers;
    });
  }
}
