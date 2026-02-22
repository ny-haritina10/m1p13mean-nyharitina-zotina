import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <nav class="sidebar-nav">
        <ul class="menu">
          <ng-container *ngFor="let item of menuItems">
            <li class="menu-item" [class.has-children]="item.children">
              <a
                *ngIf="!item.children"
                [routerLink]="item.route"
                routerLinkActive="active"
                class="menu-link"
              >
                <span class="material-icons menu-icon">{{ item.icon }}</span>
                <span class="menu-label" *ngIf="!collapsed">{{ item.label }}</span>
              </a>

              <div *ngIf="item.children" class="menu-parent" (click)="toggleSubmenu(item)">
                <span class="material-icons menu-icon">{{ item.icon }}</span>
                <span class="menu-label" *ngIf="!collapsed">{{ item.label }}</span>
                <span class="material-icons expand-icon" *ngIf="!collapsed">
                  {{ expandedMenus.has(item.label) ? 'expand_less' : 'expand_more' }}
                </span>
              </div>

              <ul class="submenu" *ngIf="item.children && expandedMenus.has(item.label) && !collapsed">
                <li *ngFor="let child of item.children">
                  <a [routerLink]="child.route" routerLinkActive="active" class="submenu-link">
                    {{ child.label }}
                  </a>
                </li>
              </ul>
            </li>
          </ng-container>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background-color: #1e293b;
      color: white;
      min-height: calc(100vh - 64px);
      position: fixed;
      left: 0;
      top: 64px;
      transition: width 0.3s ease;
      overflow-y: auto;
      z-index: 100;
    }

    .sidebar.collapsed {
      width: 70px;
    }

    .sidebar-nav {
      padding: 20px 0;
    }

    .menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .menu-item {
      margin: 4px 10px;
    }

    .menu-link, .menu-parent {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .menu-link:hover, .menu-parent:hover {
      background-color: #334155;
      color: white;
    }

    .menu-link.active {
      background-color: #3b82f6;
      color: white;
    }

    .menu-icon {
      font-size: 24px;
      margin-right: 12px;
      flex-shrink: 0;
    }

    .collapsed .menu-icon {
      margin-right: 0;
    }

    .menu-label {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .expand-icon {
      margin-left: auto;
      font-size: 20px;
    }

    .submenu {
      list-style: none;
      padding: 0 0 0 40px;
      margin: 0;
    }

    .submenu-link {
      display: block;
      padding: 10px 16px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 13px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .submenu-link:hover {
      background-color: #334155;
      color: white;
    }

    .submenu-link.active {
      background-color: #3b82f6;
      color: white;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;

  expandedMenus = new Set<string>();

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    {
      label: 'Gestion Locataires',
      icon: 'store',
      children: [
        { label: 'Liste vendeurs', route: '/admin/sellers' },
        { label: 'Contrats', route: '/admin/contracts' },
        { label: 'Espaces', route: '/admin/spaces' }
      ]
    }
  ];

  toggleSubmenu(item: MenuItem): void {
    if (this.expandedMenus.has(item.label)) {
      this.expandedMenus.delete(item.label);
    } else {
      this.expandedMenus.add(item.label);
    }
  }
}
