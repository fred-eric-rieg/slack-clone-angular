import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  searchValue: string = '';
  channels!: Observable<any>;

  constructor(private firestore: Firestore) {
   }


  /**
   * Loads all channels from the database once.
   * @returns a promise with all channels from the database.
   */
  onetimeLoadChannels() {
    const channelCollection = collection(this.firestore, 'channels');
    return getDocs(channelCollection);
  }

  /**
   * Overwrites an existing channel with a new channel object.
   * The new channel objects keeps the old channelId and the threadId
   * is added to the threads array.
   * @param threadId as string.
   * @param channelId as string.
   */
  addThreadToChannel(channel: Channel, threadId: string,) {
    const channelCollection = collection(this.firestore, 'channels');
    const channelDocument = doc(channelCollection, channel.channelId);

    channel.threads.push(threadId);

    setDoc(channelDocument, channel).then(() => {
      console.log('Channel updated successfully!');
    }).catch((error: any) => {
      console.log(error);
    }
    );
  }


  createNewChannel(channel: Channel) {
    const channelCollection = collection(this.firestore, 'channels');
    const channelDocument = doc(channelCollection);

    channel.channelId = channelDocument.id;

    setDoc(channelDocument, channel.toJSON()).then(() => {
      console.log('Channel created successfully!');
    }).catch((error: any) => {
      console.log(error);
    }
    );
  }

  /**
   * Retrieves a single channel from the database with a single read.
   * @param channelId as string.
   * @returns a single document from the database.
   */
  getChannel(channelId: string) {
    const channelCollection = collection(this.firestore, 'channels');
    const channelDocument = doc(channelCollection, channelId);

    return getDoc(channelDocument);
  }
}
