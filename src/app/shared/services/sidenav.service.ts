import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  sidenavOpened = new EventEmitter<void>();

  constructor() { }
}
