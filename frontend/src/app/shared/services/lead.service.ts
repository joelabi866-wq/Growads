import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeadPayload, LeadResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class LeadService {
  constructor(private http: HttpClient) {}

  submitLead(payload: LeadPayload): Observable<LeadResponse> {
    return this.http.post<LeadResponse>('/api/lead', payload);
  }
}
