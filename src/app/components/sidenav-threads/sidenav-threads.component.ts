import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { getAuth } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, query, where, collectionData, getDocs, docData } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

// Models
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { Channel } from 'src/models/channel.class';
import { Thread } from 'src/models/thread.class';

// Services + Subscription
import { UserService } from 'src/app/shared/services/user.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { ThreadService } from 'src/app/shared/services/thread.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';


@Component({
  selector: 'app-channel-threads',
  templateUrl: './sidenav-threads.component.html',
  styleUrls: ['./sidenav-threads.component.scss']
})
export class SidenavThreadsComponent implements OnInit, OnDestroy {

  activeUser!: User; // für theads benötigt
  collectedContent!: any; // für Editor benötigt

  // Quill editor config ??
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

  placeholder = 'Write a message...';
  searchResults!: string[];
  searchSub!: Subscription;
  threadMessage$!: Observable<any>; // für Threads benötigt
  allThreadMessages!: Array<any>; // für Threads benötigt
  userSub!: Subscription;
  userId: string = '';


  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private threadService: ThreadService,
    private messageService: MessageService,
    private channelService: ChannelService,
    private firestore: Firestore,
    private auth: AngularFireAuth,
  ) {}


  ngOnInit(): void {
    this.getLoggedInUser(); // für Threads benötigt

    // Search filter (import from searchService)
    this.searchResults = this.searchService.getSearchResults();
    this.searchSub = this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
  }


  // ??
  ngOnDestroy(): void {
    console.log('ThreadComponent destroyed');
  }

  // Für Threads benötigt.
  /**
   * The ID of the active user is identified.
   */
  getLoggedInUser() {
    this.userSub = this.auth.user.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
        this.getUser();
      }
    });
  }


  // Für Threads benötigt.
  /**
   * The ID of the active user needs be
   */
  getUser() {
    this.userService.getSingleUserSnapshot(this.userId).then((onSnapshot) => {
      this.activeUser = onSnapshot.data() as User;
      console.log('activeUser fetched:', this.activeUser);
      this.loadMessagesByActiveUser();
    });
  }


  // für Threads benötigt
  /**
   * Only messages of the active user with matching IDs are loaded.
   * The ID of the creator of the message (creatorId) and the ID of the active user (userId) have to match.
   */
  async loadMessagesByActiveUser() {
    const messageCollection = collection(this.firestore, 'messages');
    const messageQuery = query(messageCollection, where('creatorId', '==', this.activeUser.userId));
    const messageSnapshot = await getDocs(messageQuery);

    console.log('Active User ID:', this.activeUser.userId);

    this.allThreadMessages = messageSnapshot.docs.map(doc => {
      const messageData = doc.data();
      console.log('Message creatorId:', messageData['creatorId']);
      return messageData;
    });
  }


  // Einstellungen für Editor ??
  /**
   * Filles collectedContent with the current content in the editor.
   * @param event
   */
  async collectContent(event: EditorChangeContent | EditorChangeSelection) {
    event.event === 'text-change' ? this.collectedContent = event.html : null;
  }

  sendMessage() {}

}
