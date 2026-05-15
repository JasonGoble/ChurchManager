import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MemberService } from '../../../core/services/member.service';
import { AuthService } from '../../../core/services/auth.service';
import { OrganizationService } from '../../../core/services/organization.service';
import { ContactTypeService } from '../../../core/services/contact-type.service';
import { Organization } from '../../../core/models/organization.models';
import { ContactTypesDto } from '../../../core/models/contact-type.models';
import { DateInputDirective } from '../../../shared/directives/date-input.directive';
import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatCardModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatCheckboxModule, MatDividerModule, DateInputDirective,
    NgxMaterialIntlTelInputComponent
  ],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss'
})
export class MemberFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memberService = inject(MemberService);
  private auth = inject(AuthService);
  private orgService = inject(OrganizationService);
  private contactTypeService = inject(ContactTypeService);
  private snackBar = inject(MatSnackBar);

  isEdit = signal(false);
  loading = signal(false);
  saving = signal(false);
  memberId: number | null = null;
  orgs = signal<Organization[]>([]);
  contactTypes = signal<ContactTypesDto | null>(null);

  isAdmin = computed(() => !!this.auth.currentUser()?.isSystemAdmin);

  readonly phoneTextLabels = {
    mainLabel: '',
    codePlaceholder: '',
    nationalNumberLabel: 'Phone Number',
    hintLabel: '',
    searchPlaceholderLabel: 'Search country',
    noEntriesFoundLabel: 'No countries found',
    invalidNumberError: 'Invalid phone number',
    requiredError: 'Phone number is required'
  };
  currentOrgName = computed(() => {
    const id = this.form.get('organizationId')?.value;
    return this.orgs().find(o => o.id === id)?.name ?? '—';
  });

  form = this.fb.group({
    firstName:      ['', Validators.required],
    lastName:       ['', Validators.required],
    dateOfBirth:    [null as Date | null],
    joinDate:       [null as Date | null],
    gender:         [null as string | null],
    maritalStatus:  [null as string | null],
    status:         ['Active'],
    organizationId: [this.auth.currentUser()?.primaryOrganizationId ?? null as number | null, Validators.required],
    addresses: this.fb.array([]),
    emails:    this.fb.array([]),
    phones:    this.fb.array([])
  });

  get addresses() { return this.form.get('addresses') as FormArray; }
  get emails()    { return this.form.get('emails')    as FormArray; }
  get phones()    { return this.form.get('phones')    as FormArray; }

  ngOnInit() {
    this.orgService.getAll().subscribe(orgs => this.orgs.set(orgs));
    this.contactTypeService.getAll().subscribe(types => this.contactTypes.set(types));

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.memberId = Number(id);
      this.loading.set(true);
      this.memberService.getById(this.memberId).subscribe({
        next: m => {
          this.form.patchValue({
            firstName: m.firstName, lastName: m.lastName,
            dateOfBirth: m.dateOfBirth ? new Date(m.dateOfBirth) : null,
            joinDate:    m.joinDate    ? new Date(m.joinDate)    : null,
            gender: m.gender as any, maritalStatus: m.maritalStatus as any,
            status: m.status as any, organizationId: m.organizationId
          });
          m.emails.forEach(e => this.emails.push(this.makeEmailGroup(e)));
          m.phones.forEach(p => this.phones.push(this.makePhoneGroup(p)));
          m.addresses.forEach(a => this.addresses.push(this.makeAddressGroup(a)));
          this.loading.set(false);
        },
        error: () => { this.loading.set(false); this.router.navigate(['/members']); }
      });
    }
  }

  // --- Factories ---
  private makeEmailGroup(data?: any): FormGroup {
    return this.fb.group({
      id:            [data?.id ?? null],
      contactTypeId: [data?.contactTypeId ?? this.contactTypes()?.emailTypes[0]?.id ?? null],
      isPrimary:     [data?.isPrimary ?? false],
      email:         [data?.email ?? '']
    });
  }

  private makePhoneGroup(data?: any): FormGroup {
    return this.fb.group({
      id:            [data?.id ?? null],
      contactTypeId: [data?.contactTypeId ?? this.contactTypes()?.phoneTypes[0]?.id ?? null],
      isPrimary:     [data?.isPrimary ?? false],
      phoneNumber:   [data?.phoneNumber ?? ''],
      isMobile:      [data?.isMobile ?? false]
    });
  }

  private makeAddressGroup(data?: any): FormGroup {
    return this.fb.group({
      id:            [data?.id ?? null],
      contactTypeId: [data?.contactTypeId ?? this.contactTypes()?.addressTypes[0]?.id ?? null],
      isPrimary:     [data?.isPrimary ?? false],
      addressLine1:  [data?.addressLine1 ?? ''],
      addressLine2:  [data?.addressLine2 ?? ''],
      city:          [data?.city ?? ''],
      state:         [data?.state ?? ''],
      postalCode:    [data?.postalCode ?? ''],
      country:       [data?.country ?? '']
    });
  }

  // --- Add / Remove ---
  addEmail()   { this.emails.push(this.makeEmailGroup()); }
  addPhone()   { this.phones.push(this.makePhoneGroup()); }
  addAddress() { this.addresses.push(this.makeAddressGroup()); }

  removeEmail(i: number)   { this.emails.removeAt(i); }
  removePhone(i: number)   { this.phones.removeAt(i); }
  removeAddress(i: number) { this.addresses.removeAt(i); }

  // --- Primary toggling (only one primary per category) ---
  setPrimaryEmail(selected: number) {
    this.emails.controls.forEach((g, i) => {
      if (i !== selected) (g as FormGroup).patchValue({ isPrimary: false });
    });
  }

  setPrimaryPhone(selected: number) {
    this.phones.controls.forEach((g, i) => {
      if (i !== selected) (g as FormGroup).patchValue({ isPrimary: false });
    });
  }

  setPrimaryAddress(selected: number) {
    this.addresses.controls.forEach((g, i) => {
      if (i !== selected) (g as FormGroup).patchValue({ isPrimary: false });
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const v = this.form.value;

    const payload = {
      id:            this.memberId ?? 0,
      firstName:     v.firstName!,
      lastName:      v.lastName!,
      dateOfBirth:   v.dateOfBirth ? (v.dateOfBirth as Date).toISOString() : undefined,
      joinDate:      v.joinDate    ? (v.joinDate    as Date).toISOString() : undefined,
      gender:        v.gender    ?? undefined,
      maritalStatus: v.maritalStatus ?? undefined,
      status:        v.status as any,
      organizationId: v.organizationId!,
      addresses: (v.addresses as any[]) ?? [],
      emails:    (v.emails    as any[]) ?? [],
      phones:    (v.phones    as any[]) ?? []
    };

    if (this.isEdit()) {
      this.memberService.update(this.memberId!, payload as any).subscribe({
        next: () => {
          this.snackBar.open('Member updated', 'OK', { duration: 3000 });
          this.router.navigate(['/members', this.memberId]);
        },
        error: () => { this.saving.set(false); this.snackBar.open('Failed to save', 'OK', { duration: 3000 }); }
      });
    } else {
      this.memberService.create(payload as any).subscribe({
        next: res => {
          this.snackBar.open('Member added', 'OK', { duration: 3000 });
          this.router.navigate(['/members', res.id]);
        },
        error: () => { this.saving.set(false); this.snackBar.open('Failed to save', 'OK', { duration: 3000 }); }
      });
    }
  }
}
