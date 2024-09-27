import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseService } from '../exercise.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ExerciseAddEditComponent } from '../exercise-add-edit/exercise-add-edit.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    ExerciseAddEditComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.css'
})
export class ExerciseListComponent {

  displayedColumns: string[] = [
    'exerciseDate',
    'exerciseName',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,
    private exerciseService: ExerciseService,
    private _snackBar: MatSnackBar) { }

  search() {
    this.getExerciseList();
  }

  getExerciseList() {
    this.exerciseService.getExerciseList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteExercise(id: number) {
    const name = this.dataSource.data.find(wk => wk.id === id).exerciseName;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: `Are you sure you want to delete the exercise '${name}'?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exerciseService.deleteExercise(id).subscribe({
          next: (res) => {
            this._snackBar.open('Exercise deleted successfully!', '✔', { duration: 2000 });
            this.getExerciseList();
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(ExerciseAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getExerciseList();
        }
      }
    });
  }

  openAddEditExerciseDialog() {
    const dialogRef = this.dialog.open(ExerciseAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getExerciseList();
        }
      },
    });
  }

}
