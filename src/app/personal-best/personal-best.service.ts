import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalBestService {

  baseUrl = environment.API_URL;

  constructor(private httpClient: HttpClient) { }

  getPersonalBests(userEmail: string): Observable<any> {
    const params = new HttpParams().set('userEmail', userEmail);
    return this.httpClient.get(`${this.baseUrl}/personal-bests`, { params });
  }
}
