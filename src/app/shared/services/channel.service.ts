import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, onSnapshot, query, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  channelCollection = collection(this.firestore, 'channels');
  allChannels$ = collectionData(this.channelCollection) as Observable<Channel[]>;
  

  // Listens to all channels in the database for changes.
  q = query(this.channelCollection);
  unsubscribe = onSnapshot(this.q, (snapshot: { docChanges: () => any[]; }) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("New channel: ", change.doc.data());
        this.allChannels$.subscribe((channels) => {
          let newChannels = channels;
          newChannels.push(new Channel(change.doc.data()));
          this.allChannels$ = new Observable<Channel[]>((observer) => {
            observer.next(newChannels);
          });
        });
      }
      if (change.type === "modified") {
        console.log("Modified channel: ", change.doc.data());
        this.allChannels$.subscribe((channels) => {
          let newChannels = channels;
          newChannels.forEach((channel) => {
            if (channel.channelId === change.doc.data().channelId) {
              channel = new Channel(change.doc.data());
            }
          });
          this.allChannels$ = new Observable<Channel[]>((observer) => {
            observer.next(newChannels);
          });
        });
      }
      if (change.type === "removed") {
        console.log("Removed channel: ", change.doc.data());
      }
    });
  });


  constructor(private firestore: Firestore) {}

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
  createNewChannel(channel: Channel) {
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
