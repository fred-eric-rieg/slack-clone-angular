import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { CollectionReference, DocumentData, Firestore, Timestamp, collection, doc, docData, getDocs, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { Subscription, take } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Chat } from 'src/models/chat.class';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-direct-message-channel',
  templateUrl: './direct-message-channel.component.html',
  styleUrls: ['./direct-message-channel.component.scss']
})
export class DirectMessageChannelComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  allUsers: User[] = [];
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
  searchResults!: string[];

  // Subscriptions
  paramsSub!: Subscription;
  chatSub!: Subscription;
  searchSub!: Subscription;

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
    private fs: Firestore,
    private searchService: SearchService,
  ) {
    this.msgCollection = collection(this.fs, 'messages');
    this.handleSearchbar();
  }

  async ngOnInit(): Promise<any> {
    this.allUsers = await this.getAllUsers();
    this.paramsSub = this.route.params.subscribe((params) => {
      this.isLoading = true;
      this.resetAllVariables();
      this.chatId = params['id'];
      this.chat.chatId = this.chatId;
      this.chatSub = this.chatService.returnChatData(this.chatId).subscribe(data => {
        this.memberIds.push(...data['members']);
        this.messageIds.push(...data['messages']);
        this.chat.members.push(...data['members']);

        for (const message of data['messages']) {
          this.subscribeToMessage(message);
        }
      })
      this.getMemberNames();
      this.getAllMessages().then((msgs) => {
        this.chatService.returnQueryChatData(this.chatId)
        .then((chatMsgs: any) => {
          this.messages = [];
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
  }

  subscribeToMessage(messageId: string) {
    this.messages = [];
    const messageDoc = doc(this.msgCollection, messageId);
    docData(messageDoc).pipe(take(1)).subscribe((msg: any) => {
      console.log("MSG: " + msg.text);
      this.messages.push(msg);
    });
  }


  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
    this.paramsSub.unsubscribe();
    this.chatSub.unsubscribe();
  }

  /**
   * Querysnapshot of all users in the database
   * @returns all users from the database
   */
  async getAllUsers() {
    const allUsers: any = [];
    const qSnap = await this.userService.getAllUsersSnapshot();
    qSnap.forEach((doc) => {
      allUsers.push(doc.data());
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
  async sendMessage() {
    if (this.collectedContent != null && this.collectedContent != '') {
      let now = new Date().getTime() / 1000;
      let message = new Message({messageId: '', creatorId: this.loggedUser(), creationDate: new Timestamp(now, 0), text: this.collectedContent});
      let messageId = await this.createMessage(message)
      await this.chatService.addMessageToChat(this.chat, messageId);
      // this.messages = [];
      // message.messageId = messageId;
      // this.messages.push(message);
    }
    var element = document.getElementsByClassName("ql-editor");
    element[0].innerHTML = "";
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
   * Takes in a message object and creates a new message in the database and sets the messageId to the document id.
   * @param message a message object
   */
  async createMessage(message: Message) {
    const messageCollection = collection(this.fs, 'messages');
    const messageDocument = doc(messageCollection);
    message.messageId = messageDocument.id;

    setDoc(messageDocument, message.toJSON()).then(() => {
    }).catch((error: any) => {
      console.log(error);
    });

    return messageDocument.id;
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

  scrollDown() {
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }, 100);
  }


  handleSearchbar() {
    // Search filter (import from searchService)
    this.searchResults = this.searchService.getSearchResults();
    this.searchSub = this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
  }


  getUserName(userId: string) {
    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.allUsers[i].userId === userId) {
        return this.allUsers[i].displayName;
      }
    }
    return 'Unknown';
  }

}