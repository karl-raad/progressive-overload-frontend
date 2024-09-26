import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WorkoutService } from '../workout.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workout-add-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './workout-add-edit.component.html',
  styleUrl: './workout-add-edit.component.css'
})
export class WorkoutAddEditComponent implements OnInit {
  workoutForm: FormGroup;

  constructor(
    private workoutService: WorkoutService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<WorkoutAddEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.workoutForm = this.formBuilder.group({
      workoutName: ['', Validators.required],
      date: [new Date(), Validators.required]
    });
  }
  ngOnInit(): void {
    this.workoutForm.patchValue(this.data);
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      if (this.data) {
        this.workoutService
          .updateWorkout(this.data.id, this.workoutForm.value)
          .subscribe({
            next: (val: any) => {
              this._snackBar.open('Workout details updated successfully!', '✔', { duration: 2000 });
              this.dialogRef.close(true);
            },
            error: (err: any) => {
              this._snackBar.open('Error while updating the workout!', '✘', { duration: 2000 });
            },
          });
      } else {
        this.workoutService.addWorkout(this.workoutForm.value).subscribe({
          next: (val: any) => {
            this._snackBar.open('Workout added successfully!', '✔', { duration: 2000 });
            this.workoutForm.reset();
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
            this._snackBar.open('Error while adding the workout!', '✘', { duration: 2000 });
          },
        });
      }
    }
  }

}
