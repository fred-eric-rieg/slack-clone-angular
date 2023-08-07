// import { Component, OnInit } from '@angular/core';
// import { CollectionReference, DocumentData } from '@angular/fire/firestore';
// import { Observable, Subscription, take } from 'rxjs';
// import { ChatService } from 'src/app/shared/services/chat.service';
// import { UserService } from 'src/app/shared/services/user.service';
// import { User } from 'src/models/user.class';


// @Component({
//   selector: 'app-direct-messages-section',
//   templateUrl: './direct-messages-section.component.html',
//   styleUrls: ['./direct-messages-section.component.scss']
// })
// export class DirectMessagesSectionComponent implements OnInit {
//   collapsed: boolean = false;
//   chatIds: Array<string> = [];
//   currentUserId: any;
//   allChats: any[] = [];
//   creationDate: any = [];
//   memberIds: any = [];
//   memberLength: any = [];
//   memberNames: any = [];
//   memberImages: any = [];
//   threads: any = [];

//   // Subscriptions
//   chatSub!: Subscription;
//   userSub!: Subscription;

//   constructor(
//     private userService: UserService,
//     public chatService: ChatService,
//   ) {
//     //this.currentUserId = this.userService.currentUser;
//     // this.getCurrentUserChats();
//   }

//   async ngOnInit(): Promise<void> {
//     await this.getCurrentUserId();
//     await this.getCurrentUserChats();
//     console.log("DM SECTION: ", this.memberImages);
//   }


//   ngOnDestroy(): void {
//     this.chatSub.unsubscribe();
//     if (this.userSub != undefined) {
//       this.userSub.unsubscribe();
//     }
//   }
  
//   /**
//    * Get current logged in user id from UserServie
//   */
//  async getCurrentUserId() {
//    await this.userService.getCurrentUser()
//    .then((currentUserId) => {
//      this.currentUserId = currentUserId;
//     })
//   }
  
//   async getCurrentUserChats() {
//     this.chatSub = this.chatService.returnCurrentUserChats(this.currentUserId)
//     .subscribe(snap => {
//       this.chatIds = snap.get('chatIds');
//       this.getChatDataById(this.chatIds);
//     })
//   }
  
//   // async getChatDataById(chatIds: Array<string>) {
//   //   let i = 0;
//   //   if (chatIds != undefined) {
//   //     chatIds.forEach(async (chatId: string) => {
//   //       const chatData: any = await this.chatService.returnQueryChatData(chatId);
//   //       this.creationDate.push([...chatData][0]['creationDate']);
//   //       this.memberIds.push([...chatData][0]['members']);
//   //       this.threads.push([...chatData][0]['threads']);
//   //       this.memberLength.push(this.memberIds[i].length);
//   //       i++;
//   //     })
//   //     await this.setNameFirstUser(this.memberIds);
//   //   }
//   // }

//   // async setNameFirstUser() {
//   //   setTimeout(() => {
//   //     this.memberIds.forEach(async (user: any) => {
//   //       this.userService.getUserData(user[0])
//   //         .pipe(take(1))
//   //         .subscribe((user) => {
//   //           this.memberNames.push(user['displayName']);
//   //           this.memberImages.push(user['profilePicture']);
//   //         })
//   //     })
//   //   }, 200)
//   // }

//   async getChatDataById(chatIds: Array<string>) {
//     if (chatIds != undefined) {
//       chatIds.forEach(async (chatId: string) => {
//         const chatData: any = await this.chatService.returnQueryChatData(chatId);
//         console.log(chatData);
//       })
//       //await this.setNameFirstUser();
//     }
//   }

//   async setNameFirstUser(memberId: string) {
//     console.log(memberId[0]);
//     // const userData = await this.userService.returnUserData(this.memberIds[0][0]);
//   }

//   //TODO: es wird nicht/nie immer der richtige Name angezeigt
//   // Member names werden überschrieben und nur ein bestimmter Name wird angezeigt? Weil als erstes geaddet?
  

//   toggleDropdown() {
//     this.collapsed = !this.collapsed;
//   }

// }
