import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  baseUrl: string = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  addWorkout(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/workouts`, data);
  }

  updateWorkout(id: number, data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/workouts/${id}`, data);
  }

  getWorkoutList(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/workouts`);
  }

  deleteWorkout(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/workouts/${id}`);
  }
}
