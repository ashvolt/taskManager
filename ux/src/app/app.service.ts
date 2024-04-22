import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private apiUrl = 'http://localhost:5000'; // Replace with your actual backend URL

  constructor(private http: HttpClient) { }

  // Method to post a log entry
  postLogEntry(logEntry: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insert-log`, logEntry);
  }
  putLogEntry(id:string,logEntry: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-log/${id}`, logEntry);
  }
  deleteLog(id:string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/logs/${id}`)
  }
  getAllLogs(statusFilter?: string, sortBy?: string, sortOrder?: string): Observable<any[]> {
    let queryParams = '';

    // Add query parameters if filters are provided
    if (statusFilter || sortBy || sortOrder) {
      queryParams = `?${statusFilter ? `status=${statusFilter}&` : ''}${sortBy ? `sortBy=${sortBy}&` : ''}${sortOrder ? `sortOrder=${sortOrder}` : ''}`;
    }

    return this.http.get<any[]>(`${this.apiUrl}/logs${queryParams}`);
  }
  getStatus(){
    return this.http.get<any[]>(`${this.apiUrl}/status`);
  }
}
