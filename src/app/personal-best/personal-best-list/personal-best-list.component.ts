import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonalBestService } from '../personal-best.service';
import { Exercise } from '../../exercise/exercise-interface';
import { SessionStorageService } from '../../shared/session-storage.service';
import { finalize } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BeatPersonalBestComponent } from '../beat-personal-best/beat-personal-best.component';
import { AppConstants } from '../../app-constants';

@Component({
  selector: 'app-personal-best',
  standalone: true,
  templateUrl: './personal-best-list.component.html',
  imports: [MatSnackBarModule,
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    SpinnerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule],
  styleUrls: ['./personal-best-list.component.scss'],
  animations: [
    trigger('celebrate', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50%, -6%) scale(0)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translate(-50%, -6%) scale(1.5)' })),
        animate('0.5s ease-in', style({ opacity: 0, transform: 'translate(-50%, -6%) scale(0)' })),
      ]),
    ]),
  ],
})
export class PersonalBestComponent implements OnInit {
  personalBests: Exercise[] = [];
  isLoading = false;
  displayedColumns: string[] = [
    'exerciseDate',
    'exerciseName',
    'exerciseReps',
    'exerciseWeights',
    'exerciseVolume',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  showStar = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private _snackBar: MatSnackBar, private sessionStoreService: SessionStorageService, private personalBestService: PersonalBestService) { }

  ngOnInit(): void {
    this.getPBs();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPBs() {
    this.isLoading = true;
    this.personalBestService.getPersonalBests(this.sessionStoreService.getUserEmail())
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: Exercise[]) => {
          this.personalBests = res;
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: (err) => {
          console.error('Error fetching personal bests:', err);
          this._snackBar.open('Error fetching personal bests!', '❌', { duration: 2000 });
        }
      });
  }

  newExercise(): Exercise {
    return {
      exerciseId: '',
      exerciseDate: new Date(),
      exerciseName: '',
      exerciseReps: [1],
      exerciseWeights: [1],
      exerciseVolume: 1,
      userEmail: this.sessionStoreService.getUserEmail(),
      isPersonalBest: 1
    }
  }

  beatPB(data: Exercise) {
    const dialogRef = this.dialog.open(BeatPersonalBestComponent, {
      data
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result !== false) {
          if (result.state === AppConstants.NEW_PB) {
            this.getPBs();
            this.showStar = true;
            const snackBarRef = this._snackBar.open('New Personal Best!', '🏆', { duration: 2000 });
            snackBarRef.afterDismissed().subscribe(() => this.showStar = false);
          }
          else if (result.state === AppConstants.NO_NEW_PB)
            this._snackBar.open('Nice try. Better luck next time!', '💪', { duration: 2000 });
        }
      }
    });
  }

}
