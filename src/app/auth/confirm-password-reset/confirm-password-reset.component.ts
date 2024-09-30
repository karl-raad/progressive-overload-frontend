import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-password-reset',
  standalone: true,
  imports: [FormsModule, MatSnackBarModule],
  templateUrl: './confirm-password-reset.component.html',
  styleUrl: './confirm-password-reset.component.scss'
})
export class ConfirmPasswordResetComponent {
  username: string = '';
  confirmationCode: string = '';
  newPassword: string = '';

  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

  confirmReset() {
    this.authService.confirmPassword(this.username, this.confirmationCode, this.newPassword)
      .then(() => {
        this._snackBar.open('Password reset successfully!', '✔', { duration: 2000 });
        this.router.navigate(['login']);
      })
      .catch(error => {
        console.log(`Error: ${error.message}`);
      });
  }
}
