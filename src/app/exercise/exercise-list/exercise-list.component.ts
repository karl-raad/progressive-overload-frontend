import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseService } from '../exercise.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ExerciseAddEditComponent } from '../exercise-add-edit/exercise-add-edit.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { finalize, map, startWith } from 'rxjs';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { Exercise, ExerciseData } from '../exercise-interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { SessionStorageService } from '../../shared/session-storage.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppConstants } from '../../app-constants';
import { BeatPersonalBestComponent } from '../../personal-best/beat-personal-best/beat-personal-best.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    ExerciseAddEditComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule,
    SpinnerComponent,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatTooltipModule
  ],
  animations: [
    trigger('celebrate', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50%, -6%) scale(0)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translate(-50%, -6%) scale(1.5)' })),
        animate('0.5s ease-in', style({ opacity: 0, transform: 'translate(-50%, -6%) scale(0)' })),
      ]),
    ]),
  ],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.scss'
})
export class ExerciseListComponent implements OnInit {

  displayedColumns: string[] = [
    'exerciseDate',
    'exerciseName',
    'exerciseReps',
    'exerciseWeights',
    'exerciseVolume',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;
  isLoading = false;
  showStar = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchForm: FormGroup;
  exerciseData: ExerciseData[] = [];
  filteredExercises: ExerciseData[] = [];
  readonly range: FormGroup;


  constructor(private dialog: MatDialog,
    private exerciseService: ExerciseService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService) {
    this.range = this.fb.group({
      startDate: new FormControl<Date | null>(null, Validators.required),
      endDate: new FormControl<Date | null>(null, Validators.required)
    });
    this.searchForm = this.fb.group({
      range: this.range,
      exerciseName: ['']
    });
  }

  ngOnInit(): void {
    this.exerciseData = this.sessionStorageService.getExerciseData();
    if (!this.exerciseData || this.exerciseData.length === 0) {
      this.isLoading = true;
      this.exerciseService.getExerciseDataList()
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res: ExerciseData[]) => {
            this.exerciseData = res;
            this.sessionStorageService.setExerciseData(res);
            this.filteredExercises = res;
            this.exerciseNameSearchCriteriaChange();
          },
          error: (err) => {
            console.log(err);
            this._snackBar.open('Error while initializing exercises data!', '❌', { duration: 2000 });
          }
        });
    }
    else
      this.exerciseNameSearchCriteriaChange();
  }

  private exerciseNameSearchCriteriaChange() {
    this.searchForm.get('exerciseName')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value)),
        map(filtered => filtered.sort((a, b) => a.exerciseDataName.localeCompare(b.exerciseDataName)))
      )
      .subscribe(filtered => {
        this.filteredExercises = filtered;
      });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.exerciseData.filter(exercise => exercise.exerciseDataName.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  search() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let { range, exerciseName } = this.searchForm.value;
    exerciseName = exerciseName ? exerciseName : '';
    this.exerciseService.getExerciseList(this.sessionStorageService.getUserEmail(), exerciseName, new Date(range.startDate).toISOString(), new Date(range.endDate).toISOString())
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: Exercise[]) => {
          this.updateDataSource(res);
        },
        error: (err) => {
          console.log(err);
          this._snackBar.open('Error while searching exercises!', '❌', { duration: 2000 });
        }
      });
  }

  updateDataSource(res: Exercise[]) {
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  deleteExercise(row: Exercise) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: `Are you sure you want to delete the exercise "${row.exerciseName}"?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.exerciseService.deleteExercise(row.exerciseId)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (res) => {
              this._snackBar.open('Exercise deleted successfully!', '️✔️', { duration: 2000 });
              this.search();
            },
            error: (err) => {
              console.log(err);
              this._snackBar.open('Error while deleting exercise!', '❌', { duration: 2000 });
            }
          });
      }
    });
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(ExerciseAddEditComponent, {
      data
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result)
          this.search();
      }
    });
  }

  openAddExerciseDialog() {
    const data = this.exerciseData;
    const dialogRef = this.dialog.open(ExerciseAddEditComponent, {
      data
    });
    dialogRef.afterClosed().subscribe({
      next: (result: Exercise | false) => {
        if (result) {
          this.search();
        }
      }
    });
  }

  beatPB(data: Exercise) {
    const dialogRef = this.dialog.open(BeatPersonalBestComponent, {
      data
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result !== false) {
          if (result.state === AppConstants.NEW_PB) {
            this.showStar = true;
            const snackBarRef = this._snackBar.open('New Personal Best!', '🏆', { duration: 2000 });
            snackBarRef.afterDismissed().subscribe(() => this.showStar = false);
          }
          else if (result.state === AppConstants.NO_NEW_PB) {
            this._snackBar.open('Nice try. Better luck next time!', '💪', { duration: 2000 });
          }
          this.search();
        }
      }
    });
  }

}
