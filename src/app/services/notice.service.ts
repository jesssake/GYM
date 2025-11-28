import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notice } from '../models/notice.model';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private baseUrl = '/api/admin/avisos'; // Ajusta si tu base URL es diferente

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  create(notice: Partial<Notice>): Observable<any> {
    return this.http.post(this.baseUrl, notice, this.getAuthHeaders());
  }

  getAll(): Observable<Notice[]> {
    return this.http.get<Notice[]>(this.baseUrl, this.getAuthHeaders());
  }

  getById(id: number): Observable<Notice> {
    return this.http.get<Notice>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

  update(id: number, notice: Partial<Notice>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, notice, this.getAuthHeaders());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}
