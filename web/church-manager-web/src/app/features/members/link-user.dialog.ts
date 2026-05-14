import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../core/services/user.service';
import { UserSummary } from '../../core/models/api.models';

export interface LinkUserDialogData {
  memberName: string;
  memberEmail?: string;
}

@Component({
  selector: 'app-link-user-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatListModule, MatProgressSpinnerModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Link User Account</h2>
    <div mat-dialog-content style="min-width:440px">
      <p style="margin:0 0 12px;color:#555;font-size:14px">
        Select a user to link to <strong>{{ data.memberName }}</strong>.
        @if (data.memberEmail) { Users with a matching email are shown first. }
      </p>

      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Search by name or email</mat-label>
        <input matInput [value]="filterValue()"
               (input)="filterValue.set($any($event.target).value)" />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      @if (loading()) {
        <div style="display:flex;justify-content:center;padding:32px">
          <mat-spinner diameter="36" />
        </div>
      } @else if (filtered().length === 0) {
        <p style="color:#888;text-align:center;padding:24px 0">
          {{ filterValue() ? 'No users match your search.' : 'All users are already linked to a member.' }}
        </p>
      } @else {
        <mat-selection-list [multiple]="false" (selectionChange)="onSelect($event)"
                            style="max-height:320px;overflow-y:auto">
          @for (user of filtered(); track user.id) {
            <mat-list-option [value]="user" [selected]="selected()?.id === user.id">
              <span matListItemTitle>
                {{ user.fullName }}
                @if (user.email === data.memberEmail) {
                  <span style="margin-left:8px;font-size:11px;color:#1976d2;font-weight:600">
                    ✓ email match
                  </span>
                }
              </span>
              <span matListItemLine>{{ user.email }}</span>
            </mat-list-option>
          }
        </mat-selection-list>
      }
    </div>

    <div mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="!selected()" (click)="confirm()">
        Link
      </button>
    </div>
  `
})
export class LinkUserDialogComponent implements OnInit {
  data = inject<LinkUserDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<LinkUserDialogComponent>);
  private userService = inject(UserService);

  loading = signal(true);
  users = signal<UserSummary[]>([]);
  selected = signal<UserSummary | null>(null);
  filterValue = signal('');

  filtered = computed(() => {
    const term = this.filterValue().toLowerCase();
    const list = term
      ? this.users().filter(u =>
          u.fullName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
      : this.users();

    if (!this.data.memberEmail) return list;
    return [...list].sort((a, b) =>
      a.email === this.data.memberEmail ? -1 : b.email === this.data.memberEmail ? 1 : 0
    );
  });

  ngOnInit() {
    this.userService.getUnlinked().subscribe({
      next: users => { this.users.set(users); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onSelect(event: MatSelectionListChange) {
    this.selected.set(event.options[0]?.value ?? null);
  }

  confirm() {
    this.dialogRef.close(this.selected());
  }
}
