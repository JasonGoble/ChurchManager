import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MemberService } from '../../core/services/member.service';
import { Member } from '../../core/models/member.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private memberService = inject(MemberService);

  member = signal<Member | null | undefined>(undefined);
  loading = signal(true);

  ngOnInit() {
    this.memberService.getMyProfile().subscribe({
      next: m => { this.member.set(m); this.loading.set(false); },
      error: () => { this.member.set(null); this.loading.set(false); }
    });
  }
}
