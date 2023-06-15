import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit{

  users: any;

  // Import des Firestore Services
  constructor(private firestore: Firestore) {}


  ngOnInit() {
    // OnInit wird aufgerufen und aus Firestore wird die Collection 'users' abgerufen.
    // Danach wird die Collection in ein Observable umgewandelt und in this.users gespeichert.
    // Innerhalb der Subscription kann man auf die Daten zugreifen und diese kopieren.
    console.log("test");
    const collectionInstance = collection(this.firestore, 'users');
    this.users = collectionData(collectionInstance);
    this.users.subscribe((data: any) => {
      console.log(data);
    });
  }


  user: User = new User();

}
