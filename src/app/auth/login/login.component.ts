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
    SpinnerComponent]
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private sessionStorageService: SessionStorageService) {
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
    this.router.navigate(['confirm-password-reset']);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
      let poolData = {
        UserPoolId: environment.cognitoUserPoolId,
        ClientId: environment.cognitoAppClientId
      };

      const userPool = new CognitoUserPool(poolData);
      const userData = { Username: email, Pool: userPool };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          this.sessionStorageService.setUserEmail(email);
          this.authService.loggedInSubject.next(true);
          this.router.navigate(["exercise-list"]);
          this.isLoading = false;
        },
        onFailure: (err) => {
          console.log(err.message || JSON.stringify(err));
          this.isLoading = false;
        },
      });
    }
  }
}
