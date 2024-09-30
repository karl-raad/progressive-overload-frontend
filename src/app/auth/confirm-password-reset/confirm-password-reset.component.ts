import { Component } from '@angular/core';
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
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmationCode: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.isLoading = true;
      const { email, newPassword, confirmationCode } = this.resetForm.value;
      this.authService.confirmPassword(email, newPassword, confirmationCode)
        .then(() => {
          this._snackBar.open('Password reset successfully!', '️✔️', { duration: 2000 });
          this.router.navigate(['login']);
        })
        .catch(error => {
          console.log(`Error: ${error.message}`);
          this._snackBar.open(`Error: ${error.message}`, '❌', { duration: 2000 });
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
}
