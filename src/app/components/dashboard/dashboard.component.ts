import { Component, HostListener } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { SidenavService } from 'src/app/shared/services/sidenav.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  width!: number;

  /**
   * HostListener listens to the resize event on the window. If innerWidth is less than 768px,
   * then the left sidenav is hidden automatically. Otherwise the left sidenav is shown (again). 
   **/
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 768) {
      this.width = event.target.innerWidth;
      this.sidenavService.isLeftSidenavHidden = true;
    } else {
      this.width = event.target.innerWidth;
      this.sidenavService.isLeftSidenavHidden = false;
    }
  }

  activeChannel!: Channel;
  placeholder!: string;


  constructor(public sidenavService: SidenavService) { }


  setActiveChannel(event: Channel) {
    this.activeChannel = event;
    this.placeholder = `Type your message here in ${this.activeChannel.name}...`;
  }
    
}
