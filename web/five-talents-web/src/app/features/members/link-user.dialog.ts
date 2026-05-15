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
  templateUrl: './link-user.dialog.html'
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
