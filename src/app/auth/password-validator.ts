import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.value;

        const minLength = password.length >= 8;
        const requireUppercase = /[A-Z]/.test(password);
        const requireLowercase = /[a-z]/.test(password);
        const requireDigits = /\d/.test(password);
        const requireSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const valid = minLength && requireUppercase && requireLowercase && requireDigits && requireSymbols;

        return valid ? null : {
            passwordStrength: {
                minLength: !minLength,
                requireUppercase: !requireUppercase,
                requireLowercase: !requireLowercase,
                requireDigits: !requireDigits,
                requireSymbols: !requireSymbols
            }
        };
    };
}
