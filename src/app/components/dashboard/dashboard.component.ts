import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { SidenavService } from 'src/app/shared/services/sidenav.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  width!: number;
  leftSidenavOpen: boolean = true;

  /**
   * HostListener listens to the resize event on the window. If innerWidth is less than 768px,
   * then the left sidenav is hidden automatically. Otherwise the left sidenav is shown (again). 
   **/
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 768) {
      this.width = event.target.innerWidth;
      this.sidenavService.openSidenav.emit(false);
    } else {
      this.width = event.target.innerWidth;
      this.sidenavService.openSidenav.emit(true);
    }
  }

  activeChannel!: Channel;
  placeholder!: string;


  constructor(public sidenavService: SidenavService) { }


  ngOnInit(): void {
    this.sidenavService.openSidenav.subscribe((response) => {
      this.leftSidenavOpen = response;
    });
  }


  ngOnDestroy(): void {
  }


  setActiveChannel(event: Channel) {
    this.activeChannel = event;
    this.placeholder = `Type your message here in ${this.activeChannel.name}...`;
  }
    
}
