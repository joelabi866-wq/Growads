import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage, ChatReply } from '../models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  /** The Groq key lives on the server — the browser only ever talks to our own API. */
  send(messages: ChatMessage[]): Observable<ChatReply> {
    return this.http.post<ChatReply>('/api/chat', { messages });
  }
}
