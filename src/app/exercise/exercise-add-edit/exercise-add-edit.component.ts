import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormsModule, FormArray, FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExerciseService } from '../exercise.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-exercise-add-edit',
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
  templateUrl: './exercise-add-edit.component.html',
  styleUrl: './exercise-add-edit.component.css'
})
export class ExerciseAddEditComponent implements OnInit {
  exerciseForm: FormGroup;

  constructor(
    private exerciseService: ExerciseService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ExerciseAddEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.exerciseForm = this.formBuilder.group({
      exerciseDate: [new Date(), Validators.required],
      exerciseName: ['', Validators.required],
      exerciseReps: this.formBuilder.array([]),
      exerciseWeights: this.formBuilder.array([]),
      exerciseVolume: [1, Validators.required]
    });
  }
  ngOnInit(): void {
    this.exerciseForm.patchValue(this.data);
    this.addSet();
  }

  addSet(): void {
    this.exerciseReps.push(new FormControl(1, Validators.required));
    this.exerciseWeights.push(new FormControl(1, Validators.required));
  }

  get exerciseReps(): FormArray {
    return this.exerciseForm.get('exerciseReps') as FormArray;
  }

  get exerciseWeights(): FormArray {
    return this.exerciseForm.get('exerciseWeights') as FormArray;
  }

  removeSet(index: number): void {
    this.exerciseReps.removeAt(index);
    this.exerciseWeights.removeAt(index);
  }

  getRepControl(index: number): FormControl {
    return this.exerciseReps.at(index) as FormControl;
  }

  getWeightControl(index: number): FormControl {
    return this.exerciseWeights.at(index) as FormControl;
  }

  onSubmit() {
    if (this.exerciseForm.valid) {
      if (this.data) {
        this.exerciseService
          .updateExercise(this.data.id, this.exerciseForm.value)
          .subscribe({
            next: (val: any) => {
              this._snackBar.open('Exercise details updated successfully!', '✔', { duration: 2000 });
              this.dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
              this._snackBar.open('Error while updating the exercise!', '✘', { duration: 2000 });
            },
          });
      } else {
        this.exerciseService.addExercise(this.exerciseForm.value).subscribe({
          next: (val: any) => {
            this._snackBar.open('Exercise added successfully!', '✔', { duration: 2000 });
            this.exerciseForm.reset();
            this.dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
            this._snackBar.open('Error while adding the exercise!', '✘', { duration: 2000 });
          },
        });
      }
    }
  }

}
