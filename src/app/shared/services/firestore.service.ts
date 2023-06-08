import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }


  /**
   * Takes in a message object and creates a new message in the database and sets the messageId to the document id.
   * @param message a message object
   */
  createMessage(message: any) {
    const collectionInstance = collection(this.firestore, 'messages');
    const docRef = doc(collectionInstance);
    message.messageId = docRef.id;

    setDoc(docRef, message.toJSON()).then(() => {
      console.log('Message created successfully!');
    }).catch((error: any) => {
      console.log(error);
    });
  }
}
