import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Channel } from 'src/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  searchValue: string = '';
  channels = new Subject();

  constructor(private firestore: Firestore) {
    this.channels.next(this.onetimeLoadChannels().then((querySnapshot) => {
      const channels: Channel[] = [];
      querySnapshot.forEach((doc) => {
        const channel = new Channel(doc.data());
        channels.push(channel);
      });
      return channels;
   }));
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
  async addThreadToChannel(channel: Channel, threadId: string,) {
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


  updateChannel(channel: Channel) {
    const channelCollection = collection(this.firestore, 'channels');
    const channelDocument = doc(channelCollection, channel.channelId);

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


  getChannelViaThread(threadId: string) {
    const channelCollection = collection(this.firestore, 'channels');
    const q = query(channelCollection, where('threads', 'array-contains', threadId));
    return getDocs(q);
  }
}
