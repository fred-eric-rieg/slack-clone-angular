import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Thread } from 'src/models/thread.class';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  allThreads!: Observable<any>;

  constructor(private firestore: Firestore) {
    this.loadAllThreads();
  }

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
    this.allThreads = collectionData(threadCollection);
  }
}
