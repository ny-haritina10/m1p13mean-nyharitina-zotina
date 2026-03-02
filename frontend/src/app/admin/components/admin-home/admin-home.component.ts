import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-home">
      <div class="welcome-card">
        <h1>Bienvenue, {{ username }} 👋</h1>
        <p>Vous êtes connecté en tant que Super Administrateur.</p>
        <button (click)="logout()" class="logout-btn">Se déconnecter</button>
      </div>
    </div>
  `,
  styles: [`
    .admin-home {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .welcome-card {
      background: white;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1 {
      color: #333;
      margin-bottom: 1rem;
    }
    p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    .logout-btn {
      padding: 0.75rem 2rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }
    .logout-btn:hover {
      background-color: #c82333;
    }
  `]
})
export class AdminHomeComponent {
  username = '';

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    this.username = user?.username || 'Admin';
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}
