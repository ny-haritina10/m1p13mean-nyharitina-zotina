import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <span class="copyright">
          <span class="material-icons">copyright</span>
          2026 Centre Commercial - Administration
        </span>
        <span class="authors">RABEMANANTSOA Ny Haritina & RASETRIHARINJANAHARY Zo Tina</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: white;
      padding: 20px 32px;
      margin-top: auto;
      border-top: 1px solid #eee;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #636e72;
    }

    .copyright {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .copyright .material-icons {
      font-size: 16px;
    }

    .authors {
      font-weight: 500;
      color: #1a1a2e;
    }
  `]
})
export class FooterComponent {}
