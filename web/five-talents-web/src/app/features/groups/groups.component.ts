import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { firstValueFrom, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Group, GroupStatus } from '../../core/models/group.models';
import { GroupService } from '../../core/services/group.service';
import { AuthService } from '../../core/services/auth.service';
import { GroupFormDialogComponent } from './group-form.dialog';

const STATUS_FILTERS: { value: GroupStatus | null; label: string }[] = [
  { value: null,        label: 'All' },
  { value: 'Active',    label: 'Active' },
  { value: 'Forming',   label: 'Forming' },
  { value: 'Inactive',  label: 'Inactive' },
  { value: 'Disbanded', label: 'Disbanded' },
];

const FREQUENCY_LABELS: Record<string, string> = {
  Weekly:    'Weekly',
  BiWeekly:  'Every other week',
  Monthly:   'Monthly',
  Quarterly: 'Quarterly',
  AsNeeded:  'As needed',
};

const STATUS_COLORS: Record<GroupStatus, { bg: string; color: string }> = {
  Active:    { bg: '#e8f5e9', color: '#2e7d32' },
  Forming:   { bg: '#e3f2fd', color: '#1565c0' },
  Inactive:  { bg: '#f5f5f5', color: '#757575' },
  Disbanded: { bg: '#fce4ec', color: '#c62828' },
};

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatButtonToggleModule, MatCardModule,
    MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatProgressSpinnerModule, MatTooltipModule, MatSelectModule,
  ],
  template: `
    <div class="page-header">
      <h1>Groups & Ministries</h1>
      <button mat-raised-button color="primary" (click)="openForm()">
        <mat-icon>add</mat-icon> New Group
      </button>
    </div>

    <!-- Filter bar -->
    <div class="filter-bar">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search</mat-label>
        <input matInput [value]="searchText()"
          (input)="searchText.set($any($event.target).value)"
          placeholder="Name or description…">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      @if (isMobile()) {
        <mat-form-field appearance="outline" class="filter-select">
          <mat-label>Filter By</mat-label>
          <mat-select [value]="statusFilter()" (selectionChange)="statusFilter.set($event.value)">
            @for (f of statusFilters; track f.label) {
              <mat-option [value]="f.value">{{ f.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      } @else {
        <mat-button-toggle-group [value]="statusFilter()" (change)="statusFilter.set($event.value)">
          @for (f of statusFilters; track f.label) {
            <mat-button-toggle [value]="f.value">{{ f.label }}</mat-button-toggle>
          }
        </mat-button-toggle-group>
      }
    </div>

    @if (loading()) {
      <div class="spinner-center"><mat-spinner diameter="48"></mat-spinner></div>
    }

    @if (!loading()) {
      @if (filtered().length === 0) {
        <mat-card class="empty-card">
          <mat-icon>groups</mat-icon>
          <p>{{ groups().length === 0 ? 'No groups yet. Create your first one.' : 'No groups match the current filter.' }}</p>
        </mat-card>
      } @else {
        <div class="card-grid">
          @for (g of filtered(); track g.id) {
            <mat-card class="group-card">
              <div class="card-accent" [style.background]="g.groupTypeColor ?? '#9e9e9e'"></div>

              <div class="card-body">
                <div class="card-top">
                  <div class="card-title-row">
                    <span class="group-name">{{ g.name }}</span>
                    <span class="status-chip"
                      [style.background]="statusStyle(g.status).bg"
                      [style.color]="statusStyle(g.status).color">
                      {{ g.status }}
                    </span>
                  </div>
                  <div class="type-row">
                    @if (g.groupTypeIcon) {
                      <mat-icon class="type-icon">{{ g.groupTypeIcon }}</mat-icon>
                    }
                    <span class="type-name">{{ g.groupTypeName }}</span>
                  </div>
                </div>

                @if (g.description) {
                  <p class="description">{{ g.description }}</p>
                }

                <div class="meta-rows">
                  @if (g.leaderName) {
                    <div class="meta-row">
                      <mat-icon class="meta-icon">person</mat-icon>
                      <span>{{ g.leaderName }}{{ g.coLeaderName ? ' · ' + g.coLeaderName : '' }}</span>
                    </div>
                  }

                  @if (g.meetingFrequency || g.meetingDay) {
                    <div class="meta-row">
                      <mat-icon class="meta-icon">event</mat-icon>
                      <span>
                        {{ g.meetingDay ?? '' }}
                        {{ g.meetingFrequency ? '(' + frequencyLabel(g.meetingFrequency) + ')' : '' }}
                        {{ g.meetingTime ? '@ ' + formatTime(g.meetingTime) : '' }}
                      </span>
                    </div>
                  }

                  @if (g.meetingLocation) {
                    <div class="meta-row">
                      <mat-icon class="meta-icon">place</mat-icon>
                      <span>{{ g.meetingLocation }}</span>
                    </div>
                  }

                  <div class="meta-row">
                    <mat-icon class="meta-icon">group</mat-icon>
                    <span>
                      {{ g.memberCount }} member{{ g.memberCount !== 1 ? 's' : '' }}
                      {{ g.maxCapacity ? '/ ' + g.maxCapacity : '' }}
                    </span>
                    @if (!g.isOpenToNewMembers) {
                      <span class="closed-badge">Closed</span>
                    }
                  </div>
                </div>
              </div>

              <div class="card-actions">
                <button mat-icon-button matTooltip="Edit" (click)="openForm(g)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Delete" color="warn" (click)="deleteGroup(g)">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </div>
            </mat-card>
          }
        </div>
      }
    }
  `,
  styles: [`
    .page-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
    }
    .page-header h1 { margin: 0; font-size: 24px; font-weight: 400; color: #333; }

    .filter-bar {
      display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
    }
    .search-field { flex: 1; min-width: 220px; max-width: 360px; }
    .filter-select { width: 160px; }

    .spinner-center { display: flex; justify-content: center; padding: 64px; }

    .empty-card {
      display: flex; flex-direction: column; align-items: center;
      padding: 48px; color: #aaa; gap: 12px;
    }
    .empty-card mat-icon { font-size: 48px; width: 48px; height: 48px; }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .group-card {
      position: relative; overflow: hidden;
      display: flex; flex-direction: column;
      padding: 0 !important;
    }

    .card-accent {
      height: 4px; width: 100%; flex-shrink: 0;
    }

    .card-body {
      flex: 1; padding: 16px 16px 8px;
      display: flex; flex-direction: column; gap: 10px;
    }

    .card-top { display: flex; flex-direction: column; gap: 4px; }

    .card-title-row {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
    }

    .group-name {
      font-size: 16px; font-weight: 500; color: #212121; line-height: 1.3;
    }

    .status-chip {
      font-size: 11px; padding: 2px 8px; border-radius: 10px;
      font-weight: 500; white-space: nowrap; flex-shrink: 0;
    }

    .type-row {
      display: flex; align-items: center; gap: 4px; color: #757575;
    }
    .type-icon { font-size: 16px; width: 16px; height: 16px; }
    .type-name { font-size: 12px; }

    .description {
      margin: 0; font-size: 13px; color: #555;
      display: -webkit-box; -webkit-line-clamp: 2;
      -webkit-box-orient: vertical; overflow: hidden;
    }

    .meta-rows { display: flex; flex-direction: column; gap: 4px; }
    .meta-row {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; color: #555;
    }
    .meta-icon { font-size: 16px; width: 16px; height: 16px; color: #9e9e9e; }

    .closed-badge {
      font-size: 10px; padding: 1px 6px; border-radius: 8px;
      background: #fbe9e7; color: #bf360c; font-weight: 500; margin-left: 4px;
    }

    .card-actions {
      display: flex; justify-content: flex-end;
      padding: 4px 8px 4px; border-top: 1px solid #f5f5f5;
    }
  `],
})
export class GroupsComponent implements OnInit {
  private groupService = inject(GroupService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private bp = inject(BreakpointObserver);

  isMobile = toSignal(
    this.bp.observe('(max-width: 767px)').pipe(map(r => r.matches)),
    { initialValue: false }
  );

  readonly statusFilters = STATUS_FILTERS;

  loading = signal(false);
  searchText = signal('');
  statusFilter = signal<GroupStatus | null>(null);
  groups = signal<Group[]>([]);

  filtered = computed(() => {
    let list = this.groups();
    const q = this.searchText().toLowerCase().trim();
    const s = this.statusFilter();
    if (q) list = list.filter(g =>
      g.name.toLowerCase().includes(q) ||
      (g.description ?? '').toLowerCase().includes(q)
    );
    if (s) list = list.filter(g => g.status === s);
    return list;
  });

  private get orgId(): number {
    return this.authService.currentUser()?.primaryOrganizationId ?? 0;
  }

  ngOnInit() { this.load(); }

  private async load() {
    this.loading.set(true);
    try {
      const groups = await firstValueFrom(this.groupService.getAll(this.orgId));
      this.groups.set(groups);
    } finally {
      this.loading.set(false);
    }
  }

  openForm(group?: Group) {
    const ref = this.dialog.open(GroupFormDialogComponent, {
      width: '620px',
      maxWidth: '95vw',
      data: { organizationId: this.orgId, group },
    });
    ref.afterClosed().subscribe(saved => { if (saved) this.load(); });
  }

  async deleteGroup(group: Group) {
    if (!confirm(`Delete "${group.name}"? This cannot be undone.`)) return;
    await firstValueFrom(this.groupService.delete(group.id));
    this.load();
  }

  statusStyle(status: GroupStatus) {
    return STATUS_COLORS[status] ?? { bg: '#f5f5f5', color: '#757575' };
  }

  frequencyLabel(freq: string): string {
    return FREQUENCY_LABELS[freq] ?? freq;
  }

  formatTime(hhmm: string): string {
    const [h, m] = hhmm.split(':').map(Number);
    const ampm = h < 12 ? 'AM' : 'PM';
    const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
  }
}
