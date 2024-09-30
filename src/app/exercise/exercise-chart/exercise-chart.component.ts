import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { Exercise, ExerciseData } from '../exercise-interface';
import { ExerciseService } from '../exercise.service';
import { finalize, map, startWith } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { SessionStorageService } from '../../shared/session-storage.service';

@Component({
  selector: 'app-exercise-chart',
  standalone: true,
  imports: [BaseChartDirective,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    DatePipe,
    SpinnerComponent
  ],
  providers: [DatePipe],
  templateUrl: './exercise-chart.component.html',
  styleUrl: './exercise-chart.component.scss'
})
export class ExerciseChartComponent implements OnInit {
  title = 'ng2-charts-demo';
  isLoading = false;
  searchForm: FormGroup;
  exerciseData: ExerciseData[] = [];
  filteredExercises: ExerciseData[] = [];
  exerciseHistory: Exercise[] = [];
  readonly range: FormGroup;
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: '',
        tension: 0.5,
        borderColor: '#ff4081',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;

  constructor(private sessionStoreService: SessionStorageService, private datePipe: DatePipe, private fb: FormBuilder, private exerciseService: ExerciseService, private _snackBar: MatSnackBar) {
    this.range = this.fb.group({
      startDate: new FormControl<Date | null>(null, Validators.required),
      endDate: new FormControl<Date | null>(null, Validators.required)
    });
    this.searchForm = this.fb.group({
      range: this.range,
      exerciseName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.exerciseData = this.sessionStoreService.getExerciseData();
    this.filteredExercises = this.sessionStoreService.getExerciseData();
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

  search() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    let { range, exerciseName } = this.searchForm.value;
    exerciseName = exerciseName ? exerciseName : '';
    this.exerciseService.getExerciseList(this.sessionStoreService.getUserEmail(), exerciseName, new Date(range.startDate).toISOString(), new Date(range.endDate).toISOString())
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: Exercise[]) => {
          this.exerciseHistory = res
          this.lineChartData = {
            labels: this.exerciseHistory.map(ex => this.datePipe.transform(ex.exerciseDate, 'dd/MM HH:mm') || ''),
            datasets: [
              {
                data: this.exerciseHistory.map(ex => ex.exerciseVolume),
                label: 'Volume Progress',
                tension: 0.5,
                borderColor: '#ff4081',
                backgroundColor: 'rgba(255,0,0,0.3)'
              }
            ]
          };
        },
        error: (err) => {
          console.log(err);
          this._snackBar.open('Error while searching exercises!', '✘', { duration: 2000 });
        }
      });
  }
}
