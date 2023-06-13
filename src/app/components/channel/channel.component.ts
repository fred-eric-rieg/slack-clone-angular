import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/models/message.class';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/shared/services/message.service';
import { User } from 'src/models/user.class';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  @Input() positionX!: number;
  movable: boolean = false;
  width = 350;

  form!: FormGroup;

  private user!: User;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService
    ) { }


  ngOnInit() {
    this.form = this.formBuilder.group({
      message: ['', [Validators.required]]
    });
    this.userService.user = this.user;
    console.log(this.userService.user);

  }

  /**
   * Set the movable property to true or false whenever the user clicks on the right vertical channel bar
   * for resizing the channel.
   */
  setMovable() {
    console.log(this.width)
    if (this.movable) {
      this.movable = false;
    } else {
      this.movable = true;
    }
    this.moveBar();
  }

  /**
   * Move the channel bar to the right or left depending on the mouse position on the dashboard.
   */
  moveBar() {
    if (this.movable) {
        this.width = this.positionX - 327;
        setTimeout( () => {
          this.moveBar();
        }, 50);
    } else {
      // Nothing yet
    }
  }


  sendMessage() {
    console.log('Send message');
    let message = new Message('', 'guestId', 'guestName', this.form.value, new Date(), null, null, null);
    console.log(message);
    this.messageService.createMessage(message);
    this.form.reset();
  }
}
