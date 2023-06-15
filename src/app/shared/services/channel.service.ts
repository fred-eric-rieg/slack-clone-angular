import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
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
}
