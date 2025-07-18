import { Routes } from '@angular/router';
import { PromptFormComponent } from './components/prompt-form-component/prompt-form-component';

export const routes: Routes = [
    {   path: '', redirectTo: '/promptRewriter', pathMatch: 'full'   },
    {   path: 'promptRewriter', component: PromptFormComponent }
];
