import { Injectable, OnInit } from '@angular/core';
import { CollectionReference, DocumentData, DocumentReference, Firestore, doc, docData, docSnapshots, setDoc, updateDoc } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { UserService } from './user.service';
import { Chat } from 'src/models/chat.class';
import { update } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnInit {
  private userChatCollection: CollectionReference<DocumentData>;
  private chatCollection!: CollectionReference<DocumentData>;
  // allChats: Array<string>;
  chat!: Chat;
  currentUserId: any;
  userChatRef!: any;

  constructor(
    private firestore: Firestore,
    private userService: UserService,
  ) {
    this.userChatCollection = collection(this.firestore, 'userChats');
    this.chatCollection = collection(this.firestore, 'chats');
  }

  ngOnInit(): void {
    
  }

  async getUserChatData(userId: string){
    return new Promise((resolve) => {
      docSnapshots(doc(this.userChatCollection, userId))
        .subscribe(snap => {
          const chatIds = snap.get('chatIds');
          resolve(chatIds);
        })
    })
  }

  /** Set a database for current User with all chats that this user have */
  setUserChatData(chatIds: Array<string>) {
    this.userService.getCurrentUser().then((userId) => {
      this.currentUserId = userId;
      setDoc(doc(this.userChatCollection, this.currentUserId),
        {
          chatIds: chatIds
        })
    });
  }
}
