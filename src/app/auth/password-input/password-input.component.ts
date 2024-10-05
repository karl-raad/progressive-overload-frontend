import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-password-input',
  standalone: true,
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule]
})
export class PasswordInputComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() passwordLabel = 'Password';

  getErrors(): string {
    const passwordControl = this.form.get(this.controlName);
    const validationErrors = passwordControl?.errors;
    return validationErrors && validationErrors['messages'] ? validationErrors['messages'] : '';
  }
}
