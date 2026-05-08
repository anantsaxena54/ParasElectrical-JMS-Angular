import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Report {
  private baseUrl = 'https://paraselectrical-jms-springboot-production.up.railway.app';
  private apiUrl = `${this.baseUrl}/api/reports`;

  constructor(private http: HttpClient) { }

  getDashboardMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  exportJobsCsv(): void {
    window.open(`${this.apiUrl}/export`, '_blank');
  }
}
