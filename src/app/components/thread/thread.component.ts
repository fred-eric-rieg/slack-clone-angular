import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { Observable, Subscription } from 'rxjs';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ThreadService } from 'src/app/shared/services/thread.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { Thread } from 'src/models/thread.class';
import { User } from 'src/models/user.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit, OnDestroy {

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages$!: Observable<Message[]>;

  collectedContent!: any;

  users: User[] = [];
  thread!: Thread;
  threadId!: string;
  messageIds!: string[];
  messages!: Message[];
  channel!: Channel;

  // Subscriptions
  paramsSub!: Subscription;
  channelSub!: Subscription;

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
    private threadService: ThreadService,
    private messageService: MessageService,
    private userService: UserService,
    private channelService: ChannelService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }


  ngOnInit(): void {
    // Loading the logged user
    this.userService.getSingleUserSnapshot(this.loggedUser()).then((onSnapshot) => {
      this.users.push(onSnapshot.data() as User);
    });

    this.paramsSub = this.route.params.subscribe(async (params) => {
      if (params['id']) {
        this.threadId = params['id'];

        this.channelSub = this.channelService.allChannels$.subscribe(channels => {
          this.channel = channels.filter(channel => channel.threads.includes(this.threadId))[0];
        }
        );
      }
    });
  }


  ngOnDestroy(): void {
    console.log('ThreadComponent destroyed');
    this.channelSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }


  async loadThread(threadId: string) {
    this.threadService.loadChannelThreads([threadId]).then(thread => {
      this.thread = thread.docs[0].data() as Thread;
      this.messageIds = thread.docs[0].data()['messages'];

      this.loadMessages();
    });
  }


  async loadMessages() {
    
  }

  /**
   * Filles collectedContent with the current content in the editor.
   * @param event 
   */
  async collectContent(event: EditorChangeContent | EditorChangeSelection) {
    event.event === 'text-change' ? this.collectedContent = event.html : null;
  }


  async sendMessage() {
    if (this.collectedContent != null && this.collectedContent != '') {
      let now = new Date().getTime() / 1000;
      let message = new Message({messageId: '', creatorId: this.loggedUser(), crationDate: new Timestamp(now, 0), text: this.collectedContent});
      let messageId = await this.messageService.createMessage(message); // Create message
      await this.threadService.addMessageToThread(this.thread, messageId); // Create thread and add message
      var element = document.getElementsByClassName("ql-editor");
      element[0].innerHTML = "";
      this.scrollDown(); // Scroll down to lates message
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


  scrollDown() {
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }, 500);
  }


  closeThread() {
    this.router.navigate(['dashboard/channel', this.channel.channelId]);
  }
}
