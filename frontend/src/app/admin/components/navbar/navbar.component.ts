import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-left">
        <button class="menu-toggle" (click)="toggleSidebar.emit()">
          <span class="material-icons">menu</span>
        </button>
        <h1 class="navbar-title">Centre Commercial - Administration</h1>
      </div>
      
      <div class="navbar-right">
        <button class="nav-icon-btn">
          <span class="material-icons">notifications</span>
          <span class="badge">3</span>
        </button>
        
        <button class="nav-icon-btn">
          <span class="material-icons">mail</span>
        </button>
        
        <div class="profile-dropdown" (click)="toggleDropdown()">
          <div class="profile-avatar">
            <span class="material-icons">person</span>
          </div>
          <span class="profile-name">{{ username }}</span>
          <span class="material-icons dropdown-arrow">expand_more</span>
          
          <div class="dropdown-menu" *ngIf="showDropdown">
            <a class="dropdown-item">
              <span class="material-icons">account_circle</span>
              Profil
            </a>
            <a class="dropdown-item">
              <span class="material-icons">settings</span>
              Paramètres
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item logout" (click)="logout()">
              <span class="material-icons">logout</span>
              Déconnexion
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      padding: 0 20px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    
    .navbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .menu-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .menu-toggle:hover {
      background-color: #f1f5f9;
    }
    
    .menu-toggle .material-icons {
      font-size: 28px;
      color: #475569;
    }
    
    .navbar-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .nav-icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .nav-icon-btn:hover {
      background-color: #f1f5f9;
    }
    
    .nav-icon-btn .material-icons {
      font-size: 24px;
      color: #64748b;
    }
    
    .badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background-color: #ef4444;
      color: white;
      font-size: 10px;
      padding: 2px 5px;
      border-radius: 10px;
      font-weight: 600;
    }
    
    .profile-dropdown {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      position: relative;
      margin-left: 8px;
    }
    
    .profile-dropdown:hover {
      background-color: #f1f5f9;
    }
    
    .profile-avatar {
      width: 36px;
      height: 36px;
      background-color: #3b82f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .profile-avatar .material-icons {
      font-size: 20px;
      color: white;
    }
    
    .profile-name {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
    }
    
    .dropdown-arrow {
      font-size: 20px;
      color: #64748b;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 180px;
      padding: 8px 0;
      margin-top: 8px;
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      color: #475569;
      text-decoration: none;
      cursor: pointer;
      font-size: 14px;
    }
    
    .dropdown-item:hover {
      background-color: #f1f5f9;
    }
    
    .dropdown-item .material-icons {
      font-size: 20px;
    }
    
    .dropdown-item.logout {
      color: #ef4444;
    }
    
    .dropdown-divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 8px 0;
    }
  `]
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  showDropdown = false;
  username = '';
  
  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    this.username = user?.username || 'Admin';
  }
  
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  
  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}
