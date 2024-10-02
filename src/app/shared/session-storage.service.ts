import { Injectable } from '@angular/core';
import { AppConstants } from '../app-constants';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {

  setExerciseData(data: any): void {
    sessionStorage.setItem(AppConstants.EXERCISE_DATA, JSON.stringify(data));
  }

  getExerciseData(): any {
    const data = sessionStorage.getItem(AppConstants.EXERCISE_DATA);
    return data ? JSON.parse(data) : null;
  }

  clearExerciseData(): void {
    sessionStorage.removeItem(AppConstants.EXERCISE_DATA);
  }

  setUserEmail(data: any): void {
    sessionStorage.setItem(AppConstants.USER_EMAIL, JSON.stringify(data));
  }

  getUserEmail(): any {
    const data = sessionStorage.getItem(AppConstants.USER_EMAIL);
    return data ? JSON.parse(data) : null;
  }

  setUserName(data: any): void {
    sessionStorage.setItem(AppConstants.USER_NAME, JSON.stringify(data));
  }

  getUserName(): any {
    const data = sessionStorage.getItem(AppConstants.USER_NAME);
    return data ? JSON.parse(data) : null;
  }

  clearUserEmail(): void {
    sessionStorage.removeItem(AppConstants.USER_EMAIL);
  }

  clear(): void {
    sessionStorage.clear();
  }
}
