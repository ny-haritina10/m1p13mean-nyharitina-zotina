import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <span>&copy; 2026 RABEMANANTSOA Ny Haritina - ETU002716 & RASETRIHARINJANAHARY Zo Tina - ETU002597</span>
        <span class="version">Version 1.0.0</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: white;
      padding: 16px 20px;
      margin-top: auto;
      border-top: 1px solid #e2e8f0;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #64748b;
    }

    .version {
      font-weight: 500;
    }
  `]
})
export class FooterComponent {}
