import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userPool: CognitoUserPool;
  private poolData;
  loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor() {
    this.poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    this.userPool = new CognitoUserPool(this.poolData);
  }

  isLoggedIn(): boolean {
    let isAuth = false;
    let cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err)
          console.log(err.message || JSON.stringify(err));
        isAuth = session.isValid();
      })
    }
    this.loggedInSubject.next(isAuth);
    return isAuth;
  }

  confirmUser(username: string, confirmationCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: username,
        Pool: this.userPool,
      };
      const cognitoUser = new CognitoUser(userData);
      cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  confirmPassword(username: string, confirmationCode: string, newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: username,
        Pool: this.userPool,
      };

      const cognitoUser = new CognitoUser(userData);
      cognitoUser.confirmPassword(confirmationCode, newPassword, {
        onSuccess: () => resolve('Password reset successful!'),
        onFailure: (err) => reject(err),
      });
    });
  }
}
