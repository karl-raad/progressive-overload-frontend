import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { environment } from '../../environment';
import { SessionStorageService } from '../../shared/session-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SpinnerComponent]
})
export class LoginComponent {
  isLoading: boolean = false;
  email: string = '';
  password: string = '';

  constructor(private router: Router, private sessionStorageService: SessionStorageService) { }

  onSignIn(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      let authenticationDetails = new AuthenticationDetails({
        Username: this.email,
        Password: this.password,
      });
      let poolData = {
        UserPoolId: environment.cognitoUserPoolId,
        ClientId: environment.cognitoAppClientId
      };

      let userPool = new CognitoUserPool(poolData);
      let userData = { Username: this.email, Pool: userPool };
      let cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          this.sessionStorageService.setUserEmail(this.email);
          this.router.navigate(["exercise-list"])
        },
        onFailure: (err) => {
          console.log(err.message || JSON.stringify(err));
          this.isLoading = false;
        },
      });
    }
  }
}
