import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Job {
  private baseUrl = 'https://paraselectrical-jms-springboot-production.up.railway.app';
  private apiUrl = `${this.baseUrl}/api/jobs`;

  getFileUrl(filePath: string): string {
    // New files: filePath is a full Cloudinary HTTPS URL — use directly
    if (filePath && filePath.startsWith('http')) {
      return filePath;
    }
    // Legacy files: filePath is just a filename — build the old backend serve URL
    return `${this.baseUrl}/api/upload/files/${filePath}`;
  }

  getDownloadUrl(filePath: string): string {
    // New files: Cloudinary URL — append fl_attachment for forced download
    if (filePath && filePath.startsWith('http')) {
      // Insert fl_attachment transformation for Cloudinary image URLs
      // For raw files the URL already triggers download in browser
      return filePath.replace('/upload/', '/upload/fl_attachment/');
    }
    // Legacy files
    return `${this.baseUrl}/api/upload/files/${filePath}?download=true`;
  }

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

  updateJob(id: number, jobData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, jobData);
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

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
