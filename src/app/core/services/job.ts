import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Job {
  private baseUrl = 'http://localhost:8080';
  private apiUrl = `${this.baseUrl}/api/jobs`;

  constructor(private http: HttpClient) { }

  getAllJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getJobById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createJob(jobData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, jobData);
  }

  updateStage(id: number, stage: string, notes?: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/stage?newStage=${stage}&notes=${notes || ''}`, {});
  }

  uploadPhoto(jobId: number, file: File, bucketType: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketType', bucketType);
    return this.http.post<any>(`${this.baseUrl}/api/upload/photo/${jobId}`, formData);
  }

  getPhotos(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/upload/photo/${jobId}`);
  }

  deletePhoto(photoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/upload/photo/${photoId}`);
  }

  uploadDocument(jobId: number, file: File, documentType: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    return this.http.post<any>(`${this.baseUrl}/api/upload/document/${jobId}`, formData);
  }

  getDocuments(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/upload/document/${jobId}`);
  }

  deleteDocument(docId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/upload/document/${docId}`);
  }

  // --- Notes APIs ---
  getNotes(jobId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${jobId}/notes`);
  }

  addNote(jobId: number, content: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${jobId}/notes`, { content, author: 'admin' });
  }

  updateNote(noteId: number, content: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/notes/${noteId}`, { content });
  }

  deleteNote(noteId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notes/${noteId}`);
  }

  // --- Checklist APIs ---
  getChecklist(jobId: number, stage: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${jobId}/checklist?stage=${stage}`);
  }

  updateChecklist(jobId: number, stage: string, items: any[]): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/${jobId}/checklist?stage=${stage}`, items);
  }
}
