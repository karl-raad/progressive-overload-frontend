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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { Exercise } from '../exercise-interface';

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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    SpinnerComponent,
    MatCardModule
  ],
  templateUrl: './exercise-add-edit.component.html',
  styleUrl: './exercise-add-edit.component.css'
})
export class ExerciseAddEditComponent implements OnInit {

  isLoading = false;
  exerciseForm: FormGroup;
  userEmail = 'karl@aws.com';

  constructor(
    private exerciseService: ExerciseService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ExerciseAddEditComponent>,
    private formBuilder: FormBuilder,
    // @Inject('USER_EMAIL') private userEmail: string
    @Inject(MAT_DIALOG_DATA) public data: Exercise) {
    this.exerciseForm = this.formBuilder.group({
      exerciseDate: [new Date(), Validators.required],
      exerciseName: ['', Validators.required],
      exerciseReps: this.formBuilder.array([]),
      exerciseWeights: this.formBuilder.array([]),
      exerciseVolume: [1, Validators.required],
    });
  }
  ngOnInit(): void {

    if (this.data) {
      this.exerciseForm.patchValue({
        exerciseDate: this.data.exerciseDate,
        exerciseName: this.data.exerciseName,
        exerciseVolume: this.data.exerciseVolume
      });

      this.data.exerciseReps.forEach((rep: number, index: number) => {
        this.exerciseReps.push(new FormControl(rep, Validators.required));
        this.exerciseWeights.push(new FormControl(this.data.exerciseWeights[index] || 1, Validators.required));
      });
    }
    else
      this.addSet();

    this.exerciseReps.valueChanges.subscribe(() => this.updateVolume());
    this.exerciseWeights.valueChanges.subscribe(() => this.updateVolume());
  }

  updateVolume(): void {
    const totalVolume = this.totalVolume;
    this.exerciseForm.get('exerciseVolume')?.setValue(totalVolume, { emitEvent: false });
  }

  addSet(): void {
    this.exerciseReps.push(new FormControl(1, Validators.required));
    this.exerciseWeights.push(new FormControl(1, Validators.required));
    this.updateVolume();
  }

  get exerciseReps(): FormArray {
    return this.exerciseForm.get('exerciseReps') as FormArray;
  }

  get exerciseWeights(): FormArray {
    return this.exerciseForm.get('exerciseWeights') as FormArray;
  }

  get totalVolume(): number {
    let volume = 0;
    const repsLength = this.exerciseReps.length;
    const weightsLength = this.exerciseWeights.length;

    for (let i = 0; i < Math.max(repsLength, weightsLength); i++) {
      const repsValue = this.exerciseReps.at(i)?.value || 1;
      const weightsValue = this.exerciseWeights.at(i)?.value || 1;
      volume += repsValue * weightsValue;
    }
    return volume;
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
      this.isLoading = true;
      const exerciseData: Exercise = {
        ...this.exerciseForm.value,
        userEmail: this.userEmail
      };
      if (this.data) {
        this.exerciseService.updateExercise(this.data.exerciseId, exerciseData)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (val: any) => {
              this._snackBar.open('Exercise details updated successfully!', '✔', { duration: 2000 });
              this.dialogRef.close(this.exerciseForm.value);
            },
            error: (err: any) => {
              console.error(err);
              this._snackBar.open('Error while updating the exercise!', '✘', { duration: 2000 });
            },
          });
      } else {
        this.exerciseService.addExercise(exerciseData)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (val: any) => {
              this._snackBar.open('Exercise added successfully!', '✔', { duration: 2000 });
              this.dialogRef.close(this.exerciseForm.value);
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
