import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateLessThan(startDateControlName: string, endDateControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
        const startDate = formGroup.get(startDateControlName)?.value;
        const endDate = formGroup.get(endDateControlName)?.value;

        return startDate && endDate && new Date(startDate) > new Date(endDate)
            ? { 'datesNotValid': true }
            : null;
    };
}