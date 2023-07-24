import { Component, Input, OnInit } from '@angular/core';
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
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-direct-message-channel',
  templateUrl: './direct-message-channel.component.html',
  styleUrls: ['./direct-message-channel.component.scss']
})
export class DirectMessageChannelComponent implements OnInit {
  allUsers: User[] = [];
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
    public userService: UserService,
    private messageService: MessageService,
    private fs: Firestore
  ) {
    this.msgCollection = collection(this.fs, 'messages');
  }

  async ngOnInit(): Promise<any> {
    this.allUsers = await this.getAllUsers();
    console.log(this.allUsers);

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
    this.getAllMessages().then((msgs) => {
      this.chatService.returnQueryChatData(this.chatId)
        .then((chatMsgs: any) => {
          console.log("Mögliche: ", chatMsgs);
          msgs.forEach((msg: any) => {
            if (chatMsgs[0]['messages'].includes(msg.messageId)) {
              this.messages.push(msg);
            }
          });
        });
    });
  }

  /**
   * Querysnapshot of all users in the database
   * @returns all users from the database
   */
  async getAllUsers() {	
    const allUsers: any = [];
    const qSnap = await this.userService.getAllUsersNotObservable();
    qSnap.forEach((doc) => {
      allUsers.push(doc.data());
    });
    return allUsers;
  }


  /**
   * get all members of the chat
   * and push them into the members array
   */
  getMemberNames() {
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

  async getAllMessages() {
    const allMessages: any = [];
    const querySnapshot = await getDocs(this.msgCollection);
    querySnapshot.forEach((doc) => {
      allMessages.push(doc.data());
    })
    return allMessages;

  }

  getChatUserName(userId: string) {
    let name = '';
    this.allUsers.forEach((user: any) => {
      if (user.userId === userId) {
        name = user.displayName
      }
    });
    return name;
  }

  getChatUserImage(userId: string) {
    let img = '';
    this.allUsers.forEach((user: any) => {
      if (user.userId === userId) {
        img = user.profilePicture
      }
    });
    return img;
  }

  /**
   * Sends a message to the database.
   */
  sendMessage() {
    if (this.collectedContent != null && this.collectedContent != '') {
      let now = new Date().getTime() / 1000;
      let message = new Message('', this.loggedUser(), new Timestamp(now, 0), this.collectedContent);
      let messageId = this.messageService.createMessage(message)
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
    if (event.event === 'text-change') {
      this.collectedContent = event.html;
    }
  }
}