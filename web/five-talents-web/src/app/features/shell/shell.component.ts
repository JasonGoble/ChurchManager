import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-layout">
      <nav class="sidebar">
        <div class="logo"><strong>FiveTalents</strong></div>
        <ul>
          <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
          <li><a routerLink="/members" routerLinkActive="active">Members</a></li>
          <li><a routerLink="/groups" routerLinkActive="active">Groups</a></li>
          <li><a routerLink="/attendance" routerLinkActive="active">Attendance</a></li>
          <li><a routerLink="/giving" routerLinkActive="active">Giving</a></li>
          <li><a routerLink="/events" routerLinkActive="active">Events</a></li>
          <li><a routerLink="/sermons" routerLinkActive="active">Sermons</a></li>
          <li><a routerLink="/volunteers" routerLinkActive="active">Volunteers</a></li>
          <li><a routerLink="/communication" routerLinkActive="active">Communication</a></li>
          <li><a routerLink="/organizations" routerLinkActive="active">Organizations</a></li>
          <li><a routerLink="/settings" routerLinkActive="active">Settings</a></li>
        </ul>
        <div class="user-info">
          <a routerLink="/profile" routerLinkActive="active" style="font-size:14px">{{ auth.currentUser()?.fullName }}</a>
          <button (click)="auth.logout()">Sign Out</button>
        </div>
      </nav>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `
})
export class ShellComponent {
  auth = inject(AuthService);
}
