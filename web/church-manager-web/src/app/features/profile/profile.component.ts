import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MemberService } from '../../core/services/member.service';
import { Member } from '../../core/models/member.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page-header">
      <h1>My Profile</h1>
    </div>

    @if (loading()) {
      <div style="display:flex;justify-content:center;padding:48px">
        <mat-spinner diameter="40" />
      </div>
    } @else if (member() === null) {
      <mat-card style="max-width:420px;margin:48px auto;text-align:center">
        <mat-card-content style="padding:32px">
          <mat-icon style="font-size:48px;height:48px;width:48px;color:#999;display:block;margin:0 auto">person_off</mat-icon>
          <p style="color:#666;margin-top:16px">Your account is not linked to a member record.</p>
          <p style="color:#999;font-size:12px">Contact your church administrator to link your account.</p>
        </mat-card-content>
      </mat-card>
    } @else if (member(); as m) {
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">

        <mat-card>
          <mat-card-header><mat-card-title>Personal Information</mat-card-title></mat-card-header>
          <mat-card-content>
            <div class="detail-grid">
              <span class="label">Name</span><span>{{ m.firstName }} {{ m.lastName }}</span>
              <span class="label">Email</span><span>{{ m.email ?? '—' }}</span>
              <span class="label">Phone</span><span>{{ m.phoneNumber ?? '—' }}</span>
              <span class="label">Date of Birth</span><span>{{ m.dateOfBirth ? (m.dateOfBirth | date:'mediumDate') : '—' }}</span>
              <span class="label">Join Date</span><span>{{ m.joinDate ? (m.joinDate | date:'mediumDate') : '—' }}</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button [routerLink]="['/members', m.id, 'edit']">Edit Profile</button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header><mat-card-title>Address</mat-card-title></mat-card-header>
          <mat-card-content>
            <div class="detail-grid">
              <span class="label">Address</span><span>{{ m.address ?? '—' }}</span>
              <span class="label">City</span><span>{{ m.city ?? '—' }}</span>
              <span class="label">State</span><span>{{ m.state ?? '—' }}</span>
              <span class="label">Postal Code</span><span>{{ m.postalCode ?? '—' }}</span>
              <span class="label">Country</span><span>{{ m.country ?? '—' }}</span>
            </div>
          </mat-card-content>
        </mat-card>

      </div>
    }
  `,
  styles: [`
    .detail-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 10px 16px;
      padding: 8px 0;
      font-size: 14px;
    }
    .label { color: #666; font-weight: 500; }
    mat-card { margin-top: 0; }
    mat-card-content { padding-top: 8px; }
  `]
})
export class ProfileComponent implements OnInit {
  private memberService = inject(MemberService);

  member = signal<Member | null | undefined>(undefined);
  loading = signal(true);

  ngOnInit() {
    this.memberService.getMyProfile().subscribe({
      next: m => { this.member.set(m); this.loading.set(false); },
      error: () => { this.member.set(null); this.loading.set(false); }
    });
  }
}
