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
  private provider = new GoogleAuthProvider();
  public tokenName: string = 'logged-token';

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,
    private router: Router,
  ) { }

  signIn(email: string, password: string): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(email, password))
      .pipe(
        catchError((error: FirebaseError) =>
          throwError(() => new Error(this.translateFirebaseErrorMessage(error))))
      )
  }

  signUp(email: string, password: string): Observable<any> {
    return from(
      this.auth.createUserWithEmailAndPassword(email, password)
        .then((userCred) => {
          this.userService.setNewUser(userCred.user?.uid!, email)
        }))
      .pipe(
        catchError((error: FirebaseError) =>
          throwError(() => new Error(this.translateFirebaseErrorMessage(error))))
      )
  }

  recoverPassword(email: string): Observable<any> {
    return from(this.auth.sendPasswordResetEmail(email))
      .pipe(
        catchError((error: FirebaseError) =>
          throwError(() => new Error(this.translateFirebaseErrorMessage(error))))
      )
  }

  signInWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, this.provider).then( ()=> {
      this.router.navigate(['/dashboard']);
    });
    this.userService.setNewUser(auth.currentUser?.uid!, auth.currentUser?.email!);
  }

  isLoggedIn() {
    return localStorage.getItem(this.tokenName) != null;
  }

  logout() {
    localStorage.removeItem(this.tokenName);
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
