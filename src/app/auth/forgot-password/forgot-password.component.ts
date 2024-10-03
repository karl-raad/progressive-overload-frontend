import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { SessionStorageService } from '../../shared/session-storage.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterModule,
    SpinnerComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  isLoading = signal(false);
  forgotPasswordForm: FormGroup;

  constructor(private sessionStoreService: SessionStorageService, private _snackBar: MatSnackBar, private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.get('email')?.valid) {
      this.isLoading.set(true);
      this.authService.requestPasswordReset(this.forgotPasswordForm.value.email)
        .then(() => {
          this.sessionStoreService.setUserEmail(this.forgotPasswordForm.value.email);
          this._snackBar.open(`Password reset email sent!`, '✔️', { duration: 2000 });
          this.router.navigate(['confirm-password-reset']);
        })
        .catch(error => {
          this._snackBar.open('Error sending password reset email', '❌', { duration: 2000 });
        })
        .finally(() => this.isLoading.set(false));
    }
  }
}
