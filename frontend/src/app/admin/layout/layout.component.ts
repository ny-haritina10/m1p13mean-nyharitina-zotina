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
      
      <main class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #faf9f6;
    }
    
    .admin-container {
      display: flex;
      min-height: 100vh;
      padding-top: 72px;
      box-sizing: border-box;
    }
    
    .main-content {
      flex: 1;
      margin-left: 280px;
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 72px);
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .content-wrapper {
      flex: 1;
      padding: 32px;
    }
    
    .sidebar-collapsed .main-content {
      margin-left: 80px;
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
