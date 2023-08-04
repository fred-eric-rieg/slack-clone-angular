import { Injectable } from '@angular/core';
import { Firestore, Query, Unsubscribe, collection, collectionData, doc, getDocs, onSnapshot, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Thread } from 'src/models/thread.class';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  private threadCollection = collection(this.firestore, 'threads');

  channelThreads$!: Observable<Thread[]>;
  threadMessages$!: Observable<Thread[]>;

  /**
   * Subscribes to the thread collection and listens for changes.
   * If a change occurs, the change is processed.
   */
  public q: Query<unknown> | undefined;
  unsubscribe: Unsubscribe | undefined;


  constructor(
    private firestore: Firestore,
  ) { }

  /**
   * Adds a new thread to the channelThreads$ Observable.
   * @param change as any.
   */
  private addNewThread(change: any) {
    console.log("New thread: ", change);
    this.channelThreads$.pipe(map(threads => {
      return [...threads, new Thread(change)]
    }));
  }

  /**
   * Modifies a thread in the channelThreads$ Observable.
   * @param change as any.
   */
  private modifyThread(change: any) {
    console.log("Modified thread: ", change);
    this.channelThreads$.pipe(map(threads => {
      return threads.map(thread => {
        if (thread.threadId === change.threadId) {
          return change;
        }
        return thread;
      });
    }));
  }

  /**
   * Removes a thread from the channelThreads$ Observable.
   * @param change as any.
   */
  private removeThread(change: any) {
    console.log("Removed thread: ", change);
    this.channelThreads$.pipe(map(threads => {
      return threads.filter(thread => thread.threadId !== change.threadId);
    }));
  }

  /**
   * Updates the query to listen for changes in the specified channel collection.
   * @param channelName as string.
   */
  async updateQuery(threads: string[]) {
    console.log('Thread Service received threads: ', threads);
    this.loadThreads(threads);
    this.unsubscribe ? this.unsubscribe() : null; // Unsubscribe from the old query
    this.q = query(this.threadCollection, where('threadId', 'in', threads)); // Create a new query
    this.unsubscribe = onSnapshot(this.q, (snapshot: { docChanges: () => any[]; }) => { // Subscribe to the new query
      snapshot.docChanges().forEach((change) => {
        change.type === "added" ? this.addNewThread(change.doc.data()) : null;
        change.type === "modified" ? this.modifyThread(change.doc.data()) : null;
        change.type === "removed" ? this.removeThread(change.doc.data()) : null;
      });
    });
  }


  loadThreads(threads: string[]) {
    console.log('Loading threads in thread service...');
    const q = query(this.threadCollection, where('threadId', 'in', threads));
    this.channelThreads$ = collectionData(q) as Observable<Thread[]>;
  }


  /**
   * Creating a new thread in the database, sets the threadId to the document id
   * and adds the messageId to the messages array.
   * @param messageId as string.
   * @returns a threadId as string.
   */
  async createThread(messageId: string) {
    const threadCollection = collection(this.firestore, 'threads');
    const threadDocument = doc(threadCollection);
    let thread = new Thread({ threadId: threadDocument.id, messages: [messageId] })

    setDoc(threadDocument, thread.toJSON()).then(() => {
      console.log('Thread created successfully!');
    }).catch((error: any) => {
      console.log(error);
    });

    return threadDocument.id;
  }


  async addMessageToThread(thread: Thread, messageId: string) {
    const threadCollection = collection(this.firestore, 'threads');
    const threadDocument = doc(threadCollection, thread.threadId);

    thread.messages.push(messageId);

    setDoc(threadDocument, thread).then(() => {
      console.log('Message added to thread successfully!');
    });
  }


  loadAllThreads() {
    return getDocs(this.threadCollection);
  }


  loadChannelThreads(threadIds: string[]) {
    const q = query(this.threadCollection, where('threadId', 'in', threadIds));
    return getDocs(q);
  }
}
