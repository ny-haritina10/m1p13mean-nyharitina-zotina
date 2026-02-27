import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <p>&copy; 2026 Centre Commercial. Tous droits réservés.</p>
    </footer>
  `,
  styles: [`
    .footer {
      text-align: center;
      padding: 20px;
      color: #636e72;
      background: white;
    }
  `]
})
export class CustomerFooterComponent {}
