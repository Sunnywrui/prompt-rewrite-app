import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RewriteService {
  private apiUrl = '/api/rewrite';

  constructor(private http: HttpClient) {}

  rewrite(prompt: string, style: string): Observable<any> {
    return this.http.post(this.apiUrl, { prompt, style });
  }
}

// 在组件中使用
export class YourComponent {
  constructor(private rewriteService: RewriteService) {}

  onRewrite() {
    const prompt = 'Your text here';
    const style = 'professional';
    
    this.rewriteService.rewrite(prompt, style).subscribe({
      next: (response) => {
        console.log('Rewritten text:', response.rewrittenText);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}