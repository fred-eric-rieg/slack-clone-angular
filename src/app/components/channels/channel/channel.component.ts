import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

// Models
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { Channel } from 'src/models/channel.class';

// Services
import { ChannelService } from 'src/app/shared/services/channel.service';
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
  data$: Observable<{ channels: Channel[]; users: User[] }> = combineLatest(
    [this.channelService.allChannels$, this.userService.allUsers$])
    .pipe(map(([channels, users]) => ({ channels, users }))
    );

  activeChannelId!: string;
  placeholder = 'Type your message here...';


  // Subscriptions
  paramsSub!: Subscription;


  constructor(
    private channelService: ChannelService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    console.log('ChannelComponent initialized');
    this.paramsSub = this.route.params.subscribe(params => {
      this.activeChannelId = params['id'];
      this.channelService.refreshChannelData(this.activeChannelId, 'channelIsAsking');
      this.channelService.setChannelId(this.activeChannelId);
    });
  }

  /**
   * To avoid memory leaks, unsubscribe from all subscriptions on destruction of the component.
   */
  ngOnDestroy(): void {
    console.log('ChannelComponent destroyed');
    this.paramsSub.unsubscribe();
  }


  /**
   * Calls the channelService to update the query to the specified channel.
   * @param channel as Channel.
   * @returns the specified channel.
   */
  getChannel(channels: Channel[]) {
    return channels.filter(channel => channel.channelId === this.activeChannelId)[0];
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
      let channel = (await this.channelService.getChannel(this.activeChannelId)).data() as Channel;
      console.log("Channel ist:", channel);
      let message = new Message({ messageId: '', creatorId: this.loggedUser(), creationDate: new Timestamp(now, 0), text: this.collectedContent });
      await this.channelService.setMessage(message, channel);
      var element = document.getElementsByClassName("ql-editor");
      element[0].innerHTML = "";
      this.scrollDown(); // Scroll down to the latest message
    }
  }


  scrollDown() {
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }, 500);
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