import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionStorageService } from '../../shared/session-storage.service';

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
export class ConfirmRegistrationComponent implements OnInit {
  confirmationForm: FormGroup;
  email: string | null = null;
  isLoading = signal(false);

  constructor(private sessionStoreService: SessionStorageService, private route: ActivatedRoute, private fb: FormBuilder, private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    this.confirmationForm = this.fb.group({
      verificationCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.email = params.get('userEmail');
      if (this.email)
        this.sessionStoreService.setUserEmail(this.email);
      else {
        this._snackBar.open('No email found in the URL.', '❌', { duration: 3000 });
      }
    });
  }

  confirmUser() {
    if (this.confirmationForm.valid) {
      if (!this.email) {
        this._snackBar.open('Email is missing!', '❌', { duration: 2000 });
        return;
      }

      this.isLoading.set(true);
      const { verificationCode } = this.confirmationForm.value;
      this.authService.confirmUser(this.email, verificationCode)
        .then((result) => {
          this._snackBar.open('User confirmed successfully!', '️✔️', { duration: 2000 });
          this.router.navigate(['/exercise-list']);
        })
        .catch((error) => {
          console.log(`Error: ${error.message}`);
          this._snackBar.open('User confirmation failed!', '❌', { duration: 2000 });
        })
        .finally(() => this.isLoading.set(false));
    }
  }

}
