import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  /**
  * HIER MUSS NOCH AUFGERÄUMT WERDEN
  **/
  sidenavOpened = new EventEmitter<boolean>();
  leftSidenavOpened = new EventEmitter<boolean>();
  isLeftSidenavHidden = false;

  constructor() { }
}
