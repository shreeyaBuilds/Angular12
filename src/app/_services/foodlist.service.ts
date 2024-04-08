import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodListService {

  constructor(private http: HttpClient) { }

  public getFood(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/foodList`);
  }
}
