import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthResponse, CurrentUser } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly currentUser = signal<CurrentUser | null>(this.loadUser());
  readonly isAuthenticated = signal<boolean>(!!this.getToken());

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => this.storeSession(response))
    );
  }

  setupAccount(email: string, token: string, newPassword: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/setup-account`, { email, token, newPassword }).pipe(
      tap(response => this.storeSession(response))
    );
  }

  private storeSession(response: AuthResponse) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private loadUser(): CurrentUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
