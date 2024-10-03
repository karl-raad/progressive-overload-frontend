import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { SessionStorageService } from '../../shared/session-storage.service';
import { passwordValidator } from '../password-validator';

@Component({
  selector: 'app-confirm-password-reset',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
    MatSnackBarModule],
  templateUrl: './confirm-password-reset.component.html',
  styleUrl: './confirm-password-reset.component.scss'
})
export class ConfirmPasswordResetComponent {
  resetForm: FormGroup;
  isLoading = signal(false);

  constructor(private sessionStoreService: SessionStorageService, private fb: FormBuilder, private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
      verificationCode: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading.set(true);
      const { newPassword, verificationCode } = this.resetForm.value;
      this.authService.confirmPassword(this.sessionStoreService.getUserEmail(), verificationCode, newPassword)
        .then(() => {
          this._snackBar.open('Password reset successfully!', '️✔️', { duration: 2000 });
          this.router.navigate(['login']);
        })
        .catch(error => {
          console.log(`Error: ${error.message}`);
          this._snackBar.open(`Error: ${error.message}`, '❌', { duration: 2000 });
        })
        .finally(() => {
          this.isLoading.set(false);
        });
    }
  }
}
