import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-registration',
  standalone: true,
  imports: [MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
    MatSnackBarModule],
  templateUrl: './confirm-registration.component.html',
  providers: [AuthService],
  styleUrl: './confirm-registration.component.scss'
})
export class ConfirmRegistrationComponent {
  confirmationForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    this.confirmationForm = this.fb.group({
      username: ['', Validators.required],
      confirmationCode: ['', Validators.required],
    });
  }

  confirmUser() {
    if (this.confirmationForm.valid) {
      this.isLoading = true;
      const { username, confirmationCode } = this.confirmationForm.value;
      this.authService.confirmUser(username, confirmationCode)
        .then((result) => {
          this._snackBar.open('User confirmed successfully!', '️✔️', { duration: 2000 });
          this.router.navigate(['/exercise-list']);
        })
        .catch((error) => {
          console.log(`Error: ${error.message}`);
          this._snackBar.open('User confirmation failed!', '❌', { duration: 2000 });
        })
        .finally(() => this.isLoading = false);
    }
  }
}
