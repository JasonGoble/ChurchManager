import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MemberService } from '../../core/services/member.service';
import { AuthService } from '../../core/services/auth.service';
import { MemberStatus, MemberSummary } from '../../core/models/member.models';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatInputModule, MatFormFieldModule,
    MatButtonModule, MatIconModule, MatSelectModule, MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="page-header">
      <h1>Members</h1>
      <button mat-raised-button color="primary" routerLink="new">
        <mat-icon>person_add</mat-icon> Add Member
      </button>
    </div>

    <div class="filter-bar">
      <mat-form-field appearance="outline">
        <mat-label>Search</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input matInput [formControl]="searchControl" placeholder="Name or email..." />
      </mat-form-field>

      <mat-form-field appearance="outline" style="max-width:180px">
        <mat-label>Status</mat-label>
        <mat-select [formControl]="statusControl">
          <mat-option [value]="null">All</mat-option>
          <mat-option [value]="0">Active</mat-option>
          <mat-option [value]="1">Inactive</mat-option>
          <mat-option [value]="2">Visitor</mat-option>
          <mat-option [value]="3">Deceased</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    @if (loading()) {
      <div style="display:flex;justify-content:center;padding:48px">
        <mat-spinner diameter="40" />
      </div>
    } @else {
      <table mat-table [dataSource]="members()" class="mat-elevation-z2">

        <ng-container matColumnDef="fullName">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let m">{{ m.fullName }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let m">{{ m.email ?? '—' }}</td>
        </ng-container>

        <ng-container matColumnDef="phoneNumber">
          <th mat-header-cell *matHeaderCellDef>Phone</th>
          <td mat-cell *matCellDef="let m">{{ m.phoneNumber ?? '—' }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let m">
            <span [class]="'status-chip ' + statusClass(m.status)">{{ statusLabel(m.status) }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let m" (click)="$event.stopPropagation()">
            <button mat-icon-button matTooltip="View" (click)="view(m.id)"><mat-icon>visibility</mat-icon></button>
            <button mat-icon-button matTooltip="Edit" (click)="edit(m.id)"><mat-icon>edit</mat-icon></button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;" class="clickable-row" (click)="view(row.id)"></tr>

        @if (members().length === 0) {
          <tr class="mat-row">
            <td [colSpan]="columns.length" style="padding:32px;text-align:center;color:#999">
              No members found.
            </td>
          </tr>
        }
      </table>

      <mat-paginator
        [length]="totalCount()"
        [pageSize]="pageSize"
        [pageSizeOptions]="[10, 25, 50]"
        (page)="onPage($event)"
        showFirstLastButtons />
    }
  `,
  styles: [`
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background: #f5f5f5; }
    td.mat-column-actions { width: 80px; text-align: right; }
  `]
})
export class MembersComponent implements OnInit {
  private memberService = inject(MemberService);
  private auth = inject(AuthService);
  private router = inject(Router);

  columns = ['fullName', 'email', 'phoneNumber', 'status', 'actions'];
  members = signal<MemberSummary[]>([]);
  totalCount = signal(0);
  loading = signal(false);
  pageSize = 25;
  pageNumber = 1;

  searchControl = new FormControl('');
  statusControl = new FormControl<number | null>(null);

  ngOnInit() {
    this.load();
    this.searchControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => { this.pageNumber = 1; this.load(); });
    this.statusControl.valueChanges
      .subscribe(() => { this.pageNumber = 1; this.load(); });
  }

  load() {
    const orgId = this.auth.currentUser()?.primaryOrganizationId;
    if (!orgId) return;
    this.loading.set(true);
    this.memberService.getAll(orgId, this.pageNumber, this.pageSize,
      this.searchControl.value ?? undefined,
      this.statusControl.value ?? undefined
    ).subscribe({
      next: result => {
        this.members.set(result.items);
        this.totalCount.set(result.totalCount);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPage(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  view(id: number) { this.router.navigate(['/members', id]); }
  edit(id: number) { this.router.navigate(['/members', id, 'edit']); }

  statusLabel(status: MemberStatus) {
    return ['Active', 'Inactive', 'Visitor', 'Deceased'][status] ?? 'Unknown';
  }
  statusClass(status: MemberStatus) {
    return ['active', 'inactive', 'visitor', 'deceased'][status] ?? '';
  }
}
