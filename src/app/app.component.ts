import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { signOut } from '@angular/fire/auth'; // Import signOut
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth'; // Import Auth and onAuthStateChanged
import { inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCardModule, MatTabsModule, CommonModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}
  private auth: Auth = inject(Auth);
  isLoggedIn: boolean = false;
  user: User | null = null;
  title = 'United-randomizer-app';

  ngOnInit(): void {

    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
      this.user = user;
      console.log('Auth state changed, logged in:', this.isLoggedIn);
    });
  }

  logout(): void {
    signOut(this.auth).then(() => {
      // Sign-out successful.
      console.log('User logged out');
      this.router.navigate(['/']);
    }).catch((error: any) => { // Added type annotation for error
      // An error happened.
      console.error('Logout failed:', error);
    });
  }

}
