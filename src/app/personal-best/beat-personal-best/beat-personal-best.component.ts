import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { ExerciseAddEditComponent } from '../../exercise/exercise-add-edit/exercise-add-edit.component';
import { ExerciseService } from '../../exercise/exercise.service';
import { SessionStorageService } from '../../shared/session-storage.service';
import { finalize } from 'rxjs';
import { Exercise } from '../../exercise/exercise-interface';
import { AppConstants } from '../../app-constants';

@Component({
  selector: 'app-beat-personal-best',
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
  templateUrl: './beat-personal-best.component.html',
  styleUrl: './beat-personal-best.component.scss'
})
export class BeatPersonalBestComponent implements OnInit {
  isLoading = false;
  exerciseForm: FormGroup;

  constructor(
    private exerciseService: ExerciseService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ExerciseAddEditComponent>,
    private formBuilder: FormBuilder,
    private sessionStoreService: SessionStorageService,
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
    this.exerciseForm.patchValue({
      exerciseName: this.data.exerciseName,
      exerciseVolume: this.data.exerciseVolume,
    });
    this.data.exerciseReps.forEach((rep: number, index: number) => {
      this.exerciseReps.push(new FormControl(rep, Validators.required));
      this.exerciseWeights.push(new FormControl(this.data.exerciseWeights[index] || 1, Validators.required));
    });
    this.exerciseReps.valueChanges.subscribe(() => this.updateVolume());
    this.exerciseWeights.valueChanges.subscribe(() => this.updateVolume());
  }

  updateVolume(): void {
    const totalVolume = this.totalVolume;
    this.exerciseForm.get('exerciseVolume')?.setValue(totalVolume, { emitEvent: false });
  }

  addSet(): void {
    let initReps = 1;
    let initWeights = 1;
    if (this.exerciseReps && this.exerciseReps.length > 0)
      initReps = this.exerciseReps.at(this.exerciseReps.length - 1).value;
    if (this.exerciseWeights && this.exerciseWeights.length > 0)
      initWeights = this.exerciseWeights.at(this.exerciseWeights.length - 1).value;
    this.exerciseReps.push(new FormControl(initReps, Validators.required));
    this.exerciseWeights.push(new FormControl(initWeights, Validators.required));
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
        userEmail: this.sessionStoreService.getUserEmail()
      };
      exerciseData.exerciseDate = new Date();
      if (exerciseData.exerciseVolume > this.data.exerciseVolume) {
        this.data.isPersonalBest = 0; // old PB
        exerciseData.isPersonalBest = 1; // new PB
        this.exerciseService.updateExercise(this.data.exerciseId, this.data).pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (val: any) => {
              this.addExercise(exerciseData);
            },
            error: (err: any) => {
              console.error(err);
              this._snackBar.open('Error while updating the exercise!', '❌', { duration: 2000 });
            },
          });
      }
      else {
        exerciseData.isPersonalBest = 0; // no new PB
        this.addExercise(exerciseData);
      }
    }
  }

  addExercise(exercise: Exercise) {
    this.exerciseService.addExercise(exercise)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (result: any) => {
          const state = exercise.exerciseVolume > this.data.exerciseVolume ?
            AppConstants.NEW_PB : AppConstants.NO_NEW_PB;
          exercise.exerciseId = result.exerciseId;
          this.dialogRef.close({ state: state, exercise: exercise });
        },
        error: (err: any) => {
          console.error(err);
          this._snackBar.open('Error while adding the exercise!', '❌', { duration: 2000 });
        },
      });
  }
}
