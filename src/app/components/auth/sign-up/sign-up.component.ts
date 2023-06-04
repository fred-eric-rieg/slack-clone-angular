import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    
  }

  register() {
    this.authService.signUp(
      this.form.value.email,
      this.form.value.password
    ).subscribe({
      next: () => {
        this.snackBar.open("Account created! You can log in now.", "OK", {
          duration: 5000
        })
      },
      error: error => {
        this.snackBar.open(error.message, "OK", {
          duration: 5000
        })
      }
    })
  }

}
