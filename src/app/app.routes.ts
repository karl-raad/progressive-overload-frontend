import { Routes } from '@angular/router';
import { ExerciseListComponent } from './exercise/exercise-list/exercise-list.component';
import { ExerciseChartComponent } from './exercise/exercise-chart/exercise-chart.component';

export const routes: Routes = [
    { path: 'exercise-list', component: ExerciseListComponent },
    { path: 'exercise-chart', component: ExerciseChartComponent },
    { path: '', redirectTo: '/exercise-list', pathMatch: 'full' },
    { path: '**', redirectTo: '/exercise-list' }
];
