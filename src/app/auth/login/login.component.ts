import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { environment } from '../../environment';
import { SessionStorageService } from '../../shared/session-storage.service';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    SpinnerComponent]
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  loginForm: FormGroup;

  constructor(private _snackBar: MatSnackBar, private fb: FormBuilder, private authService: AuthService, private router: Router, private sessionStorageService: SessionStorageService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  ngOnInit(): void {
    if (this.authService.isLoggedIn())
      this.router.navigate(['exercise-list']);
  }

  onForgotPassword(): void {
    if (this.loginForm.get('email')?.valid) {
      this.isLoading = true;
      this.authService.requestPasswordReset(this.loginForm.value.email)
        .then(() => {
          this._snackBar.open(`Password reset email sent!`, '✔️', { duration: 2000 });
          this.router.navigate(['confirm-password-reset']);
        })
        .catch(error => {
          this._snackBar.open('Error sending password reset email', '❌', { duration: 2000 });
        })
        .finally(() => this.isLoading = false);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .then(() => {
          this.router.navigate(['exercise-list']);
        })
        .catch(error => {
          this._snackBar.open(`Error: ${error.message}`, '❌', { duration: 2000 });
        })
        .finally(() => {
          this.isLoading = false;
        });

    }
  }
}
