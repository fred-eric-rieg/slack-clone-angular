import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

// Models
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { Channel } from 'src/models/channel.class';
import { Thread } from 'src/models/thread.class';

// Services
import { MessageService } from 'src/app/shared/services/message.service';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { ThreadService } from 'src/app/shared/services/thread.service';
import { UserService } from 'src/app/shared/services/user.service';

// Rxjs & Quill
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill/public-api';
import 'quill-emoji/dist/quill-emoji.js';
import { Observable, Subscription, combineLatest, map } from 'rxjs';



@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  // Quill editor content
  collectedContent!: any;

  // Quill editor config
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

  // Variables
  threads!: Thread[];
  messages!: Message[];
  data$: Observable<{ channels: Channel[]; users: User[] }> = combineLatest(
    [this.channelService.allChannels$, this.userService.allUsers$])
    .pipe(map(([channels, users]) => ({ channels, users })));
  activeChannel!: Channel;
  activeChannelId!: string;
  placeholder = 'Type your message here...';

  // Subscriptions
  paramsSub!: Subscription;
  dataSub!: Subscription;


  constructor(
    private messageService: MessageService,
    private threadService: ThreadService,
    private channelService: ChannelService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    console.log('ChannelComponent initialized');
    this.paramsSub = this.route.params.subscribe(params => {
      this.activeChannelId = params['id'];
    });
  }

  /**
   * To avoid memory leaks, unsubscribe from all subscriptions on destruction of the component.
   */
  ngOnDestroy(): void {
    console.log('ChannelComponent destroyed');
    this.paramsSub.unsubscribe();
    this.dataSub ? this.dataSub.unsubscribe() : null;
  }

  /**
   * Calls the channelService to load the active channel via the route params.
   * Is destroyed on component destruction.
   */
  getChannel(channels: Channel[]) {
    return channels.filter(channel => channel.channelId === this.activeChannelId)[0];
  }

  /**
  * Load all threads of the active channel.
  */
  loadThreads() {
    this.threadService.loadChannelThreads(this.activeChannel.threads).then((querySnapshot) => {
      this.threads = querySnapshot.docs.map((doc) => {
        return doc.data() as Thread;
      });
      localStorage.setItem('activeChannelThreads', JSON.stringify(this.threads)); // Cache the active channel threads.
      this.loadMessages(); // After the threads are loaded, load the messages.
    });
  }

  /**
   * Load all messages of the active channel once.
   */
  loadMessages() {
    let messageIds = this.threads.map(thread => thread.messages[0]).flat();
    this.messageService.loadThreadMessages(messageIds).then((querySnapshot) => {
      this.messages = querySnapshot.docs.map((doc) => {
        return doc.data() as Message;
      });
      this.messages.sort((a, b) => a.creationDate.seconds - b.creationDate.seconds);
      localStorage.setItem('activeChannelMessages', JSON.stringify(this.messages)); // Cache the active channel messages.
    });
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
      let message = new Message('', this.loggedUser(), new Timestamp(now, 0), this.collectedContent);
      let messageId = await this.messageService.createMessage(message); // Create message
      let threadId = await this.threadService.createThread(messageId); // Create thread and add message
      await this.channelService.updateChannel(this.attachThreadToChannel(threadId)); // Update Channel
      var element = document.getElementsByClassName("ql-editor");
      element[0].innerHTML = "";
      this.loadThreads(); // Reload threads
      this.scrollDown(); // Scroll down to the latest message
    }
  }


  scrollDown() {
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }, 500);
  }

  /**
   * Attaches a thread to a copy of the active channel.
   * @param threadId as string.
   * @returns channel with the attached thread.
   */
  attachThreadToChannel(threadId: string) {
    console.log('attachThreadToChannel');
    console.log("threadID: ", threadId)
    this.activeChannel.threads.push(threadId);
    console.log("threadId added to CHannel: ", this.activeChannel)
    return this.activeChannel;
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
}