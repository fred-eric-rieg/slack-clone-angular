import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Thread } from 'src/models/thread.class';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  private threadCollection = collection(this.firestore, 'threads');

  channelThreads$ = new Observable<Thread[]>();


  constructor(
    private firestore: Firestore,
  ) { }


  loadThreads(threads: string[]) {
    console.log('Thread Service received threads: ', threads);
    if (threads.length > 0) {
      const q = query(this.threadCollection, where('threadId', 'in', threads));
      this.channelThreads$ = collectionData(q).pipe(map(threads => {
        return threads.map(thread => {
          return new Thread(thread);
        })
      }));
    } else {
      this.channelThreads$ = new Observable<Thread[]>();
    }
  }


  addThread(thread: Thread) {
    console.log('Thread Service will add thread: ', thread);
    this.channelThreads$.pipe(map(threads => {
      return [...threads, thread];
    }));
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
