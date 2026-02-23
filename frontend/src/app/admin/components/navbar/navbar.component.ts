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
        <div class="brand">
          <div class="logo">
            <span class="material-icons">storefront</span>
          </div>
          <span class="brand-text">Centre Commercial</span>
        </div>
      </div>
      
      <div class="navbar-right">
        <button class="nav-icon-btn">
          <span class="material-icons">search</span>
        </button>
        
        <button class="nav-icon-btn">
          <span class="material-icons">notifications_none</span>
          <span class="badge"></span>
        </button>
        
        <div class="profile-dropdown" (click)="toggleDropdown()">
          <div class="profile-avatar">
            <span class="material-icons">person</span>
          </div>
          <div class="profile-info">
            <span class="profile-name">{{ username }}</span>
            <span class="profile-role">Administrateur</span>
          </div>
          <span class="material-icons dropdown-arrow">expand_more</span>
          
          <div class="dropdown-menu" *ngIf="showDropdown" (click)="$event.stopPropagation()">
            <a class="dropdown-item">
              <span class="material-icons">account_circle</span>
              Mon Profil
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
      height: 72px;
      padding: 0 24px;
      background: white;
      border-bottom: 1px solid #eee;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    
    .navbar-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .menu-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 10px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }
    
    .menu-toggle:hover {
      background: #f5f5f5;
    }
    
    .menu-toggle .material-icons {
      font-size: 26px;
      color: #1a1a2e;
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo {
      width: 40px;
      height: 40px;
      background: #e94560;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logo .material-icons {
      font-size: 22px;
      color: white;
    }
    
    .brand-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
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
      padding: 10px;
      border-radius: 10px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }
    
    .nav-icon-btn:hover {
      background: #f5f5f5;
    }
    
    .nav-icon-btn .material-icons {
      font-size: 24px;
      color: #636e72;
      transition: var(--transition);
    }
    
    .nav-icon-btn:hover .material-icons {
      color: #1a1a2e;
    }
    
    .badge {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: #e94560;
      border-radius: 50%;
      border: 2px solid white;
    }
    
    .profile-dropdown {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-radius: 12px;
      cursor: pointer;
      position: relative;
      margin-left: 8px;
      transition: var(--transition);
    }
    
    .profile-dropdown:hover {
      background: #f5f5f5;
    }
    
    .profile-avatar {
      width: 44px;
      height: 44px;
      background: #1a1a2e;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .profile-avatar .material-icons {
      font-size: 22px;
      color: white;
    }
    
    .profile-info {
      display: flex;
      flex-direction: column;
    }
    
    .profile-name {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
      line-height: 1.2;
    }
    
    .profile-role {
      font-size: 12px;
      color: #636e72;
    }
    
    .dropdown-arrow {
      font-size: 20px;
      color: #b2bec3;
    }
    
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(26, 26, 46, 0.12);
      min-width: 200px;
      padding: 8px;
      animation: dropdownFade 0.2s ease;
    }
    
    @keyframes dropdownFade {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: #2d3436;
      text-decoration: none;
      cursor: pointer;
      font-size: 14px;
      border-radius: 10px;
      transition: var(--transition);
    }
    
    .dropdown-item:hover {
      background: #f5f5f5;
    }
    
    .dropdown-item .material-icons {
      font-size: 20px;
      color: #636e72;
    }
    
    .dropdown-item.logout {
      color: #e74c3c;
    }
    
    .dropdown-item.logout .material-icons {
      color: #e74c3c;
    }
    
    .dropdown-divider {
      height: 1px;
      background: #eee;
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
