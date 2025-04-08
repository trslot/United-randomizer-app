import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  isAuthenticated(): boolean {
    const user = this.auth.currentUser;
    console.log('AuthService.isAuthenticated() Firebase user:', user);
    return !!user;
  }
}