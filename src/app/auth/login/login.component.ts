import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../shared/session-storage.service';

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
    RouterModule,
    SpinnerComponent]
})
export class LoginComponent implements OnInit {
  isLoading = signal(false);
  loginForm: FormGroup;

  constructor(private sessionStoreService: SessionStorageService, private _snackBar: MatSnackBar, private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  ngOnInit(): void {
    if (this.authService.isLoggedIn())
      this.router.navigate(['exercise-list']);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .then(() => {
          this.router.navigate(['exercise-list']);
        })
        .catch(error => {
          this._snackBar.open(`Error: ${error.message}`, '❌', { duration: 2000 });
        })
        .finally(() => {
          this.isLoading.set(false);
        });

    }
  }
}
