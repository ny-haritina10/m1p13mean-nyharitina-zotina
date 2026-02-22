import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent, FooterComponent],
  template: `
    <app-navbar (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed"></app-navbar>
    
    <div class="admin-container" [class.sidebar-collapsed]="sidebarCollapsed">
      <app-sidebar [collapsed]="sidebarCollapsed"></app-sidebar>
      
      <div class="main-content">
        <router-outlet></router-outlet>
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: calc(100vh - 64px);
      transition: all 0.3s ease;
    }
    
    .main-content {
      flex: 1;
      margin-left: 260px;
      padding: 20px;
      background-color: #f5f5f5;
      transition: margin-left 0.3s ease;
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 64px);
    }
    
    .sidebar-collapsed .main-content {
      margin-left: 70px;
    }
    
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }
    }
  `]
})
export class LayoutComponent {
  sidebarCollapsed = false;
}
