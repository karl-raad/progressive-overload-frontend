import { Component, ViewChild } from '@angular/core';
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
import { finalize } from 'rxjs';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { Exercise } from '../exercise-interface';
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
    SpinnerComponent
  ],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.css',
  animations: [
    trigger('celebrate', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'scale(1.5)' })),
        animate('0.5s ease-in', style({ opacity: 0, transform: 'scale(0)' })),
      ]),
    ]),
  ],
})
export class ExerciseListComponent {

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

  constructor(private dialog: MatDialog,
    private exerciseService: ExerciseService,
    private _snackBar: MatSnackBar) { }

  search() {
    this.getExerciseList();
  }

  getExerciseList() {
    this.isLoading = true;
    this.exerciseService.getExerciseList()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: Exercise[]) => {
          this.updateDataSource(res);
        },
        error: (err) => {
          console.log(err);
          this._snackBar.open('Error while searching exercises!', '✘', { duration: 2000 });
        }
      });
  }

  updateDataSource(res: Exercise[]) {
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteExercise(id: string) {
    const exerciseToDelete = this.dataSource.data.find((exercise: Exercise) => exercise.exerciseId === id);
    const name = exerciseToDelete.exerciseName;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: `Are you sure you want to delete the exercise '${name}'?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.exerciseService.deleteExercise(id)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (res) => {
              this._snackBar.open('Exercise deleted successfully!', '✔', { duration: 2000 });
              this.dataSource.data = this.dataSource.data.filter(item => item.exerciseId !== id)
            },
            error: (err) => {
              console.log(err);
              this._snackBar.open('Error while deleting exercise!', '✘', { duration: 2000 });
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
      next: (val) => {
        if (val)
          this.getExerciseList();
      }
    });
  }

  openAddExerciseDialog() {
    const dialogRef = this.dialog.open(ExerciseAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val: Exercise) => {
        // this.showStar = true;
        // this._snackBar.open('New Personal Best!', '🏆');
        if (val && !this.dataSource)
          this.getExerciseList();
        if (val && this.dataSource) {
          this.dataSource.data.push(val);
          this.updateDataSource(this.dataSource.data);
        }
      },
    });
  }

}
