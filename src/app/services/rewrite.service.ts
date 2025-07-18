// File: src/app/services/rewrite.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RewriteService {
  constructor(private http: HttpClient) {}

  rewrite(prompt: string, style: string): Observable<string> {
    return this.http.post<{ result: string }>('/api/rewrite', { prompt, style }).pipe(
      map(res => res.result)
    );
  }
}