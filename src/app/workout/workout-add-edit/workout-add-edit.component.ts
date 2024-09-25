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
    CommonModule
  ],
  templateUrl: './workout-add-edit.component.html',
  styleUrl: './workout-add-edit.component.css'
})
export class WorkoutAddEditComponent implements OnInit {
  workoutForm: FormGroup;

  constructor(
    private workoutService: WorkoutService,
    private dialogRef: MatDialogRef<WorkoutAddEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.workoutForm = this.formBuilder.group({
      workoutName: ['', Validators.required],
      date: ['', Validators.required]
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
              alert('Workout details updated!');
              this.dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
              alert("Error while updating the workout!");
            },
          });
      } else {
        this.workoutService.addWorkout(this.workoutForm.value).subscribe({
          next: (val: any) => {
            alert('Workout added successfully!');
            this.workoutForm.reset();
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
            alert("Error while adding the workout!");
          },
        });
      }
    }
  }

}
