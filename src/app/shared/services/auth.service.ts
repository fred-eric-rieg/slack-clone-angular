import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { GoogleAuthProvider, getAuth, signInWithPopup } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { catchError, from, Observable, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = getAuth();
  private provider = new GoogleAuthProvider();


  constructor(
    private fireAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router,
  ) { }


  signIn(email: string, password: string): Observable<any> {
    return from(this.fireAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        catchError((error: FirebaseError) =>
          throwError(() => new Error(this.translateFirebaseErrorMessage(error))))
      )
  }


  signUp(email: string, password: string): Observable<any> {
    return from(
      this.fireAuth.createUserWithEmailAndPassword(email, password)
        .then((userCred) => {
          this.userService.setNewUser(userCred.user?.uid!, email)
        }))
      .pipe(
        catchError((error: FirebaseError) =>
          throwError(() => new Error(this.translateFirebaseErrorMessage(error))))
      )
  }


  recoverPassword(email: string): Observable<any> {
    return from(this.fireAuth.sendPasswordResetEmail(email))
      .pipe(
        catchError((error: FirebaseError) =>
          throwError(() => new Error(this.translateFirebaseErrorMessage(error))))
      )
  }


  signInWithGoogle() {
    signInWithPopup(this.auth, this.provider).then(() => {
      this.userService.setNewUser(this.auth.currentUser?.uid!, this.auth.currentUser?.email!);
      this.router.navigate(['/dashboard']);
    });
  }


  isLoggedIn(): boolean {
    let isLoggedIn = false;
    this.fireAuth.onAuthStateChanged(user => {
      if (user) {
        isLoggedIn = true;
      } else {
        isLoggedIn = false;
      }
    });

    console.log("IST EINGELOGGT DER XXXXX", isLoggedIn);
    return isLoggedIn;
  }

  /**
   * This function logs out the user from firebase.
   */
  logout() {
    this.fireAuth.signOut();
    localStorage.clear();
  }


  private translateFirebaseErrorMessage({ code, message }: FirebaseError) {
    if (code === "auth/user-not-found") {
      return "User not found.";
    }
    if (code === "auth/wrong-password") {
      return "Wrong password.";
    }
    return message;
  }
}
