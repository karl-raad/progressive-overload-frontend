import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userPool: CognitoUserPool;
  private poolData;
  private storageKey = 'userEmail';

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

  setUserEmail(data: any): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getUserEmail(): any {
    const data = sessionStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  clearUserEmail(): void {
    sessionStorage.removeItem(this.storageKey);
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
