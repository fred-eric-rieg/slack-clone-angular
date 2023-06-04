import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]]
      })
  }
  
  recoverPassword() {
    this.authService.recoverPassword(
      this.form.value.email
    ).subscribe({
      next: () => {
        this.snackBar.open("You can recover your password in your email account.", "OK", {
          duration: 5000
        });
      },
      error: error => {
        this.snackBar.open(error.message, "OK", {
          duration: 5000
        })
      }
    })
  }


}
