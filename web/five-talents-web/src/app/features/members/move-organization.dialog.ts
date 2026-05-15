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
  templateUrl: './move-organization.dialog.html'
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
