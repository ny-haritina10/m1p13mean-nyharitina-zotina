import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerNavbarComponent } from '../../components/navbar/customer-navbar.component';
import { CustomerFooterComponent } from '../../components/footer/customer-footer.component';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomerNavbarComponent, CustomerFooterComponent],
  template: `
    <div class="customer-home">
      <app-customer-navbar></app-customer-navbar>

      <section class="hero">
        <div class="hero-content">
          <h1>Bienvenue au Centre Commercial</h1>
          <p>Découvrez nos boutiques et faites vos achats en toute simplicité</p>
          <div class="hero-actions">
            <a routerLink="/" class="btn-primary">Continuer en tant qu'invité</a>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="feature-card">
          <span class="material-icons">shopping_bag</span>
          <h3>Multiples Boutiques</h3>
          <p>Parcourez des dizaines de boutiques</p>
        </div>
        <div class="feature-card">
          <span class="material-icons">local_shipping</span>
          <h3>Livraison</h3>
          <p>Livraison disponible</p>
        </div>
        <div class="feature-card">
          <span class="material-icons">support_agent</span>
          <h3>Support 24/7</h3>
          <p>Assistance disponible</p>
        </div>
      </section>

      <app-customer-footer></app-customer-footer>
    </div>
  `,
  styles: [`
    .customer-home {
      min-height: 100vh;
      background: #faf9f6;
    }

    .hero {
      text-align: center;
      padding: 80px 40px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
    }

    .hero-content h1 {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .hero-content p {
      font-size: 18px;
      opacity: 0.8;
      margin-bottom: 32px;
    }

    .btn-primary {
      display: inline-block;
      background: #e94560;
      color: white;
      padding: 14px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      background: #d63651;
      transform: translateY(-2px);
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      padding: 60px 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: white;
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }

    .feature-card .material-icons {
      font-size: 48px;
      color: #e94560;
      margin-bottom: 16px;
    }

    .feature-card h3 {
      margin-bottom: 8px;
      color: #1a1a2e;
    }

    .feature-card p {
      color: #636e72;
    }
  `]
})
export class CustomerHomeComponent {}
