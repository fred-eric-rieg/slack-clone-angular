import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  positionX: number = 0;
  
  // Get the mouse position on the dashboard and emit it to the channel component.
  @HostListener('document:mousemove', ['$event'])
  getMousePosition($event: MouseEvent) {
    this.positionX = $event.clientX;
  }
}
