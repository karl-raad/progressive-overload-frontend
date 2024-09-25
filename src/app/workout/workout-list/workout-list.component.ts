import { Component, OnInit, ViewChild } from '@angular/core';
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
    WorkoutAddEditComponent
  ],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.css'
})
export class WorkoutListComponent implements OnInit {

  displayedColumns: string[] = [
    'date',
    'workoutName',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private workoutService: WorkoutService) { }

  ngOnInit(): void {
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
    let confirm = window.confirm("Are you sure you want to delete this employee?");
    if (confirm) {
      this.workoutService.deleteWorkout(id).subscribe({
        next: (res) => {
          alert('Employee deleted!');
          this.getWorkoutList();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
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
