import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <h1>FiveTalents</h1>
          <p class="tagline">Faithful stewardship for growing churches.</p>
          <div class="divider"></div>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" autocomplete="email" />
          </div>
          <div class="form-field">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" autocomplete="current-password" />
          </div>
          <button type="submit" class="btn-primary" [disabled]="form.invalid || loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
          <p *ngIf="error" class="auth-error">{{ error }}</p>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;
  error = '';

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Invalid email or password'; this.loading = false; }
    });
  }
}
