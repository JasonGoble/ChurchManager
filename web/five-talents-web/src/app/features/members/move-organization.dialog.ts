import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrganizationService } from '../../core/services/organization.service';
import { Organization } from '../../core/models/organization.models';

export interface MoveOrganizationDialogData {
  memberName: string;
  currentOrgId: number;
  currentOrgName?: string;
}

@Component({
  selector: 'app-move-organization-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Move to Organization</h2>
    <div mat-dialog-content style="min-width:400px">
      <p style="margin:0 0 16px;color:#555;font-size:14px">
        Moving <strong>{{ data.memberName }}</strong> from
        <strong>{{ data.currentOrgName ?? 'current organization' }}</strong>.
      </p>

      @if (loading()) {
        <div style="display:flex;justify-content:center;padding:24px">
          <mat-spinner diameter="36" />
        </div>
      } @else {
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>New Organization</mat-label>
          <mat-select [(value)]="selectedOrgId">
            @for (org of orgs(); track org.id) {
              <mat-option [value]="org.id" [disabled]="org.id === data.currentOrgId">
                {{ org.name }}
                @if (org.id === data.currentOrgId) { <span style="color:#999"> (current)</span> }
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
      }
    </div>

    <div mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary"
              [disabled]="!selectedOrgId || selectedOrgId === data.currentOrgId"
              (click)="confirm()">
        Move
      </button>
    </div>
  `
})
export class MoveOrganizationDialogComponent implements OnInit {
  data = inject<MoveOrganizationDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<MoveOrganizationDialogComponent>);
  private orgService = inject(OrganizationService);

  loading = signal(true);
  orgs = signal<Organization[]>([]);
  selectedOrgId: number | null = null;

  ngOnInit() {
    this.orgService.getAll().subscribe({
      next: orgs => { this.orgs.set(orgs); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  confirm() {
    if (this.selectedOrgId && this.selectedOrgId !== this.data.currentOrgId)
      this.dialogRef.close(this.selectedOrgId);
  }
}
