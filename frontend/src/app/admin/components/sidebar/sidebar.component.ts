import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';

interface MenuItemDisplay {
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItemDisplay[];
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

            <!-- 1. Single Link Item (No Children) -->
            <li class="menu-item" *ngIf="!item.children">
              <a
                [routerLink]="item.route"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="menu-link"
                [title]="collapsed ? item.label : ''"
              >
                <span class="material-icons menu-icon">{{ item.icon }}</span>
                <span class="menu-label" *ngIf="!collapsed">{{ item.label }}</span>
              </a>
            </li>

            <!-- 2. Parent Item (Has Children) -->
            <li class="menu-item" *ngIf="item.children" [class.has-children]="true">
              <div
                class="menu-parent"
                (click)="toggleSubmenu(item)"
                [title]="collapsed ? item.label : ''"
              >
                <span class="material-icons menu-icon">{{ item.icon }}</span>
                <span class="menu-label" *ngIf="!collapsed">{{ item.label }}</span>
                <span class="material-icons expand-icon" *ngIf="!collapsed">
                  {{ expandedMenus.has(item.label) ? 'expand_less' : 'expand_more' }}
                </span>
              </div>

              <!-- 3. Submenu List -->
              <ul class="submenu" *ngIf="expandedMenus.has(item.label) && !collapsed">
                <li *ngFor="let child of item.children" class="submenu-item">
                  <a
                    [routerLink]="child.route"
                    routerLinkActive="active"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="submenu-link"
                  >
                    <span class="material-icons submenu-icon">{{ child.icon || 'chevron_right' }}</span>
                    {{ child.label }}
                  </a>
                </li>
              </ul>
            </li>

          </ng-container>
        </ul>
      </nav>

      <div class="sidebar-footer" *ngIf="!collapsed">
        <div class="footer-badge">
          <span class="material-icons">verified</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      background: #1a1a2e;
      color: white;
      min-height: calc(100vh - 72px);
      position: fixed;
      left: 0;
      top: 72px;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow-y: auto;
      z-index: 100;
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    .sidebar-nav {
      padding: 16px 12px;
      flex: 1;
    }

    .menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .menu-item {
      margin-bottom: 4px;
    }

    .menu-link, .menu-parent {
      display: flex;
      align-items: center;
      padding: 14px 16px;
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      font-weight: 500;
      user-select: none;
    }

    .menu-link:hover, .menu-parent:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    /* Active state for single links (Dashboard, etc) */
    .menu-link.active {
      background: #e94560;
      color: white;
      box-shadow: 0 4px 16px rgba(233, 69, 96, 0.3);
    }

    .menu-icon {
      font-size: 22px;
      margin-right: 14px;
      flex-shrink: 0;
    }

    .collapsed .menu-icon {
      margin-right: 0;
    }

    .menu-label {
      white-space: nowrap;
      letter-spacing: -0.2px;
    }

    .expand-icon {
      margin-left: auto;
      font-size: 20px;
      opacity: 0.5;
    }

    /* Submenu Animations & Spacing */
    .submenu {
      list-style: none;
      padding: 0 0 8px 0;
      margin: 0;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .submenu-item {
      margin-bottom: 2px;
    }

    .submenu-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px 12px 56px;
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      font-size: 13px;
      border-radius: 10px;
      transition: all 0.2s ease;
      margin: 0 4px;
    }

    .submenu-link:hover {
      background: rgba(255, 255, 255, 0.06);
      color: white;
    }

    /* Active state for Submenu links ONLY */
    .submenu-link.active {
      background: rgba(233, 69, 96, 0.15);
      color: #e94560;
    }

    .submenu-icon {
      font-size: 16px;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .footer-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.4);
      font-size: 12px;
    }

    .footer-badge .material-icons {
      font-size: 16px;
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
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;

  expandedMenus = new Set<string>();

  menuItems: MenuItemDisplay[] = [];

  private adminMenuItems: MenuItemDisplay[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    {
      label: 'Plan du Centre',
      icon: 'map',
      route: '/admin/map'
    },
    {
      label: 'Gestion Locataires',
      icon: 'people',
      children: [
        { label: 'Liste vendeurs', route: '/admin/sellers' }
      ]
    },
    {
      label: 'Espaces Commerciaux',
      icon: 'meeting_room',
      children: [
        { label: 'Liste espaces', route: '/admin/spaces' },
        { label: 'Créer espace', route: '/admin/spaces/create' },
        { label: 'Disponibilité', route: '/admin/availability' }
      ]
    },
    {
      label: 'Contrats',
      icon: 'description',
      children: [
        { label: 'Liste contrats', route: '/admin/contracts' },
        { label: 'Créer contrat', route: '/admin/contracts/create' },
        { label: 'Attribuer espace', route: '/admin/spaces/assign' }
      ]
    },
    {
      label: 'Loyers',
      icon: 'payments',
      children: [
        { label: 'Liste loyers', route: '/admin/rents' },
        { label: 'Générer loyer', route: '/admin/rents/generate' }
      ]
    },
    {
      label: 'Rapports',
      icon: 'assessment',
      children: [
        { label: 'Tableau de bord', route: '/admin/reports/dashboard' },
        { label: 'Mensuel', route: '/admin/reports/monthly' },
        { label: 'Annuel', route: '/admin/reports/yearly' }
      ]
    }
  ];

  private sellerMenuItems: MenuItemDisplay[] = [
    { label: 'Ma Boutique', icon: 'storefront', route: '/seller/boutique' },
    {
      label: 'Mes Produits',
      icon: 'inventory',
      children: [
        { label: 'Catalogue', route: '/seller/products' },
        { label: 'Catégories', route: '/seller/categories' }
      ]
    },
    {
      label: 'Stock',
      icon: 'warehouse',
      children: [
        { label: 'État des stocks', route: '/seller/stock' },
        { label: 'Mouvements', route: '/seller/stock/movements' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMenu();
    this.expandActiveSubmenu();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.expandActiveSubmenu();
    });
  }

  loadMenu(): void {
    const user = this.authService.getUser();
    if (user?.role === 'boutique') {
      this.menuItems = this.sellerMenuItems;
    } else {
      this.menuItems = this.adminMenuItems;
    }
  }

  toggleSubmenu(item: MenuItemDisplay): void {
    if (this.expandedMenus.has(item.label)) {
      this.expandedMenus.delete(item.label);
    } else {
      this.expandedMenus.clear();
      this.expandedMenus.add(item.label);
    }
  }

  private expandActiveSubmenu(): void {
    const currentUrl = this.router.url;

    this.menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child =>
          child.route && currentUrl.includes(child.route)
        );

        if (hasActiveChild) {
          this.expandedMenus.add(item.label);
        }
      }
    });
  }
}
