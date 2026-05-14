import { Routes } from '@angular/router';
export const AUTH_ROUTES: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'setup-account', loadComponent: () => import('./setup-account/setup-account.component').then(m => m.SetupAccountComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
