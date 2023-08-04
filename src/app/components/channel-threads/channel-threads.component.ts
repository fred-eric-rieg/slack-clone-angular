import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { SearchService } from 'src/app/shared/services/search.service';


import { CollectionReference, DocumentData, Firestore, Timestamp, collection, getDocs } from '@angular/fire/firestore';
import { DialogAddDescriptionComponent } from '../channels/dialog-add-description/dialog-add-description.component';
import { MatDialog } from '@angular/material/dialog';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill/public-api';
import 'quill-emoji/dist/quill-emoji.js';

// Models
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';

// Services
import { MessageService } from 'src/app/shared/services/message.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { ThreadService } from 'src/app/shared/services/thread.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Channel } from 'src/models/channel.class';
import { Thread } from 'src/models/thread.class';
import { getAuth } from '@angular/fire/auth';
import { Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogAddPeopleComponent } from '../channels/dialog-add-people/dialog-add-people.component';
import { DialogViewPeopleComponent } from '../channels/dialog-view-people/dialog-view-people.component';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Chat } from 'src/models/chat.class';


@Component({
  selector: 'app-channel-threads',
  templateUrl: './channel-threads.component.html',
  styleUrls: ['./channel-threads.component.scss']
})
export class ChannelThreadsComponent implements OnInit {

  user = new User();
  allUsers: User[] = [];
  searchResults!: string[];
  //messages!: Message[];

  private msgCollection!: CollectionReference<DocumentData>;
  chatId: string = '';
  memberIds: Array<string> = [];
  members: Array<string> = [];
  messageIds: any = [];
  messages: Array<any> = [];
  isLoading: boolean = true;

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
    private searchService: SearchService,
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
    this.route.params.subscribe((params) => {
      this.isLoading = true;
      this.resetAllVariables();
      this.chatId = params['id'];
      this.chat.chatId = this.chatId;
      this.chatService.returnChatData(this.chatId).subscribe(data => {
        this.memberIds.push(...data['members']);
        this.messageIds.push(...data['messages']);
        this.chat.members.push(...data['members']);
      })
      this.getMemberNames();
      this.getAllMessages().then((msgs) => {
        this.chatService.returnQueryChatData(this.chatId)
          .then((chatMsgs: any) => {
            msgs.forEach((msg: any) => {
              if (chatMsgs[0]['messages'].includes(msg.messageId)) {
                this.messages.push(msg);
              }
            });
            this.sortMessagesByDate();
          });
        });
        // Cheat
        setTimeout(() => {
          this.isLoading = false;
        }, 600);
    });

    /*
    this.searchResults = this.searchService.getSearchResults();
    this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
    */
  }


  /**
   * Querysnapshot of all users in the database
   * @returns all users from the database
   */
  async getAllUsers() {
    const allUsers: any = [];
    const qSnap = await this.userService.allUsers$.subscribe(data => {
      data.forEach((user: any) => {
        allUsers.push(user);
      });
    });
    return allUsers;
  }

  resetAllVariables() {
    //this.allUsers = [];
    this.chatId = '';
    this.memberIds = [];
    this.members = [];
    this.messageIds = [];
    this.messages = [];
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

  formatDateTime(timestamp: any) {
    let date = new Date(timestamp.seconds * 1000);
    let hours = date.getHours() % 12 || 12;
    let minutes = date.getMinutes().toLocaleString();
    if (minutes.length == 1) {
      minutes = 0 + minutes;
    }
    return `${hours}:${minutes} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
  }

  /**
   * Sorts the messages by date.
   */
  sortMessagesByDate() {
    this.messages.sort((a, b) => a.creationDate.seconds - b.creationDate.seconds);
  }


  /**
   * get the username of the user
   * @param userId as string
   * @returns username of the user
   */
  getChatUserName(userId: string) {
    let name = '';
    this.allUsers.forEach((user: any) => {
      if (user.userId === userId) {
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
      let message = new Message({messageId: '', creatorId: this.loggedUser(), crationDate: new Timestamp(now, 0), text: this.collectedContent});
      //let messageId = this.messageService.createMessage(message);
      //this.chatService.addMessageToChat(this.chat, messageId);
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
