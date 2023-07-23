import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { CollectionReference, DocumentData, Firestore, Timestamp, collection, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { take } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Channel } from 'src/models/channel.class';
import { Chat } from 'src/models/chat.class';
import { Message } from 'src/models/message.class';

@Component({
  selector: 'app-direct-message-channel',
  templateUrl: './direct-message-channel.component.html',
  styleUrls: ['./direct-message-channel.component.scss']
})
export class DirectMessageChannelComponent implements OnInit {
  private msgCollection!: CollectionReference<DocumentData>;
  chatId: string = '';
  memberIds: Array<string> = [];
  members: Array<string> = [];
  messageIds: any = [];
  messages: Array<any> = [];
  
  collectedContent!: any;
  placeholder = 'Type your message here...';
  
  test = [1, 2];
  
  chatObj = {
    chatId: "",
    creationDate: Timestamp.now(),
    members: [],
    messages: [],
  };

  chat = new Chat(this.chatObj);
  
  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['emoji'],
      ['link'],
      ['image'],
    ],
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
    keyboard: {
      bindings: {
        short_enter: {
          key: 13,
          shortKey: true,
          handler: () => {
            this.sendMessage();
          },
        },
      },
    },
  };

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService,
    private messageService: MessageService,
    private fs: Firestore
  ) {
    this.msgCollection = collection(this.fs, 'messages');
   }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.chatId = params['id'];
      this.chat.chatId = this.chatId;
      this.chatService.returnChatData(this.chatId).subscribe(data => {
        this.memberIds.push(...data['members']);
        this.messageIds.push(...data['messages']);
        this.chat.members.push(...data['members']);
      })
    })
    this.getMemberNames();
    this.getAllMessages();
    console.log(this.messages);
  }


  /**
   * get all members of the chat
   * and push them into the members array
   */
  getMemberNames(){
    setTimeout(() => {
      this.memberIds.forEach((user: any) => {
        this.userService.getUserData(user)
        .pipe(take(1))
          .subscribe((user) => {
            this.members.push(user['displayName']);
          })
      })
      this.members.shift();
    }, 600)
  }

  async getAllMessages(){
     const querySnapshot = await getDocs(this.msgCollection);
     querySnapshot.forEach((doc) => {
      this.messages.push(doc.data());
    })
    console.log("2::::::",this.messages);

  }

  sendMessage() {
    // console.log(this.chat.chatId);
    console.log(this.memberIds);
    if (this.collectedContent != null && this.collectedContent != '') {
      let now = new Date().getTime() / 1000;
      let message = new Message('', this.loggedUser(), new Timestamp(now, 0), this.collectedContent);
      let messageId = this.messageService.createMessage(message);// Create thread and add message
      this.chatService.addMessageToChat(this.chat, messageId);
    }
  }

   /**
   * Returns either the logged user or a default user id.
   * @returns the logged user id.
   */
  loggedUser() {
    const auth = getAuth();
    if (auth.currentUser) {
      return auth.currentUser.uid;
    } else {
      return 'Zta41sUcC7rLGHbpMmn4';
    }
  }

    /**
   * Filles collectedContent with the current content in the editor.
   * @param event
   */
    async collectContent(event: EditorChangeContent | EditorChangeSelection) {
      console.log(event);
      if (event.event === 'text-change') {
        this.collectedContent = event.html;
      }
      console.log("COLLECT CONTENT: ",event.event)
    }
}