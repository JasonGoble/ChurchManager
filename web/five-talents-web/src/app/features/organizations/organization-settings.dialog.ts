import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrganizationService } from '../../core/services/organization.service';
import { OrganizationSettings } from '../../core/models/organization.models';

export interface OrgSettingsDialogData {
  organizationId: number;
  orgName: string;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'ZAR', 'NGN', 'KES', 'INR'];

@Component({
  selector: 'app-organization-settings-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule,
    MatSlideToggleModule, MatProgressSpinnerModule, MatTooltipModule,
  ],
  template: `
    <h2 mat-dialog-title>Settings — {{ data.orgName }}</h2>

    <mat-dialog-content style="min-width: 480px">
      @if (loading()) {
        <div style="display:flex;justify-content:center;padding:32px">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else {
        <form [formGroup]="form">
          <mat-tab-group>
            <!-- Appearance & Locale -->
            <mat-tab label="General">
              <div class="tab-content">
                <div class="two-col">
                  <mat-form-field appearance="outline">
                    <mat-label>Primary Color</mat-label>
                    <input matInput formControlName="primaryColor" placeholder="#3f51b5">
                    <span matSuffix>
                      <span class="color-swatch"
                        [style.background]="form.get('primaryColor')?.value || '#ccc'"></span>
                    </span>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Secondary Color</mat-label>
                    <input matInput formControlName="secondaryColor" placeholder="#ff4081">
                    <span matSuffix>
                      <span class="color-swatch"
                        [style.background]="form.get('secondaryColor')?.value || '#ccc'"></span>
                    </span>
                  </mat-form-field>
                </div>

                <div class="two-col">
                  <mat-form-field appearance="outline">
                    <mat-label>Currency</mat-label>
                    <mat-select formControlName="currency">
                      @for (c of currencies; track c) {
                        <mat-option [value]="c">{{ c }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Fiscal Year Start</mat-label>
                    <input matInput formControlName="fiscalYearStart" placeholder="01-01"
                      [matTooltip]="'Format: MM-DD (e.g. 01-01 for Jan 1)'">
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>

            <!-- Features -->
            <mat-tab label="Features">
              <div class="tab-content toggles">
                <div class="toggle-row">
                  <div>
                    <div class="toggle-label">Online Giving</div>
                    <div class="toggle-hint">Enable the online donation portal for members</div>
                  </div>
                  <mat-slide-toggle formControlName="enableOnlineGiving"></mat-slide-toggle>
                </div>
                <div class="toggle-row">
                  <div>
                    <div class="toggle-label">Member Portal</div>
                    <div class="toggle-hint">Allow members to log in and manage their profiles</div>
                  </div>
                  <mat-slide-toggle formControlName="enableMemberPortal"></mat-slide-toggle>
                </div>
                <div class="toggle-row">
                  <div>
                    <div class="toggle-label">Attendance Tracking</div>
                    <div class="toggle-hint">Enable attendance recording for services and groups</div>
                  </div>
                  <mat-slide-toggle formControlName="enableAttendanceTracking"></mat-slide-toggle>
                </div>
              </div>
            </mat-tab>

            <!-- Google Workspace -->
            <mat-tab label="Google Workspace">
              <div class="tab-content">
                <div class="toggle-row" style="margin-bottom:16px">
                  <div>
                    <div class="toggle-label">Enable Google Workspace Integration</div>
                    <div class="toggle-hint">Sync members with your Google Workspace directory</div>
                  </div>
                  <mat-slide-toggle formControlName="googleWorkspaceEnabled"></mat-slide-toggle>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Google Workspace Domain</mat-label>
                  <input matInput formControlName="googleWorkspaceDomain"
                    placeholder="yourchurch.org">
                </mat-form-field>

                <p style="color:#888;font-size:13px;margin-top:8px">
                  OAuth credentials (Client ID &amp; Secret) are configured via environment variables.
                  Contact your system administrator to complete the Google Workspace setup.
                </p>
              </div>
            </mat-tab>
          </mat-tab-group>
        </form>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="loading() || saving()">
        @if (saving()) {
          <mat-spinner diameter="18" style="display:inline-block;margin-right:8px"></mat-spinner>
        }
        Save Settings
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tab-content { padding: 16px 0; display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .toggles { gap: 0; }
    .toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 0; border-bottom: 1px solid #f0f0f0;
    }
    .toggle-label { font-size: 14px; font-weight: 500; }
    .toggle-hint { font-size: 12px; color: #888; margin-top: 2px; }
    .color-swatch {
      display: inline-block; width: 18px; height: 18px;
      border-radius: 3px; border: 1px solid #ccc; vertical-align: middle;
    }
    mat-dialog-content { max-height: 60vh; }
  `],
})
export class OrganizationSettingsDialogComponent implements OnInit {
  data: OrgSettingsDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<OrganizationSettingsDialogComponent>);
  private orgService = inject(OrganizationService);
  private fb = inject(FormBuilder);

  currencies = CURRENCIES;
  loading = signal(true);
  saving = signal(false);

  form = this.fb.group({
    primaryColor: [''],
    secondaryColor: [''],
    currency: ['USD'],
    fiscalYearStart: ['01-01'],
    enableOnlineGiving: [false],
    enableMemberPortal: [false],
    enableAttendanceTracking: [true],
    googleWorkspaceDomain: [''],
    googleWorkspaceEnabled: [false],
  });

  ngOnInit() {
    this.orgService.getSettings(this.data.organizationId).subscribe({
      next: (s) => {
        this.form.patchValue({
          primaryColor: s.primaryColor ?? '',
          secondaryColor: s.secondaryColor ?? '',
          currency: s.currency,
          fiscalYearStart: s.fiscalYearStart,
          enableOnlineGiving: s.enableOnlineGiving,
          enableMemberPortal: s.enableMemberPortal,
          enableAttendanceTracking: s.enableAttendanceTracking,
          googleWorkspaceDomain: s.googleWorkspaceDomain ?? '',
          googleWorkspaceEnabled: s.googleWorkspaceEnabled,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  save() {
    this.saving.set(true);
    const v = this.form.getRawValue();
    const settings: OrganizationSettings = {
      organizationId: this.data.organizationId,
      primaryColor: v.primaryColor || undefined,
      secondaryColor: v.secondaryColor || undefined,
      currency: v.currency!,
      fiscalYearStart: v.fiscalYearStart!,
      enableOnlineGiving: v.enableOnlineGiving!,
      enableMemberPortal: v.enableMemberPortal!,
      enableAttendanceTracking: v.enableAttendanceTracking!,
      googleWorkspaceDomain: v.googleWorkspaceDomain || undefined,
      googleWorkspaceEnabled: v.googleWorkspaceEnabled!,
    };

    this.orgService.updateSettings(this.data.organizationId, settings).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.saving.set(false),
    });
  }
}
