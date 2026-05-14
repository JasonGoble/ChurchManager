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
    <div class="login-container">
      <h1>FiveTalents</h1>
      <h2>Set Up Your Account</h2>
      <p>Welcome, {{ email }}. Choose a password to activate your account.</p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div>
          <label>New Password</label>
          <input type="password" formControlName="newPassword" />
        </div>
        <div>
          <label>Confirm Password</label>
          <input type="password" formControlName="confirmPassword" />
          <span *ngIf="form.hasError('passwordMismatch') && form.get('confirmPassword')?.touched" class="error">
            Passwords do not match.
          </span>
        </div>
        <button type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Activating...' : 'Activate Account' }}
        </button>
        <p *ngIf="error" class="error">{{ error }}</p>
      </form>
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
