import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetApiService {
  url= 'http://states-and-cities.com/api/v1/states.'
  constructor(private http:HttpClient) { }

  apiCall() {
    return this.http.get(this.url)
  }
}
