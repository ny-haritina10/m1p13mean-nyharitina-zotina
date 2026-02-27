import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerGuard implements CanActivate {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/customer-login']);
    }
    
    const user = this.authService.getUser();
    if (user?.role === 'admin') {
      return this.router.createUrlTree(['/admin']);
    }
    if (user?.role === 'seller') {
      return this.router.createUrlTree(['/seller']);
    }
    
    return true;
  }
}
