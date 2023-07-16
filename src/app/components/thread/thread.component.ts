import { Component, OnDestroy, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Timestamp, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';
import { ThreadService } from 'src/app/shared/services/thread.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Message } from 'src/models/message.class';
import { Thread } from 'src/models/thread.class';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit, OnDestroy {

  collectedContent!: any;

  users: User[] = [];
  thread!: Thread;
  messageIds!: string[];
  messages!: Message[];

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

  private destroy$ = new Subject();

  constructor(
    private threadService: ThreadService,
    private messageService: MessageService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {

  }


  ngOnInit(): void {
    // Loading the logged user
    this.userService.getUserNotObservable(this.loggedUser()).then((onSnapshot) => {
      this.users.push(onSnapshot.data() as User);
    });

    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(async (params) => {
      if (params['id']) {
        console.log(params['id']);
        this.loadThread(params['id']);
      }
    });
  }


  ngOnDestroy(): void {
    console.log('ThreadComponent destroyed');
    this.destroy$.next(true);
  }


  loadThread(threadId: string) {
    this.threadService.loadChannelThreads([threadId]).then(thread => {
      this.thread = thread.docs[0].data() as Thread;
      console.log(this.thread);
      this.messageIds = thread.docs[0].data()['messages'];
      console.log(this.messageIds);

      this.messageService.loadThreadMessages(this.messageIds).then((querySnapshot) => {
        this.messages = querySnapshot.docs.map((doc) => {
          return doc.data() as Message;
        });
        this.messages.sort((a, b) => a.creationDate.seconds - b.creationDate.seconds);
        console.log(this.messages);

        // Loading all users in the thread
        this.userService.getAllUsersInThread(this.messages.map(message => message.creatorId)).then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) => {
            this.users.push(doc.data() as User);
          });
        });
      });
    });
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
    console.log(event.event)
  }


  sendMessage() {
    if (this.collectedContent != null && this.collectedContent != '') {
      let now = new Date().getTime() / 1000;
      let message = new Message('', this.loggedUser(), new Timestamp(now, 0), this.collectedContent);
      let messageId = this.messageService.createMessage(message); // Create message
      this.threadService.addMessageToThread(this.thread, messageId); // Create thread and add message
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

  // TODO: This function shall sort the messages by dates and cluster them by days.
  sortMessagesByDate() {
    if (this.messages) {
      this.messages.forEach((message) => {
        message.creationDate.toDate();
      });
    }
  }

  /**
   * Finds the user displayName by the user id.
   * @param userId as string.
   * @returns a string with the user displayName.
   */
  getUserName(userId: string) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].userId === userId) {
        return this.users[i].displayName;
      }
    }
    return 'Unknown';
  }


  getUserProfile(message: Message) {
    let user = this.users.find(user => user.userId === message.creatorId);
    return user?.profilePicture != '' ? user?.profilePicture : '/../../assets/img/profile.png';
  }
}
