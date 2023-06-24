import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-direct-message-channel',
  templateUrl: './direct-message-channel.component.html',
  styleUrls: ['./direct-message-channel.component.scss']
})
export class DirectMessageChannelComponent implements OnInit {
  chatId: string = '';
  channel!: Channel;

  test = [1, 2];

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.chatId = params['id'];
    })
  }

  sendMessage() {

  }
}
