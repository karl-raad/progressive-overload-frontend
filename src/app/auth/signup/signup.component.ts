import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../shared/session-storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
  imports: [MatSnackBarModule, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule, CommonModule, ReactiveFormsModule, SpinnerComponent]
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = signal(false);

  constructor(private sessionStoreService: SessionStorageService, private fb: FormBuilder, private router: Router, private authService: AuthService, private _snackBar: MatSnackBar) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      const { name, email, password } = this.signupForm.value;
      this.authService.signup(name, email, password).then(() => {
        this._snackBar.open('Registration successful! Please check your email for confirmation.', '✔', { duration: 3000 });
        this.sessionStoreService.setUserEmail(email);
        this.signupForm.reset();
        this.router.navigate(['/confirm-registration']);
      }).catch(error => {
        console.error('Signup error:', error);
        this._snackBar.open('Error during signup: ' + (error.message || 'Please try again.'), '✖', { duration: 3000 });
      })
        .finally(() => this.isLoading.set(false));
    } else {
      this._snackBar.open('Please fill in the form correctly.', '✖', { duration: 3000 });
    }
  }
}
