import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  baseUrl: string = "https://nrytptgd8g.execute-api.ap-southeast-2.amazonaws.com/prod";

  constructor(private httpClient: HttpClient) { }

  addExercise(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(`${this.baseUrl}/exercises`, data, { headers });
  }

  updateExercise(id: number, data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/exercises/${id}`, data);
  }

  getExerciseList(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/exercises`);
  }

  deleteExercise(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/exercises/${id}`);
  }
}
