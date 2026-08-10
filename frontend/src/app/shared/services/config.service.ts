import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { ChatConfig } from '../models';
import { FALLBACK_CHAT_CONFIG } from '../constants';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config$: Observable<ChatConfig> | null = null;

  constructor(private http: HttpClient) {}

  /** Cached so every component that needs the links shares one request. */
  getConfig(): Observable<ChatConfig> {
    if (!this.config$) {
      this.config$ = this.http.get<ChatConfig>('/api/config').pipe(
        catchError(() => of(FALLBACK_CHAT_CONFIG)),
        shareReplay(1)
      );
    }
    return this.config$;
  }
}
