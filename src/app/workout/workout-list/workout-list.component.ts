import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkoutService } from '../workout.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { WorkoutAddEditComponent } from '../workout-add-edit/workout-add-edit.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    WorkoutAddEditComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.css'
})
export class WorkoutListComponent {

  displayedColumns: string[] = [
    'date',
    'workoutName',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,
    private workoutService: WorkoutService,
    private _snackBar: MatSnackBar) { }

  search() {
    this.getWorkoutList();
  }

  getWorkoutList() {
    this.workoutService.getWorkoutList().subscribe({
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

  deleteWorkout(id: number) {
    const name = this.dataSource.data.find(wk => wk.id === id).workoutName;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: `Are you sure you want to delete the workout '${name}'?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workoutService.deleteWorkout(id).subscribe({
          next: (res) => {
            this._snackBar.open('Workout deleted successfully!', '✔', { duration: 2000 });
            this.getWorkoutList();
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(WorkoutAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getWorkoutList();
        }
      }
    });
  }

  openAddEditWorkoutDialog() {
    const dialogRef = this.dialog.open(WorkoutAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getWorkoutList();
        }
      },
    });
  }

}
