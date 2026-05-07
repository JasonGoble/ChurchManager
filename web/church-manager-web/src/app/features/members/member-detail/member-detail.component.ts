import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MemberService } from '../../../core/services/member.service';
import { AuthService } from '../../../core/services/auth.service';
import { Member, MemberStatus } from '../../../core/models/member.models';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatButtonModule, MatIconModule,
    MatCardModule, MatProgressSpinnerModule, MatDividerModule,
    MatDialogModule, MatSnackBarModule, MatSlideToggleModule
  ],
  template: `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <button mat-icon-button routerLink="/members"><mat-icon>arrow_back</mat-icon></button>
        <h1>{{ member()?.firstName }} {{ member()?.lastName }}</h1>
      </div>
      <div style="display:flex;gap:8px">
        <button mat-stroked-button [routerLink]="['/members', member()?.id, 'edit']">
          <mat-icon>edit</mat-icon> Edit
        </button>
        <button mat-stroked-button color="warn" (click)="confirmDelete()">
          <mat-icon>delete</mat-icon> Delete
        </button>
      </div>
    </div>

    @if (loading()) {
      <div style="display:flex;justify-content:center;padding:48px">
        <mat-spinner diameter="40" />
      </div>
    } @else if (member(); as m) {
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">

        <mat-card>
          <mat-card-header><mat-card-title>Personal Information</mat-card-title></mat-card-header>
          <mat-card-content>
            <div class="detail-grid">
              <span class="label">Status</span>
              <span><span [class]="'status-chip ' + statusClass(m.status)">{{ statusLabel(m.status) }}</span></span>
              <span class="label">Email</span><span>{{ m.email ?? '—' }}</span>
              <span class="label">Phone</span><span>{{ m.phoneNumber ?? '—' }}</span>
              <span class="label">Date of Birth</span><span>{{ m.dateOfBirth ? (m.dateOfBirth | date:'mediumDate') : '—' }}</span>
              <span class="label">Join Date</span><span>{{ m.joinDate ? (m.joinDate | date:'mediumDate') : '—' }}</span>
            </div>
          </mat-card-content>
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

        <mat-card style="grid-column:1/-1">
          <mat-card-header><mat-card-title>Account</mat-card-title></mat-card-header>
          <mat-card-content>
            <div class="detail-grid" style="margin-bottom:16px">
              <span class="label">Linked Account</span>
              <span>
                @if (m.isLinkedToUser) {
                  <span class="status-chip active">Linked</span>
                  @if (m.userId) {
                    <span style="margin-left:8px;color:#666;font-size:12px">{{ m.userId }}</span>
                  }
                } @else {
                  <span class="status-chip inactive">Not Linked</span>
                }
              </span>
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px">
              @if (!m.isLinkedToUser && isAdmin()) {
                <button mat-stroked-button (click)="linkUser(m)">
                  <mat-icon>link</mat-icon> Link User
                </button>
                <button mat-stroked-button color="accent" [disabled]="!m.email" (click)="invite(m)"
                        [title]="m.email ? '' : 'Member must have an email address'">
                  <mat-icon>email</mat-icon> Send Invite
                </button>
              } @else if (m.isLinkedToUser && isAdmin()) {
                <button mat-stroked-button color="warn" (click)="unlinkUser(m)">
                  <mat-icon>link_off</mat-icon> Unlink
                </button>
              }
            </div>

            @if (isOwnProfile()) {
              <mat-divider style="margin-bottom:16px" />
              <div style="font-weight:500;margin-bottom:12px;font-size:14px">Privacy — Sharing with Parent Organizations</div>
              <div style="display:flex;flex-direction:column;gap:12px">
                <mat-slide-toggle [checked]="m.sharePhoneWithNetwork"
                  (change)="updatePrivacy(m, 'sharePhoneWithNetwork', $event.checked)">
                  Share phone number
                </mat-slide-toggle>
                <mat-slide-toggle [checked]="m.shareEmailWithNetwork"
                  (change)="updatePrivacy(m, 'shareEmailWithNetwork', $event.checked)">
                  Share email address
                </mat-slide-toggle>
                <mat-slide-toggle [checked]="m.shareAddressWithNetwork"
                  (change)="updatePrivacy(m, 'shareAddressWithNetwork', $event.checked)">
                  Share home address
                </mat-slide-toggle>
              </div>
            }
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
export class MemberDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memberService = inject(MemberService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  member = signal<Member | null>(null);
  loading = signal(false);

  isOwnProfile = computed(() => {
    const user = this.authService.currentUser();
    const m = this.member();
    return !!user && !!m && user.memberId === m.id;
  });

  isAdmin = computed(() => !!this.authService.currentUser()?.isSystemAdmin);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    this.memberService.getById(id).subscribe({
      next: m => { this.member.set(m); this.loading.set(false); },
      error: () => { this.loading.set(false); this.router.navigate(['/members']); }
    });
  }

  confirmDelete() {
    if (!confirm(`Delete ${this.member()?.firstName} ${this.member()?.lastName}? This cannot be undone.`)) return;
    this.memberService.delete(this.member()!.id).subscribe({
      next: () => {
        this.snackBar.open('Member deleted', 'OK', { duration: 3000 });
        this.router.navigate(['/members']);
      },
      error: () => this.snackBar.open('Failed to delete member', 'OK', { duration: 3000 })
    });
  }

  linkUser(m: Member) {
    const userId = prompt('Enter the User ID to link:');
    if (!userId?.trim()) return;
    this.memberService.linkUser(m.id, userId.trim()).subscribe({
      next: () => {
        this.snackBar.open('User linked successfully', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err) => this.snackBar.open(err.error?.title ?? 'Failed to link user', 'OK', { duration: 4000 })
    });
  }

  unlinkUser(m: Member) {
    if (!confirm('Unlink this member from their user account?')) return;
    this.memberService.unlinkUser(m.id).subscribe({
      next: () => {
        this.snackBar.open('User unlinked', 'OK', { duration: 3000 });
        this.reload();
      },
      error: () => this.snackBar.open('Failed to unlink user', 'OK', { duration: 3000 })
    });
  }

  invite(m: Member) {
    this.memberService.invite(m.id, window.location.origin).subscribe({
      next: () => this.snackBar.open(`Invite sent to ${m.email}`, 'OK', { duration: 4000 }),
      error: (err) => this.snackBar.open(err.error?.title ?? 'Failed to send invite', 'OK', { duration: 4000 })
    });
  }

  updatePrivacy(m: Member, field: 'sharePhoneWithNetwork' | 'shareEmailWithNetwork' | 'shareAddressWithNetwork', value: boolean) {
    this.memberService.update(m.id, { [field]: value }).subscribe({
      next: () => {
        this.member.set({ ...m, [field]: value });
        this.snackBar.open('Privacy setting updated', 'OK', { duration: 2000 });
      },
      error: () => this.snackBar.open('Failed to update privacy setting', 'OK', { duration: 3000 })
    });
  }

  private reload() {
    this.memberService.getById(this.member()!.id).subscribe(m => this.member.set(m));
  }

  statusLabel(status: MemberStatus) {
    return ['Active', 'Inactive', 'Visitor', 'Deceased'][status] ?? 'Unknown';
  }
  statusClass(status: MemberStatus) {
    return ['active', 'inactive', 'visitor', 'deceased'][status] ?? '';
  }
}
