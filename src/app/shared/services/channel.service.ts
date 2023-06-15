import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  channels!: Observable<any>;

  constructor(private firestore: Firestore) {
    this.loadChannel();
   }


  loadChannel() {
    const collectionInstance = collection(this.firestore, 'channels');
    this.channels = collectionData(collectionInstance);
  }


  saveMessage(message: any, channel: any) {
    let updatedChannel = channel;
    updatedChannel.messages.push(message);
    console.log("update: ", updatedChannel);
    const collectionInstance = collection(this.firestore, 'channels');
    const docRef = doc(collectionInstance, channel.id);
    setDoc(docRef, updatedChannel);
  }
}
