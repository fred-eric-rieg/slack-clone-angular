import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-direct-message-channel',
  templateUrl: './direct-message-channel.component.html',
  styleUrls: ['./direct-message-channel.component.scss']
})
export class DirectMessageChannelComponent implements OnInit {
  chatId: string = '';
  memberIds: Array<string> = [];
  members: Array<string> = [];
  threads: any = [];

  test = [1, 2];

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.chatId = params['id'];
      this.chatService.returnChatData(this.chatId).subscribe(data => {
        this.memberIds.push(...data['members']);
        this.threads.push(...data['threads']);
      })
    })
    this.getMemberNames();
  }

  getMemberNames(){
    setTimeout(() => {
      this.memberIds.forEach((user: any) => {
        this.userService.getUserData(user)
        .pipe(take(1))
          .subscribe((user) => {
            this.members.push(user['displayName']);
            console.log(this.members);
          })
      })
      console.log(this.members);
      this.members.shift();
    }, 600)
  }

  sendMessage() {
    console.log(this.chatId);
    console.log(this.memberIds);
  }
}