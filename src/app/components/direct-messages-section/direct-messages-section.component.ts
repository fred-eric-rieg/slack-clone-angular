import { Component } from '@angular/core';
import { CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-direct-messages-section',
  templateUrl: './direct-messages-section.component.html',
  styleUrls: ['./direct-messages-section.component.scss']
})
export class DirectMessagesSectionComponent {
  collapsed: boolean = false;
  chatsColl!: CollectionReference;
  chats$!: Observable<DocumentData[]>;
  chats: Array<any> = [];
  currentUserId: any;

  constructor(
    private userServive: UserService,
  ) {
    this.currentUserId = this.userServive.currentUser;
    this.getCurrentUserId();
  }

  /**
   * Get current logged in user from UserServie
   */
  getCurrentUserId() {
    this.userServive.getCurrentUser()
      .then((currentUserId) => {
        this.currentUserId = currentUserId;
      })
  }

  toggleDropdown() {
    this.collapsed = !this.collapsed;
  }
}
