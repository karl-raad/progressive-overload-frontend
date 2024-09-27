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

  addExercise(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/exercises`, data);
  }

  updateExercise(id: number, data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/exercises/${id}`, data);
  }

  getExerciseList(): Observable<Exercise[]> {
    return this.httpClient.get<Exercise[]>(`${this.baseUrl}/exercises`);
  }

  deleteExercise(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/exercises/${id}`);
  }
}
