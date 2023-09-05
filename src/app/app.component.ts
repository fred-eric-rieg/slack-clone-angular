import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Slacky';

  constructor(private fireAuth: AngularFireAuth) {}

  ngOnInit() {
  //   this.fireAuth.onAuthStateChanged(user => {
  //     if (user) {
  //       // Benutzer ist eingeloggt
  //       console.log('Benutzer ist eingeloggt:', user);
  //     } else {
  //       // Benutzer ist ausgeloggt
  //       console.log('Benutzer ist ausgeloggt');
  //     }
  //   });
  // }
  }
}
