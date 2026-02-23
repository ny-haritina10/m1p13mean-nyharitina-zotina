import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
   
  `,
  styles: [`

  `]
})
export class DashboardComponent {
  username = '';

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    this.username = user?.username || 'Admin';
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}
