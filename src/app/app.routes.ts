import { Routes } from '@angular/router';
import { ExerciseListComponent } from './exercise/exercise-list/exercise-list.component';
import { ExerciseChartComponent } from './exercise/exercise-chart/exercise-chart.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { ConfirmRegistrationComponent } from './auth/confirm-registration/confirm-registration.component';
import { ConfirmPasswordResetComponent } from './auth/confirm-password-reset/confirm-password-reset.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'confirm-registration', component: ConfirmRegistrationComponent },
    { path: 'confirm-password-reset', component: ConfirmPasswordResetComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'exercise-list', component: ExerciseListComponent, canActivate: [AuthGuard] },
    { path: 'exercise-chart', component: ExerciseChartComponent, canActivate: [AuthGuard] }
];