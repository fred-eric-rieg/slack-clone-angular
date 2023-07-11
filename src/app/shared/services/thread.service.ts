import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Thread } from 'src/models/thread.class';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  allThreads!: Observable<any>;

  constructor(private firestore: Firestore) {}

  /**
   * Creating a new thread in the database, sets the threadId to the document id
   * and adds the messageId to the messages array.
   * @param messageId as string.
   * @returns a threadId as string.
   */
  createThread(messageId: string) {
    const threadCollection = collection(this.firestore, 'threads');
    const threadDocument = doc(threadCollection);
    let thread = new Thread(threadDocument.id, [messageId])

    setDoc(threadDocument, thread.toJSON()).then(() => {
      console.log('Thread created successfully!');
    }).catch((error: any) => {
      console.log(error);
    });

    return threadDocument.id;
  }


  loadAllThreads() {
    const threadCollection = collection(this.firestore, 'threads');
    return getDocs(threadCollection);
  }


  loadChannelThreads(threadIds: string[]) {
    const threadCollection = collection(this.firestore, 'threads');
    const q = query(threadCollection, where('threadId', 'in', threadIds));
    return getDocs(q);
  }
}
