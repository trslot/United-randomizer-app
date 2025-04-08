import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuth = this.authService.isAuthenticated();
    console.log('AuthGuard#canActivate called. Authenticated:', isAuth);
    if (isAuth) {
      return true;
    } else {
      console.log('AuthGuard blocked navigation. Redirecting to login.');
      this.router.navigate(['']);
      return false;
    }
  }
}