import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Group, GroupType, GroupStatus, MeetingFrequency, CreateGroupRequest, UpdateGroupRequest } from '../../core/models/group.models';
import { GroupService } from '../../core/services/group.service';
import { MemberService } from '../../core/services/member.service';
import { MemberSummary, MemberStatus } from '../../core/models/member.models';

export interface GroupFormDialogData {
  organizationId: number;
  group?: Group;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const FREQUENCIES: { value: MeetingFrequency; label: string }[] = [
  { value: 'Weekly',     label: 'Every week' },
  { value: 'BiWeekly',   label: 'Every other week' },
  { value: 'Monthly',    label: 'Monthly' },
  { value: 'Quarterly',  label: 'Quarterly' },
  { value: 'AsNeeded',   label: 'As needed' },
];

const STATUSES: { value: GroupStatus; label: string }[] = [
  { value: 'Active',    label: 'Active' },
  { value: 'Forming',   label: 'Forming' },
  { value: 'Inactive',  label: 'Inactive' },
  { value: 'Disbanded', label: 'Disbanded' },
];

@Component({
  selector: 'app-group-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatTabsModule, MatProgressSpinnerModule, MatIconModule,
    MatButtonToggleModule, MatTooltipModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.group ? 'Edit Group' : 'New Group' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-tab-group>

          <!-- ── General ──────────────────────────────────── -->
          <mat-tab label="General">
            <div class="tab-content">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Group Name</mat-label>
                <input matInput formControlName="name" placeholder="e.g. Tuesday Night Small Group">
                @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                  <mat-error>Name is required</mat-error>
                }
              </mat-form-field>

              <div class="row-2">
                <mat-form-field appearance="outline">
                  <mat-label>Group Type</mat-label>
                  <mat-select formControlName="groupTypeId">
                    @for (t of groupTypes(); track t.id) {
                      <mat-option [value]="t.id">
                        <span class="type-dot" [style.background]="t.color ?? '#999'"></span>
                        {{ t.name }}
                      </mat-option>
                    }
                  </mat-select>
                  @if (form.get('groupTypeId')?.hasError('required') && form.get('groupTypeId')?.touched) {
                    <mat-error>Type is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Status</mat-label>
                  <mat-select formControlName="status">
                    @for (s of statuses; track s.value) {
                      <mat-option [value]="s.value">{{ s.label }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="What is this group about?"></textarea>
              </mat-form-field>

              <div class="row-2">
                <mat-form-field appearance="outline">
                  <mat-label>Max Capacity</mat-label>
                  <input matInput type="number" formControlName="maxCapacity" placeholder="Leave blank for unlimited">
                </mat-form-field>

                <div class="checkbox-field">
                  <mat-checkbox formControlName="isOpenToNewMembers">Open to new members</mat-checkbox>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- ── Meeting ──────────────────────────────────── -->
          <mat-tab label="Meeting">
            <div class="tab-content">
              <div class="row-2">
                <mat-form-field appearance="outline">
                  <mat-label>Frequency</mat-label>
                  <mat-select formControlName="meetingFrequency">
                    <mat-option [value]="null">Not set</mat-option>
                    @for (f of frequencies; track f.value) {
                      <mat-option [value]="f.value">{{ f.label }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Day</mat-label>
                  <mat-select formControlName="meetingDay">
                    <mat-option [value]="null">Not set</mat-option>
                    @for (d of days; track d) {
                      <mat-option [value]="d">{{ d }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="time-location-row">
                <div class="time-picker">
                  <span class="time-label">Time</span>
                  <mat-form-field appearance="outline" class="time-part" subscriptSizing="dynamic">
                    <mat-select [value]="timeHour()" (selectionChange)="onTimeChange('hour', $event.value)">
                      <mat-option [value]="null">—</mat-option>
                      @for (h of timeHours; track h) {
                        <mat-option [value]="h">{{ h }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>
                  <span class="time-colon">:</span>
                  <mat-form-field appearance="outline" class="time-part" subscriptSizing="dynamic">
                    <mat-select [value]="timeMinute()" (selectionChange)="onTimeChange('minute', $event.value)">
                      <mat-option [value]="null">—</mat-option>
                      @for (m of timeMinutes; track m) {
                        <mat-option [value]="m">{{ m }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>
                  <mat-button-toggle-group [value]="timeAmPm()" (change)="onTimeChange('ampm', $event.value)"
                    class="ampm-toggle">
                    <mat-button-toggle value="AM">AM</mat-button-toggle>
                    <mat-button-toggle value="PM">PM</mat-button-toggle>
                  </mat-button-toggle-group>
                  @if (timeHour() !== null) {
                    <button mat-icon-button matTooltip="Clear time" (click)="clearTime()">
                      <mat-icon>clear</mat-icon>
                    </button>
                  }
                </div>

                <mat-form-field appearance="outline" class="location-field">
                  <mat-label>Location</mat-label>
                  <input matInput formControlName="meetingLocation" placeholder="Room 101, Zoom link, etc.">
                </mat-form-field>
              </div>
            </div>
          </mat-tab>

          <!-- ── Leadership ───────────────────────────────── -->
          <mat-tab label="Leadership">
            <div class="tab-content">
              @if (loadingMembers()) {
                <div class="members-loading">
                  <mat-spinner diameter="32"></mat-spinner>
                  <span>Loading members…</span>
                </div>
              } @else {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Leader</mat-label>
                  <mat-select formControlName="leaderMemberId">
                    <mat-option [value]="null">— None —</mat-option>
                    @for (m of members(); track m.id) {
                      <mat-option [value]="m.id">{{ m.fullName }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Co-Leader</mat-label>
                  <mat-select formControlName="coLeaderMemberId">
                    <mat-option [value]="null">— None —</mat-option>
                    @for (m of members(); track m.id) {
                      <mat-option [value]="m.id">{{ m.fullName }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              }
            </div>
          </mat-tab>

        </mat-tab-group>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="submit()" [disabled]="saving()">
        @if (saving()) { <mat-spinner diameter="18" style="display:inline-block"></mat-spinner> }
        @else { {{ data.group ? 'Save Changes' : 'Create Group' }} }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { min-width: 560px; padding-top: 8px; }
    .tab-content { padding: 20px 4px 8px; display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .checkbox-field { display: flex; align-items: center; padding-top: 8px; }
    .type-dot {
      display: inline-block; width: 10px; height: 10px;
      border-radius: 50%; margin-right: 8px; vertical-align: middle;
    }
    .members-loading { display: flex; align-items: center; gap: 12px; padding: 24px 0; color: #888; }
    .time-location-row { display: flex; flex-direction: column; gap: 12px; }
    .time-picker { display: flex; align-items: center; gap: 8px; }
    .time-label { font-size: 12px; color: #666; white-space: nowrap; min-width: 32px; }
    .time-part { width: 80px; }
    .time-colon { font-size: 20px; font-weight: 300; color: #555; }
    .location-field { width: 100%; }
  `],
})
export class GroupFormDialogComponent implements OnInit {
  readonly data = inject<GroupFormDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<GroupFormDialogComponent>);
  private groupService = inject(GroupService);
  private memberService = inject(MemberService);
  private fb = inject(FormBuilder);

  readonly days = DAYS;
  readonly frequencies = FREQUENCIES;
  readonly statuses = STATUSES;
  readonly timeHours = [1,2,3,4,5,6,7,8,9,10,11,12];
  readonly timeMinutes = ['00','05','10','15','20','25','30','35','40','45','50','55'];

  groupTypes = signal<GroupType[]>([]);
  members = signal<MemberSummary[]>([]);
  loadingMembers = signal(false);
  saving = signal(false);

  // Time picker state (separate from the form's HH:mm string)
  timeHour = signal<number | null>(null);
  timeMinute = signal<string | null>(null);
  timeAmPm = signal<'AM' | 'PM'>('AM');

  form = this.fb.group({
    name:              ['', [Validators.required, Validators.maxLength(200)]],
    groupTypeId:       [null as number | null, Validators.required],
    status:            ['Active' as GroupStatus],
    description:       [null as string | null],
    maxCapacity:       [null as number | null],
    isOpenToNewMembers:[true],
    meetingFrequency:  [null as MeetingFrequency | null],
    meetingDay:        [null as string | null],
    meetingTime:       [null as string | null],
    meetingLocation:   [null as string | null],
    leaderMemberId:    [null as number | null],
    coLeaderMemberId:  [null as number | null],
  });

  async ngOnInit() {
    const [types, membersPage] = await Promise.all([
      firstValueFrom(this.groupService.getTypes(this.data.organizationId)),
      this.loadMembersForDropdown(),
    ]);

    this.groupTypes.set(types);

    if (this.data.group) {
      const g = this.data.group;
      this.form.patchValue({
        name:               g.name,
        groupTypeId:        g.groupTypeId,
        status:             g.status,
        description:        g.description ?? null,
        maxCapacity:        g.maxCapacity ?? null,
        isOpenToNewMembers: g.isOpenToNewMembers,
        meetingFrequency:   g.meetingFrequency ?? null,
        meetingDay:         g.meetingDay ?? null,
        meetingTime:        g.meetingTime ?? null,
        meetingLocation:    g.meetingLocation ?? null,
        leaderMemberId:     g.leaderMemberId ?? null,
        coLeaderMemberId:   g.coLeaderMemberId ?? null,
      });
      if (g.meetingTime) this.initTimePicker(g.meetingTime);
    }
  }

  private initTimePicker(hhmm: string) {
    const [h, m] = hhmm.split(':').map(Number);
    this.timeAmPm.set(h < 12 ? 'AM' : 'PM');
    this.timeHour.set(h === 0 ? 12 : h > 12 ? h - 12 : h);
    this.timeMinute.set(m.toString().padStart(2, '0'));
  }

  onTimeChange(part: 'hour' | 'minute' | 'ampm', value: any) {
    if (part === 'hour')   this.timeHour.set(value);
    if (part === 'minute') this.timeMinute.set(value);
    if (part === 'ampm')   this.timeAmPm.set(value);

    const h = this.timeHour();
    const m = this.timeMinute() ?? '00';
    if (h === null) { this.form.get('meetingTime')!.setValue(null); return; }

    let hour = h;
    if (this.timeAmPm() === 'AM' && h === 12) hour = 0;
    if (this.timeAmPm() === 'PM' && h !== 12) hour = h + 12;
    this.form.get('meetingTime')!.setValue(`${hour.toString().padStart(2, '0')}:${m}`);
  }

  clearTime() {
    this.timeHour.set(null);
    this.timeMinute.set(null);
    this.form.get('meetingTime')!.setValue(null);
  }

  private async loadMembersForDropdown(): Promise<void> {
    this.loadingMembers.set(true);
    try {
      const result = await firstValueFrom(
        this.memberService.getAll(this.data.organizationId, 1, 500, undefined, MemberStatus.Active)
      );
      this.members.set(result.items);
    } finally {
      this.loadingMembers.set(false);
    }
  }

  async submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    try {
      const v = this.form.value;
      if (this.data.group) {
        const req: UpdateGroupRequest = {
          id:                 this.data.group.id,
          organizationId:     this.data.organizationId,
          name:               v.name!,
          description:        v.description ?? undefined,
          groupTypeId:        v.groupTypeId!,
          status:             v.status as GroupStatus,
          leaderMemberId:     v.leaderMemberId ?? undefined,
          coLeaderMemberId:   v.coLeaderMemberId ?? undefined,
          meetingFrequency:   v.meetingFrequency ?? undefined,
          meetingDay:         v.meetingDay ?? undefined,
          meetingTime:        v.meetingTime ?? undefined,
          meetingLocation:    v.meetingLocation ?? undefined,
          maxCapacity:        v.maxCapacity ?? undefined,
          isOpenToNewMembers: v.isOpenToNewMembers ?? true,
          imageUrl:           this.data.group.imageUrl,
        };
        await firstValueFrom(this.groupService.update(this.data.group.id, req));
      } else {
        const req: CreateGroupRequest = {
          organizationId:     this.data.organizationId,
          name:               v.name!,
          description:        v.description ?? undefined,
          groupTypeId:        v.groupTypeId!,
          status:             v.status as GroupStatus,
          leaderMemberId:     v.leaderMemberId ?? undefined,
          coLeaderMemberId:   v.coLeaderMemberId ?? undefined,
          meetingFrequency:   v.meetingFrequency ?? undefined,
          meetingDay:         v.meetingDay ?? undefined,
          meetingTime:        v.meetingTime ?? undefined,
          meetingLocation:    v.meetingLocation ?? undefined,
          maxCapacity:        v.maxCapacity ?? undefined,
          isOpenToNewMembers: v.isOpenToNewMembers ?? true,
        };
        await firstValueFrom(this.groupService.create(req));
      }
      this.dialogRef.close(true);
    } finally {
      this.saving.set(false);
    }
  }
}
