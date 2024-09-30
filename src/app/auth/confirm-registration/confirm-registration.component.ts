import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './confirm-registration.component.html',
  providers: [AuthService],
  styleUrl: './confirm-registration.component.scss'
})
export class ConfirmRegistrationComponent {
  username: string = '';
  confirmationCode: string = '';

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) { }

  confirmUser() {
    this.authService.confirmUser(this.username, this.confirmationCode)
      .then((result) => {
        this._snackBar.open('User confirmed successfully!', '️✔️', { duration: 2000 });
        this.router.navigate(['/exercise-list']);
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
        this._snackBar.open('User confirmation failed!', '❌', { duration: 2000 });
      });
  }
}
