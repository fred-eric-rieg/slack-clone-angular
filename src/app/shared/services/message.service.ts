import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc, updateDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from 'src/models/message.class';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages!: Observable<any>;

  constructor(private firestore: Firestore) {
    this.loadMessages();
  }


  loadMessages() {
    const messageCollection = collection(this.firestore, 'messages');
    this.messages = collectionData(messageCollection);
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
