import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from 'src/models/message.class';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages!: Observable<any>;

  constructor(private firestore: Firestore) {}


  loadAllMessages() {
    const messageCollection = collection(this.firestore, 'messages');
    return getDocs(messageCollection);
  }


  loadThreadMessages(messageIds: string[]) {
    const messageCollection = collection(this.firestore, 'messages');
    const q = query(messageCollection, where('messageId', 'in', messageIds));
    return getDocs(q);
  }

  /**
   * Takes in a message object and creates a new message in the database and sets the messageId to the document id.
   * @param message a message object
   */
  createMessage(message: Message) {
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
