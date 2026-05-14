import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MemberService } from '../../../core/services/member.service';
import { AuthService } from '../../../core/services/auth.service';
import { OrganizationService } from '../../../core/services/organization.service';
import { MemberStatus } from '../../../core/models/member.models';
import { Organization } from '../../../core/models/organization.models';
import { DateInputDirective } from '../../../shared/directives/date-input.directive';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatCardModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, MatProgressSpinnerModule, MatSnackBarModule,
    DateInputDirective
  ],
  template: `
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <button mat-icon-button routerLink="/members"><mat-icon>arrow_back</mat-icon></button>
        <h1>{{ isEdit() ? 'Edit Member' : 'Add Member' }}</h1>
      </div>
    </div>

    @if (loading()) {
      <div style="display:flex;justify-content:center;padding:48px">
        <mat-spinner diameter="40" />
      </div>
    } @else {
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="cards-grid">

          <mat-card>
            <mat-card-header><mat-card-title>Personal Information</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="firstName" />
                  @if (form.get('firstName')?.hasError('required')) {
                    <mat-error>First name is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="lastName" />
                  @if (form.get('lastName')?.hasError('required')) {
                    <mat-error>Last name is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" />
                  @if (form.get('email')?.hasError('email')) {
                    <mat-error>Invalid email address</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Phone Number</mat-label>
                  <input matInput formControlName="phoneNumber" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Date of Birth</mat-label>
                  <input matInput [matDatepicker]="dobPicker" formControlName="dateOfBirth"
                         placeholder="MM/DD/YYYY" autocomplete="bday" />
                  <mat-datepicker-toggle matIconSuffix [for]="dobPicker" />
                  <mat-datepicker #dobPicker />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Join Date</mat-label>
                  <input matInput [matDatepicker]="joinPicker" formControlName="joinDate" />
                  <mat-datepicker-toggle matIconSuffix [for]="joinPicker" />
                  <mat-datepicker #joinPicker />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Gender</mat-label>
                  <mat-select formControlName="gender">
                    <mat-option [value]="null">— Select —</mat-option>
                    <mat-option value="Male">Male</mat-option>
                    <mat-option value="Female">Female</mat-option>
                    <mat-option value="Other">Other</mat-option>
                    <mat-option value="PreferNotToSay">Prefer not to say</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Marital Status</mat-label>
                  <mat-select formControlName="maritalStatus">
                    <mat-option [value]="null">— Select —</mat-option>
                    <mat-option value="Single">Single</mat-option>
                    <mat-option value="Married">Married</mat-option>
                    <mat-option value="Divorced">Divorced</mat-option>
                    <mat-option value="Widowed">Widowed</mat-option>
                  </mat-select>
                </mat-form-field>

                @if (isEdit() && isAdmin()) {
                  <mat-form-field appearance="outline">
                    <mat-label>Status</mat-label>
                    <mat-select formControlName="status">
                      <mat-option value="Active">Active</mat-option>
                      <mat-option value="Inactive">Inactive</mat-option>
                      <mat-option value="Visitor">Visitor</mat-option>
                      <mat-option value="Deceased">Deceased</mat-option>
                    </mat-select>
                  </mat-form-field>
                }

                @if (!isEdit()) {
                  @if (isAdmin()) {
                    <mat-form-field appearance="outline">
                      <mat-label>Organization</mat-label>
                      <mat-select formControlName="organizationId">
                        @for (org of orgs(); track org.id) {
                          <mat-option [value]="org.id">{{ org.name }}</mat-option>
                        }
                      </mat-select>
                    </mat-form-field>
                  } @else {
                    <mat-form-field appearance="outline">
                      <mat-label>Organization</mat-label>
                      <input matInput [value]="currentOrgName()" disabled />
                    </mat-form-field>
                  }
                }
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card>
            <mat-card-header><mat-card-title>Address</mat-card-title></mat-card-header>
            <mat-card-content>
              <div class="form-grid">
                <mat-form-field appearance="outline" style="grid-column:span 2">
                  <mat-label>Street Address</mat-label>
                  <input matInput formControlName="address" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>City</mat-label>
                  <input matInput formControlName="city" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>State / Province</mat-label>
                  <input matInput formControlName="state" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Postal Code</mat-label>
                  <input matInput formControlName="postalCode" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Country</mat-label>
                  <input matInput formControlName="country" />
                </mat-form-field>
              </div>
            </mat-card-content>
          </mat-card>

        </div>

        <div style="display:flex;gap:8px;margin-top:16px;justify-content:flex-end">
          <button mat-stroked-button type="button" routerLink="/members">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            @if (saving()) { <mat-spinner diameter="18" style="display:inline-block;margin-right:8px" /> }
            {{ isEdit() ? 'Save Changes' : 'Add Member' }}
          </button>
        </div>
      </form>
    }
  `,
  styles: [`
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
      padding-top: 8px;
      mat-form-field { width: 100%; }
    }
    @media (max-width: 767px) {
      .cards-grid { grid-template-columns: 1fr; }
      .form-grid  { grid-template-columns: 1fr; }
    }
  `]
})
export class MemberFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memberService = inject(MemberService);
  private auth = inject(AuthService);
  private orgService = inject(OrganizationService);
  private snackBar = inject(MatSnackBar);

  isEdit = signal(false);
  loading = signal(false);
  saving = signal(false);
  memberId: number | null = null;
  orgs = signal<Organization[]>([]);

  isAdmin = computed(() => !!this.auth.currentUser()?.isSystemAdmin);
  currentOrgName = computed(() => {
    const id = this.form.get('organizationId')?.value;
    return this.orgs().find(o => o.id === id)?.name ?? '—';
  });

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    phoneNumber: [''],
    dateOfBirth: [null as Date | null],
    joinDate: [null as Date | null],
    gender: [null as string | null],
    maritalStatus: [null as string | null],
    status: ['Active'],
    organizationId: [this.auth.currentUser()?.primaryOrganizationId ?? null as number | null, Validators.required],
    address: [''],
    city: [''],
    state: [''],
    postalCode: [''],
    country: ['']
  });

  ngOnInit() {
    this.orgService.getAll().subscribe(orgs => this.orgs.set(orgs));

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.memberId = Number(id);
      this.loading.set(true);
      this.memberService.getById(this.memberId).subscribe({
        next: m => {
          this.form.patchValue({
            ...m,
            dateOfBirth: m.dateOfBirth ? new Date(m.dateOfBirth) : null,
            joinDate: m.joinDate ? new Date(m.joinDate) : null,
          } as any);
          this.loading.set(false);
        },
        error: () => { this.loading.set(false); this.router.navigate(['/members']); }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const v = this.form.value;

    if (this.isEdit()) {
      this.memberService.update(this.memberId!, { ...v as any }).subscribe({
        next: () => {
          this.snackBar.open('Member updated', 'OK', { duration: 3000 });
          this.router.navigate(['/members', this.memberId]);
        },
        error: () => { this.saving.set(false); this.snackBar.open('Failed to save', 'OK', { duration: 3000 }); }
      });
    } else {
      this.memberService.create({ ...v as any }).subscribe({
        next: res => {
          this.snackBar.open('Member added', 'OK', { duration: 3000 });
          this.router.navigate(['/members', res.id]);
        },
        error: () => { this.saving.set(false); this.snackBar.open('Failed to save', 'OK', { duration: 3000 }); }
      });
    }
  }
}
