import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-setup-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <h1>FiveTalents</h1>
          <p class="tagline">Set Up Your Account</p>
          <div class="divider"></div>
        </div>
        <p class="auth-welcome">Welcome, {{ email }}. Choose a password to activate your account.</p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <label for="newPassword">New Password</label>
            <input id="newPassword" type="password" formControlName="newPassword" autocomplete="new-password" />
          </div>
          <div class="form-field">
            <label for="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" formControlName="confirmPassword" autocomplete="new-password" />
            <p *ngIf="form.hasError('passwordMismatch') && form.get('confirmPassword')?.touched" class="auth-error">
              Passwords do not match.
            </p>
          </div>
          <button type="submit" class="btn-primary" [disabled]="form.invalid || loading">
            {{ loading ? 'Activating...' : 'Activate Account' }}
          </button>
          <p *ngIf="error" class="auth-error">{{ error }}</p>
        </form>
      </div>
    </div>
  `
})
export class SetupAccountComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  private token = '';

  loading = false;
  error = '';

  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordsMatch });

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.email || !this.token) {
      this.error = 'Invalid or expired invite link.';
    }
  }

  onSubmit() {
    if (this.form.invalid || !this.email || !this.token) return;
    this.loading = true;
    this.error = '';
    const { newPassword } = this.form.value;
    this.auth.setupAccount(this.email, this.token, newPassword!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err?.error?.message ?? err?.error?.errors?.[0] ?? 'Account setup failed. The link may have expired.';
        this.loading = false;
      }
    });
  }
}
