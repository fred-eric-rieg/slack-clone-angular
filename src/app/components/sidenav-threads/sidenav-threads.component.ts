import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { getAuth } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, query, where, getDocs } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

// Models
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { Thread } from 'src/models/thread.class';

// Services + Subscription
import { UserService } from 'src/app/shared/services/user.service';
import { SearchService } from 'src/app/shared/services/search.service';


@Component({
  selector: 'app-channel-threads',
  templateUrl: './sidenav-threads.component.html',
  styleUrls: ['./sidenav-threads.component.scss']
})
export class SidenavThreadsComponent implements OnInit, OnDestroy {

  activeUser!: User; // threads + user info
  user = new User(); // threads + user info
  allUsers: User[] = []; // threads + user info
  userSub!: Subscription; // threads + user info
  userId: string = ''; // threads + user info
  threads: Thread[] = []; // threads
  threadMessage$!: Observable<any>; // treads
  allThreadMessages!: Array<any>; // treads
  searchResults!: string[]; // search
  searchSub!: Subscription; // search

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private firestore: Firestore,
    private auth: AngularFireAuth,
  ) {
    // get user info (displayName + profilePicture)
    this.userSub = this.userService.allUsers$.subscribe((users: User[]) => {
      this.allUsers = users;
    });
  }


  ngOnInit(): void {
    this.getLoggedInUser(); // threads

    // search
    this.searchResults = this.searchService.getSearchResults();
    this.searchSub = this.searchService.searchResultsChanged.subscribe((results: string[]) => {
      this.searchResults = results;
    });
  }


  ngOnDestroy(): void {
    // console.log('ThreadComponent destroyed');
    this.userSub.unsubscribe();
  }

  /**
   * Threads + user info.
   * The ID of the active user is identified.
   */
  getLoggedInUser() {
    this.userSub = this.auth.user.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
        this.getUserInfo();
      }
    });
  }


  // Threads + user info.
  getUserInfo() {
    this.userService.getSingleUserSnapshot(this.userId).then((onSnapshot) => {
      this.activeUser = onSnapshot.data() as User;
      // console.log('activeUser fetched:', this.activeUser);
      this.loadMessagesByActiveUser();
    });
  }


  // Threads + user info.
  getUserName(userId: string) {
    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.allUsers[i].userId === userId) {
        return this.allUsers[i].displayName;
      }
    }
    return 'Unknown';
  }


  getUserProfile(message: Message) {
    let user = this.allUsers.find(user => user.userId === message.creatorId);
    return user?.profilePicture != '' ? user?.profilePicture : '/../../assets/img/profile.png';
  }


  /**
   * Threads + user info.
   * Only messages of the active user with matching IDs are loaded.
   * The ID of the creator of the message (creatorId) and the ID of the active user (userId) have to match.
   */
  async loadMessagesByActiveUser() {
    const messageCollection = collection(this.firestore, 'messages');
    const messageQuery = query(messageCollection, where('creatorId', '==', this.activeUser.userId));
    this.allThreadMessages = (await getDocs(messageQuery)).docs.map(doc => doc.data() as Message);
    this.loadThreadsViaMessages();

  }


  async loadThreadsViaMessages() {
    const threadCollection = collection(this.firestore, 'threads');
    let messageIds = this.allThreadMessages.map(msg => msg.messageId);
    const threadQuery = query(threadCollection, where('messages', 'array-contains-any', messageIds));
    this.threads = (await getDocs(threadQuery)).docs.map(doc => doc.data() as Thread).sort((a, b) => a.creationDate.seconds - b.creationDate.seconds);
  }


  openThread(thread: Thread) {
    return `/dashboard/thread/${thread.threadId}`;
  }

}
