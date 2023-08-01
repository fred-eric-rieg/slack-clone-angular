import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  openUserProfile = new EventEmitter<boolean>();
  openSidenav = new EventEmitter<boolean>();

}
