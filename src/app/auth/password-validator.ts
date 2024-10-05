import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.value;
        const errors: ValidationErrors = {};
        const containMessages: string[] = [];

        if (password == null) {
            return null;
        }

        // Check minimum length
        if (password.length < 8) {
            errors['minlength'] = true;
            containMessages.push('8 characters');
        }

        // Password strength checks
        if (!/[A-Z]/.test(password)) {
            errors['requireUppercase'] = true;
            containMessages.push('one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors['requireLowercase'] = true;
            containMessages.push('one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors['requireDigits'] = true;
            containMessages.push('one digit');
        }
        if (!/[!@#$%^&*()\-_=+{}[\]:;"',.<>?\/\\|`~]/.test(password)) {
            errors['requireSymbols'] = true;
            containMessages.push('one special character');
        }

        if (containMessages.length) {
            let message;
            if (containMessages.length > 1) {
                message = `Password must contain at least ${containMessages.slice(0, -1).join(', ')} and ${containMessages[containMessages.length - 1]}.`;
            } else {
                message = `Password must contain at least ${containMessages[0]}.`;
            }
            return {
                errors,
                messages: message
            };
        }
        return null;
    };
}
