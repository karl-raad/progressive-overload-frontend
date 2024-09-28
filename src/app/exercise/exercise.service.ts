import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exercise } from './exercise-interface';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  baseUrl: string = "https://nrytptgd8g.execute-api.ap-southeast-2.amazonaws.com/prod";

  constructor(private httpClient: HttpClient) { }

  addExercise(data: Exercise): Observable<Exercise> {
    return this.httpClient.post<Exercise>(`${this.baseUrl}/exercises`, data);
  }

  updateExercise(id: string, data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/exercises/${id}`, data);
  }

  getExerciseList(): Observable<Exercise[]> {
    return this.httpClient.get<Exercise[]>(`${this.baseUrl}/exercises`);
  }

  deleteExercise(id: string): Observable<Exercise> {
    return this.httpClient.delete<Exercise>(`${this.baseUrl}/exercises/${id}`);
  }
}
