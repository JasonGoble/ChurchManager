import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shell.component.html'
})
export class ShellComponent {
  auth = inject(AuthService);
  sidebarOpen = signal(false);

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
