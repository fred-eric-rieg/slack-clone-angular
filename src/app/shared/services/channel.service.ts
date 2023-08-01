import { Injectable } from '@angular/core';
import { DocumentData, Firestore, QuerySnapshot, collection, doc, getDocs, onSnapshot, query, setDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  searchValue: string = '';
  channelCollection = collection(this.firestore, 'channels')

  // Listens to all channels in the database for changes.
  q = query(this.channelCollection);
  unsubscribe = onSnapshot(this.q, (snapshot: { docChanges: () => any[]; }) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("New channel: ", change.doc.data());
      }
      if (change.type === "modified") {
        console.log("Modified channel: ", change.doc.data());
      }
      if (change.type === "removed") {
        console.log("Removed channel: ", change.doc.data());
      }
    });
  });


  constructor(private firestore: Firestore) {
  }

  /**
   * Gets a single channel from the database.
   * @param channelId as string.
   */
  async getSingleChannel(channelId: string): Promise<Observable<Channel>> {
      const q = query(this.channelCollection, where('channelId', '==', channelId));
      const channelDocument = await getDocs(q);
      return this.createObservableChannel(channelDocument);
  }

  /**
   * Create a single observable channel.
   * @param channelDocument as DocumentReference.
   * @returns an observable.
   */
  createObservableChannel(channelDocument: DocumentData): Observable<Channel> {
    return new Observable<Channel>((observer) => {
      observer.next(new Channel(channelDocument['docs'][0].data()));
    });
  }

  /**
   * Gets all channels from the database.
   */
  async getAllChannels(): Promise<Observable<Channel[]>> {
    const channelDocuments = await getDocs(this.channelCollection);
    return this.createObservableChannels(channelDocuments);
  }


  /**
   * Create an observable with all channels.
   * @param channelDocuments as QuerySnapshot<DocumentData>.
   * @returns an observable.
   */
  createObservableChannels(channelDocuments: QuerySnapshot<DocumentData>): Observable<Channel[]> {
    let channels: Channel[] = [];
    channelDocuments.forEach((doc) => {
      const channel = new Channel(doc.data());
      channels.push(channel);
    });
    return new Observable<Channel[]>((observer) => {
      observer.next(channels);
    });
  }

  /**
   * Returns a promise with all channels that contain the threadId (usualy only one).
   * @param threadId as string.
   * @returns a promise.
   */
  getChannelViaThread(threadId: string) {
    const q = query(this.channelCollection, where('threads', 'array-contains', threadId));
    return getDocs(q);
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
