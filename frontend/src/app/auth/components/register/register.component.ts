import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-wrapper">
      <div class="login-left">
        <div class="brand">
          <div class="logo">
            <span class="material-icons">storefront</span>
          </div>
          <h1>Centre Commercial</h1>
          <p>Créer un compte client</p>
        </div>
        <div class="decoration">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
      </div>

      <div class="login-right">
        <div class="login-card">
          <div class="card-header">
            <h2>Créer un compte</h2>
            <p>Rejoignez notre centre commercial</p>
          </div>

          <form (ngSubmit)="onRegister()" class="login-form">
            <div class="input-row">
              <div class="input-group">
                <input
                  type="text"
                  id="firstName"
                  [(ngModel)]="firstName"
                  name="firstName"
                  required
                  placeholder="Prénom"
                />
              </div>
              <div class="input-group">
                <input
                  type="text"
                  id="lastName"
                  [(ngModel)]="lastName"
                  name="lastName"
                  required
                  placeholder="Nom"
                />
              </div>
            </div>

            <div class="input-group">
              <span class="material-icons input-icon">email</span>
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="Email"
                autocomplete="email"
              />
            </div>

            <div class="input-group">
              <span class="material-icons input-icon">lock</span>
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="Mot de passe (min 8 caractères)"
                autocomplete="new-password"
              />
            </div>

            <div class="input-group">
              <span class="material-icons input-icon">lock</span>
              <input
                type="password"
                id="confirmPassword"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                required
                placeholder="Confirmer le mot de passe"
                autocomplete="new-password"
              />
            </div>

            <div *ngIf="errorMessage" class="error-message">
              <span class="material-icons">error</span>
              {{ errorMessage }}
            </div>

            <div *ngIf="successMessage" class="success-message">
              <span class="material-icons">check_circle</span>
              {{ successMessage }}
            </div>

            <button type="submit" [disabled]="isLoading" class="login-btn">
              <span *ngIf="!isLoading">Créer un compte</span>
              <span *ngIf="isLoading" class="loading-spinner"></span>
            </button>
          </form>

          <div class="card-footer">
            <p>Déjà inscrit? <a routerLink="/customer-login">Se connecter</a></p>
          </div>
        </div>

        <p class="footer-text">&copy; 2026 Centre Commercial</p>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      min-height: 100vh;
      background: #faf9f6;
    }

    .login-left {
      flex: 1;
      background: #1a1a2e;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
      padding: 40px;
    }

    .brand {
      position: relative;
      z-index: 2;
      text-align: center;
    }

    .logo {
      width: 80px;
      height: 80px;
      background: #e94560;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      transform: rotate(-5deg);
      box-shadow: 0 8px 32px rgba(233, 69, 96, 0.4);
    }

    .logo .material-icons {
      font-size: 40px;
      color: white;
    }

    .brand h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .brand p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .decoration {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;
    }

    .circle-1 {
      width: 400px;
      height: 400px;
      background: #e94560;
      top: -100px;
      right: -100px;
    }

    .circle-2 {
      width: 300px;
      height: 300px;
      background: #e94560;
      bottom: -50px;
      left: -50px;
    }

    .circle-3 {
      width: 150px;
      height: 150px;
      background: #e94560;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .login-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px;
      background: #faf9f6;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: white;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 8px 40px rgba(26, 26, 46, 0.08);
    }

    .card-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .card-header h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 8px;
    }

    .card-header p {
      color: #636e72;
      font-size: 14px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .input-row {
      display: flex;
      gap: 12px;
    }

    .input-row .input-group {
      flex: 1;
    }

    .input-group {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #b2bec3;
      font-size: 20px;
    }

    .input-group input {
      width: 100%;
      padding: 16px 16px 16px 48px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-size: 15px;
      font-family: 'DM Sans', sans-serif;
      background: #faf9f6;
      transition: all 0.3s ease;
    }

    .input-row .input-group input {
      padding-left: 16px;
    }

    .input-group input:focus {
      outline: none;
      border-color: #e94560;
      background: white;
    }

    .input-group input::placeholder {
      color: #b2bec3;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fff5f5;
      border: 1px solid #ffcaca;
      border-radius: 10px;
      color: #e74c3c;
      font-size: 13px;
    }

    .error-message .material-icons {
      font-size: 18px;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #f0fff4;
      border: 1px solid #bbf7d0;
      border-radius: 10px;
      color: #16a34a;
      font-size: 13px;
    }

    .success-message .material-icons {
      font-size: 18px;
    }

    .login-btn {
      width: 100%;
      padding: 16px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 54px;
    }

    .login-btn:hover:not(:disabled) {
      background: #d63651;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(233, 69, 96, 0.3);
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .card-footer {
      text-align: center;
      margin-top: 24px;
      color: #636e72;
      font-size: 14px;
    }

    .card-footer a {
      color: #e94560;
      text-decoration: none;
      font-weight: 600;
    }

    .card-footer a:hover {
      text-decoration: underline;
    }

    .footer-text {
      margin-top: 32px;
      color: #b2bec3;
      font-size: 12px;
    }

    @media (max-width: 900px) {
      .login-left {
        display: none;
      }

      .login-right {
        padding: 24px;
      }

      .login-card {
        padding: 32px 24px;
      }
    }
  `]
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
      return;
    }

    this.isLoading = true;

    this.authService.registerCustomer({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.successMessage = 'Compte créé avec succès! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/customer']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Erreur lors de la création du compte';
      }
    });
  }
}
