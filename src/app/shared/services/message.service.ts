import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, query, where, collectionData, getDocs } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Message } from 'src/models/message.class';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageCollection = collection(this.firestore, 'messages');

  messages$!: Observable<Message[]>;



  constructor(
    private firestore: Firestore,
  ) {
    
  }


  loadAllMessages() {
    return getDocs(this.messageCollection);
  }


  async loadThreadMessages(messageIds: string[]) {
    console.log("Message Service received messageIds: ", messageIds);
    let q = query(this.messageCollection, where('messageId', 'in', messageIds));
    this.messages$ = collectionData(q) as Observable<Message[]>;
  }

  /**
   * Takes in a message object and creates a new message in the database and sets the messageId to the document id.
   * @param message a message object
   */
  async createMessage(message: Message) {
    const messageCollection = collection(this.firestore, 'messages');
    const messageDocument = doc(messageCollection);
    message.messageId = messageDocument.id;

    setDoc(messageDocument, message.toJSON()).then(() => {
      console.log('Message created successfully!');
    }).catch((error: any) => {
      console.log(error);
    });

    return messageDocument.id;
  }
}
