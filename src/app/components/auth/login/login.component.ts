import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChannelService } from 'src/app/shared/services/channel.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  isPasswordVisible: boolean = false;
  visibiltyIcon: string = 'visibility';
  form!: FormGroup;


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private channelService: ChannelService
  ) {

  }


  ngOnInit(): void {
    console.log('LoginComponent initialized');
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
    this.channelService.unsubscribe(); // Unsubscribe form Change-Listener to prevent memory leaks.
  }


  login() {
    this.authService.signIn(
      this.form.value.email,
      this.form.value.password
    ).subscribe({
      next: () => {
        this.router.navigate(['dashboard'])
      },
      error: error => {
        this.snackBar.open(error.message, "OK", {
          duration: 5000
        })
      }
    })
  }

  /**
   * This function logs in the user with the guest account.
   */
  guestLogin() {
    this.authService.signIn(
      'guest@user.de',
      'guest1'
    ).subscribe({
      next: () => {
        this.router.navigate(['dashboard'])
      },
      error: error => {
        this.snackBar.open(error.message, "OK", {
          duration: 5000
        });
      }
    });
  }


  signInWithGoogle() {
      this.authService.signInWithGoogle();
    }

  /**
   * This function toggles the visibility of password
   * in login component and change the eye icon
   * @param passwordInput get password input element of html
   */
  togglePwVisibility(passwordInput: HTMLInputElement) {
      this.isPasswordVisible = !this.isPasswordVisible;
      passwordInput.type = this.isPasswordVisible ? 'text' : 'password';
      this.visibiltyIcon = this.isPasswordVisible ? 'visibility_off' : 'visibility';
    }

}
