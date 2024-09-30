import { Component } from '@angular/core';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

interface formDataInterface {
  "name": string;
  "email": string;
  [key: string]: string;
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SpinnerComponent]
})
export class SignupComponent {
  isLoading: boolean = false;
  email: string = '';
  name: string = '';
  password: string = '';

  constructor(private router: Router) { }

  onSignup(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      let poolData = {
        UserPoolId: environment.cognitoUserPoolId,
        ClientId: environment.cognitoAppClientId
      };
      let userPool = new CognitoUserPool(poolData);
      let attributeList = [];
      let formData: formDataInterface = {
        "email": this.email,
        "name": this.name,
      }

      for (let key in formData) {
        let attrData = {
          Name: key,
          Value: formData[key]
        }
        let attribute = new CognitoUserAttribute(attrData);
        attributeList.push(attribute)
      }
      userPool.signUp(this.email, this.password, attributeList, [], (
        err,
        result
      ) => {
        this.isLoading = false;
        if (err) {
          console.log(err.message || JSON.stringify(err));
          return;
        }
        this.router.navigate(['/confirm-registration']);
      });
    }
  }
}
