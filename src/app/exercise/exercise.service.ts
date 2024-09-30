import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise, ExerciseData } from './exercise-interface';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  // baseUrl: string = "https://uo5vaf74da.execute-api.ap-southeast-2.amazonaws.com/prod";
  baseUrl = "https://ujbgkqwv59.execute-api.ap-southeast-2.amazonaws.com/dev";
  private storageKey = 'exerciseData';

  constructor(private httpClient: HttpClient) { }

  addExercise(data: Exercise): Observable<Exercise> {
    return this.httpClient.post<Exercise>(`${this.baseUrl}/exercises`, data);
  }

  updateExercise(id: string, data: Exercise) {
    return this.httpClient.put(`${this.baseUrl}/exercises/${id}`, data);
  }

  getExerciseList(userEmail: string, exerciseName: string, startDate: string, endDate: string): Observable<Exercise[]> {
    const params = new HttpParams()
      .set('userEmail', userEmail)
      .set('exerciseName', exerciseName)
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.httpClient.get<Exercise[]>(`${this.baseUrl}/exercises`, { params });
  }

  getExerciseDataList(): Observable<ExerciseData[]> {
    return this.httpClient.get<ExerciseData[]>(`${this.baseUrl}/exercises-data`);
  }

  deleteExercise(id: string): Observable<Exercise> {
    return this.httpClient.delete<Exercise>(`${this.baseUrl}/exercises/${id}`);
  }

  setExerciseData(data: any): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getExerciseData(): any {
    const data = sessionStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  clearExerciseData(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
