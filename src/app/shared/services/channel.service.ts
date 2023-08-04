import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, onSnapshot, query, setDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Channel } from 'src/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  channelCollection = collection(this.firestore, 'channels');
  allChannels$ = collectionData(this.channelCollection) as Observable<Channel[]>;


  /**
   * Subscribes to the channel collection and listens for changes.
   * If a change occurs, the change is processed.
   */
  q = query(this.channelCollection);
  unsubscribe = onSnapshot(this.q, (snapshot: { docChanges: () => any[]; }) => {
    snapshot.docChanges().forEach((change) => {
      change.type === "added" ? this.addNewChannel(change.doc.data()) : null;
      change.type === "modified" ? this.modifyChannel(change.doc.data()) : null;
      change.type === "removed" ? this.removeChannel(change.doc.data()) : null;
    });
  });


  constructor(private firestore: Firestore) { }

  /**
   * Adds a new channel to the allChannels$ Observable.
   * @param change as any.
   */
  addNewChannel(change: any) {
    console.log("New channel: ", change);
    this.allChannels$.pipe(map(channels => {
      return [...channels, new Channel(change)]
    }));
  };

  /**
   * Updates a channel in the allChannels$ Observable.
   * @param change as any.
   */
  modifyChannel(change: any) {
    console.log("Modified channel: ", change);
    this.allChannels$.pipe(map(channels => {
      return channels.map(channel => {
        if (channel.channelId === change.channelId) {
          return change;
        }
        return channel;
      })
    }));
  }

  /**
   * Removes a channel from the allChannels$ Observable.
   * @param change as any.
   */
  removeChannel(change: any) {
    console.log("Removed channel: ", change);
    // Wriite code to remove channel from allChannels$ Observable.
  }

  /**
   * Subscribes to all channels and returns the channel that includes the threadId.
   * @param threadId as string.
   * @returns a channel that includes the threadId.
   */
  getChannelViaThread(threadId: string) {
    let channel: Channel = new Channel();

    this.allChannels$.subscribe(channels => {
      channel = channels.filter(channel => channel.threads.includes(threadId))[0];
    }
    );

    return channel;
  }

  /**
   * Updates the channel in the database.
   * @param channel as Channel.
   */
  async updateChannel(channel: Channel) {
    const channelDocument = doc(this.channelCollection, channel.channelId);

    setDoc(channelDocument, channel).then(() => {
      console.log('Channel updated successfully!');
    }).catch((error: any) => {
      console.log(error);
    }
    );
  }

  /**
   * Creates a new channel in the database.
   * @param channel as Channel.
   */
  async createNewChannel(channel: Channel) {
    const channelDocument = doc(this.channelCollection);

    channel.channelId = channelDocument.id;

    setDoc(channelDocument, channel.toJSON()).then(() => {
      console.log('Channel created successfully!');
    }).catch((error: any) => {
      console.log(error);
    }
    );
  }
}