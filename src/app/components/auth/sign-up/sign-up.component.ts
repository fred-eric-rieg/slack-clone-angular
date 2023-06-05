import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  isPasswordVisible: boolean = false;
  visibiltyIcon: string = 'visibility';
  minLengthPassword: number = 5;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
      this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
      })
  }

  register() {
    this.authService.signUp(
      this.form.value.email,
      this.form.value.password
    ).subscribe({
      next: () => {
        this.router.navigate(['']);
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

  togglePwVisibility(passwordInput: HTMLInputElement) {
    this.isPasswordVisible = !this.isPasswordVisible;
    passwordInput.type = this.isPasswordVisible ? 'text' : 'password';
    this.visibiltyIcon = this.isPasswordVisible ? 'visibility_off' : 'visibility';
  }

}
