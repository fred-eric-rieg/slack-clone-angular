import { Injectable, OnInit } from '@angular/core';
import { CollectionReference, DocumentData, DocumentReference, Firestore, Timestamp, arrayUnion, collectionData, doc, docData, docSnapshots, setDoc, updateDoc } from '@angular/fire/firestore';
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

  returnCurrentUserChats(userId: string){
    	const docRef = doc(this.userChatCollection, userId);
      return docSnapshots(docRef);
  }


  /** returns fs document data for a specific chat id */
  returnChatData(chatId: string){
    const docRef = doc(this.chatCollection, chatId);
    return docData(docRef);
  }

  /** After a new chat was created this function updates
   * and push chatIds into the document of current user
   */
  updateUserChatData(chatId: string) {
    this.userService.getCurrentUser().then((userId) => {
      this.currentUserId = userId;
      updateDoc(doc(this.userChatCollection, this.currentUserId),
        {
          chatIds: arrayUnion(chatId)
        })
    });
  }

  /** Set new Doc in 'chats' Collection with all
   * added members and current server time
   * @param chatId generated chatId as string
   * @param users selected users as Object
   */
  setChatData(chatId: string, users: any){
    const docRef = doc(this.chatCollection, chatId);
    setDoc(docRef, {
      chatId: chatId,
      creationDate: Timestamp.now(),
      members: arrayUnion(...this.extractMembers(users)),
      threads: []
    })
  }

  extractMembers(users: any){
    let members: any = [];
    users.forEach((user: any) => {
      members.push(user.userId)
    });
    return members;
  }
}