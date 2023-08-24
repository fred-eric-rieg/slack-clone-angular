import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Thread } from 'src/models/thread.class';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  private threadCollection = collection(this.firestore, 'threads');
  private messageCollection = collection(this.firestore, 'messages');


  constructor(
    private firestore: Firestore,
  ) { }


}
