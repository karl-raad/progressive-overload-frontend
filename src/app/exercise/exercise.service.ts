import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exercise } from './exercise-interface';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  baseUrl: string = "https://uo5vaf74da.execute-api.ap-southeast-2.amazonaws.com/prod";

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

  deleteExercise(id: string): Observable<Exercise> {
    return this.httpClient.delete<Exercise>(`${this.baseUrl}/exercises/${id}`);
  }
}
