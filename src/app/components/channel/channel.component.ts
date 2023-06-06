import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {

  @Input() positionX!: number;
  movable: boolean = false;
  width = 350;

  constructor() { }


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
}
