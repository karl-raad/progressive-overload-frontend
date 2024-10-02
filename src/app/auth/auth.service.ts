import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { BehaviorSubject } from 'rxjs';
import { SessionStorageService } from '../shared/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userPool: CognitoUserPool;
  private poolData;
  loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private sessionStorageService: SessionStorageService) {
    this.poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    this.userPool = new CognitoUserPool(this.poolData);
  }

  signup(name: string, email: string, password: string): Promise<any> {
    const userAttributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email, }),
      new CognitoUserAttribute({ Name: 'name', Value: name, }),
    ];

    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, userAttributes, [], (err, result) => {
        if (err)
          return reject(err);
        resolve(result);
      });
    });
  }

  login(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const userData = { Username: email, Pool: this.userPool };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          this.sessionStorageService.setUserEmail(email);

          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              console.log(err.message || JSON.stringify(err));
              reject(err);
              return;
            }
            const nameAttribute = attributes?.find(attr => attr.getName() === 'name');
            if (nameAttribute)
              this.sessionStorageService.setUserName(nameAttribute.getValue());

            this.loggedInSubject.next(true);
            resolve(result);
          });
        },
        onFailure: (err) => {
          console.log(err.message || JSON.stringify(err));
          reject(err);
        },
      });
    });
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

  confirmUser(username: string, verificationCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: username,
        Pool: this.userPool,
      };
      const cognitoUser = new CognitoUser(userData);
      cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  confirmPassword(username: string, verificationCode: string, newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: username,
        Pool: this.userPool,
      };
      const cognitoUser = new CognitoUser(userData);
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => resolve('Password reset successful!'),
        onFailure: (err) => reject(err),
      });
    });
  }

  requestPasswordReset(email: string): Promise<any> {
    const userPool = new CognitoUserPool(this.poolData);
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          console.log('Password reset request successful', data);
          resolve(data);
        },
        onFailure: (err) => {
          console.error('Error requesting password reset', err);
          reject(err);
        }
      });
    });
  }
}
