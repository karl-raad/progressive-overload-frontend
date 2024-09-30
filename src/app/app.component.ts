import { Component, ChangeDetectorRef, OnDestroy, inject, ViewChild, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ExerciseListComponent } from './exercise/exercise-list/exercise-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeToggleComponent } from './shared/theme-toggle/theme-toggle.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { environment } from './environment';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { SessionStorageService } from './shared/session-storage.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ExerciseListComponent,
    MatToolbarModule,
    MatButtonModule,
    ThemeToggleComponent,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'progressive-overload-app';
  isLoggedIn = false;
  mobileQuery: MediaQueryList;
  @ViewChild('snav') sidenav!: MatSidenav;
  private _mobileQueryListener: () => void;

  constructor(private authService: AuthService, private router: Router, private sessionStorageService: SessionStorageService) {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedin => {
      this.isLoggedIn = isLoggedin;
    });
  }

  closeSidenav() {
    if (this.sidenav)
      this.sidenav.close();
  }

  onLogout(): void {
    const userPool = new CognitoUserPool({
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
    });

    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.signOut();
      this.router.navigate(['login'])
        .then(() => {
          this.sessionStorageService.clearUserEmail();
          this.closeSidenav();
          console.log('Successfully logged out and navigated to login.');
          this.authService.loggedInSubject.next(false);
        })
        .catch(err => {
          console.error('Navigation error:', err);
        });
    } else {
      console.warn('No user is currently logged in.');
      this.router.navigate(['login']);
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
