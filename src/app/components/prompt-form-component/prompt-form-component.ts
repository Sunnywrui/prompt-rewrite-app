import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RewriteService } from '../../services/rewrite.service';

@Component({
  selector: 'app-prompt-form',
  imports: [TranslateModule, FormsModule, CommonModule],
  templateUrl: './prompt-form-component.html',
  styleUrl: './prompt-form-component.css'
})
export class PromptFormComponent {
  prompt = '';
  result = '';
  error = '';
  loading = false;
  style = 'professional';

  constructor(private rewriteService: RewriteService) {}

  async submit() {
    if (!this.prompt.trim()) {
      this.error = 'Please enter a prompt';
      return;
    }

    this.loading = true;
    this.error = '';
    this.result = '';

    this.rewriteService.rewrite(this.prompt, this.style).subscribe({
      next: (result: string) => {
        this.result = result;
        this.loading = false;
      },
      error: (err) => {
        console.error('Rewrite error:', err);
        this.error = err.error?.error || 'An error occurred while rewriting';
        this.loading = false;
      },
    });
  }
}