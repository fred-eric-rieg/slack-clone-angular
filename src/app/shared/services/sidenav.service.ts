import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  sidenavOpened = new EventEmitter<boolean>();
  leftSidenavOpened = new EventEmitter<void>();
  isLeftSidenavHidden = false;

  constructor() { }
}
