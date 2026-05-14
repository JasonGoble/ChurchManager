import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Organization, OrganizationLevel } from '../../core/models/organization.models';
import { OrganizationService } from '../../core/services/organization.service';

export interface OrgFormDialogData {
  organization?: Partial<Organization> & { id?: number };
  levels: OrganizationLevel[];
  parentOrganizations: Organization[];
}

const TIMEZONES = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Phoenix', 'America/Anchorage', 'Pacific/Honolulu',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome',
  'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi',
  'Asia/Kolkata', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Singapore',
  'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland',
];

@Component({
  selector: 'app-organization-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule,
    MatCheckboxModule, MatProgressSpinnerModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Organization' : 'Add Organization' }}</h2>

    <mat-dialog-content style="min-width: 520px">
      <mat-tab-group>
        <!-- General -->
        <mat-tab label="General">
          <div class="tab-content" [formGroup]="form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="Organization name">
              @if (form.get('name')?.hasError('required')) {
                <mat-error>Name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Level</mat-label>
              <mat-select formControlName="level">
                @for (l of data.levels; track l.id) {
                  <mat-option [value]="l.level">{{ l.displayName }}</mat-option>
                }
              </mat-select>
              @if (form.get('level')?.hasError('required')) {
                <mat-error>Level is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Parent Organization</mat-label>
              <mat-select formControlName="parentOrganizationId">
                <mat-option [value]="null">— None (root) —</mat-option>
                @for (o of potentialParents; track o.id) {
                  <mat-option [value]="o.id">{{ o.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"
                placeholder="Optional description"></textarea>
            </mat-form-field>

            @if (isEdit) {
              <div style="padding: 8px 0">
                <mat-checkbox formControlName="isActive">Active</mat-checkbox>
              </div>
            }
          </div>
        </mat-tab>

        <!-- Contact -->
        <mat-tab label="Contact">
          <div class="tab-content" [formGroup]="form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="contact@example.org">
              @if (form.get('email')?.hasError('email')) {
                <mat-error>Enter a valid email address</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phoneNumber" placeholder="+1 (555) 000-0000">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Website</mat-label>
              <input matInput formControlName="website" placeholder="https://example.org">
            </mat-form-field>
          </div>
        </mat-tab>

        <!-- Location -->
        <mat-tab label="Location">
          <div class="tab-content" [formGroup]="form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Address</mat-label>
              <input matInput formControlName="address">
            </mat-form-field>

            <div class="two-col">
              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="city">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>State / Province</mat-label>
                <input matInput formControlName="state">
              </mat-form-field>
            </div>

            <div class="two-col">
              <mat-form-field appearance="outline">
                <mat-label>Postal Code</mat-label>
                <input matInput formControlName="postalCode">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Country</mat-label>
                <input matInput formControlName="country">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Time Zone</mat-label>
              <mat-select formControlName="timeZone">
                @for (tz of timezones; track tz) {
                  <mat-option [value]="tz">{{ tz }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid || saving()">
        @if (saving()) {
          <mat-spinner diameter="18" style="display:inline-block;margin-right:8px"></mat-spinner>
        }
        {{ isEdit ? 'Save Changes' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tab-content { padding: 16px 0; display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    mat-dialog-content { max-height: 60vh; }
  `],
})
export class OrganizationFormDialogComponent implements OnInit {
  data: OrgFormDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<OrganizationFormDialogComponent>);
  private orgService = inject(OrganizationService);
  private fb = inject(FormBuilder);

  timezones = TIMEZONES;
  saving = signal(false);

  get isEdit() { return !!this.data.organization?.id; }

  get potentialParents(): Organization[] {
    return this.data.parentOrganizations.filter(o => o.id !== this.data.organization?.id);
  }

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    level: [null as number | null, Validators.required],
    parentOrganizationId: [null as number | null],
    description: [''],
    website: [''],
    phoneNumber: [''],
    email: ['', Validators.email],
    address: [''],
    city: [''],
    state: [''],
    postalCode: [''],
    country: [''],
    timeZone: [''],
    isActive: [true],
  });

  ngOnInit() {
    if (this.data.organization) {
      this.form.patchValue({
        name: this.data.organization.name ?? '',
        level: this.data.organization.level ?? null,
        parentOrganizationId: this.data.organization.parentOrganizationId ?? null,
        description: this.data.organization.description ?? '',
        website: this.data.organization.website ?? '',
        phoneNumber: this.data.organization.phoneNumber ?? '',
        email: this.data.organization.email ?? '',
        city: this.data.organization.city ?? '',
        state: this.data.organization.state ?? '',
        country: this.data.organization.country ?? '',
        timeZone: this.data.organization.timeZone ?? '',
        isActive: this.data.organization.isActive ?? true,
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const v = this.form.getRawValue();

    const request$ = this.isEdit
      ? this.orgService.update({
          id: this.data.organization!.id!,
          name: v.name!,
          level: v.level!,
          parentOrganizationId: v.parentOrganizationId ?? undefined,
          description: v.description ?? undefined,
          website: v.website ?? undefined,
          phoneNumber: v.phoneNumber ?? undefined,
          email: v.email ?? undefined,
          address: v.address ?? undefined,
          city: v.city ?? undefined,
          state: v.state ?? undefined,
          postalCode: v.postalCode ?? undefined,
          country: v.country ?? undefined,
          timeZone: v.timeZone ?? undefined,
          isActive: v.isActive ?? true,
        })
      : this.orgService.create({
          name: v.name!,
          level: v.level!,
          parentOrganizationId: v.parentOrganizationId ?? undefined,
          description: v.description ?? undefined,
          website: v.website ?? undefined,
          phoneNumber: v.phoneNumber ?? undefined,
          email: v.email ?? undefined,
          address: v.address ?? undefined,
          city: v.city ?? undefined,
          state: v.state ?? undefined,
          postalCode: v.postalCode ?? undefined,
          country: v.country ?? undefined,
          timeZone: v.timeZone ?? undefined,
        });

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.saving.set(false),
    });
  }
}
