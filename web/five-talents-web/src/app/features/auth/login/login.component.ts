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
    <div class="login-container">
      <h1>FiveTalents</h1>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div>
          <label>Email</label>
          <input type="email" formControlName="email" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" formControlName="password" />
        </div>
        <button type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <p *ngIf="error" class="error">{{ error }}</p>
      </form>
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
