import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'signup', loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent) },
    { path: 'forgot-password', loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
    { path: 'confirm-registration/:userEmail', loadComponent: () => import('./auth/confirm-registration/confirm-registration.component').then(m => m.ConfirmRegistrationComponent) },
    { path: 'confirm-password-reset', loadComponent: () => import('./auth/confirm-password-reset/confirm-password-reset.component').then(m => m.ConfirmPasswordResetComponent) },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'exercise-list', loadComponent: () => import('./exercise/exercise-list/exercise-list.component').then(m => m.ExerciseListComponent), canActivate: [AuthGuard] },
    { path: 'personal-best', loadComponent: () => import('./personal-best/personal-best-list/personal-best-list.component').then(m => m.PersonalBestComponent), canActivate: [AuthGuard] },
    { path: 'exercise-chart', loadComponent: () => import('./exercise/exercise-chart/exercise-chart.component').then(m => m.ExerciseChartComponent), canActivate: [AuthGuard] }
];