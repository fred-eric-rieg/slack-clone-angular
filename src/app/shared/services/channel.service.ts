import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  channels!: Observable<any>;

  constructor(private firestore: Firestore) {
    this.loadChannel();
   }


  loadChannel() {
    const channelCollection = collection(this.firestore, 'channels');
    this.channels = collectionData(channelCollection);
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
   * Retrieves a channel from the database.
   * @param channelId as string.
   * @returns a document snapshot of the channel.
   */
  getChannel(channelId: string) {
    const channelCollection = collection(this.firestore, 'channels');
    const channelDocument = doc(channelCollection, channelId);

    return getDoc(channelDocument);
  }
}
