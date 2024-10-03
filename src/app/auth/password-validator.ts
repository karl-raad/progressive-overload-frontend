import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.value;
        const errors: ValidationErrors = {};

        if (password == null) {
            return null;
        }

        // Check minimum length
        if (password.length < 8) {
            errors['minlength'] = true;
        }

        // Password strength checks
        if (!/[A-Z]/.test(password)) {
            errors['requireUppercase'] = true;
        }
        if (!/[a-z]/.test(password)) {
            errors['requireLowercase'] = true;
        }
        if (!/[0-9]/.test(password)) {
            errors['requireDigits'] = true;
        }
        if (!/[!@#$%^&*()\-_=+{}[\]:;"',.<>?\/\\|`~]/.test(password)) {
            errors['requireSymbols'] = true;
        }

        return Object.keys(errors).length ? errors : null;
    };
}
