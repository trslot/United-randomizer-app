import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { signOut } from '@angular/fire/auth';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MatCardModule, MatTabsModule, CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'google',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/web_neutral_rd_na.svg')
    );
  }
  private auth: Auth = inject(Auth);

  isLoggedIn: boolean = false;
  user: User | null = null;
  title = 'United-randomizer-app';
  showMobileMenu: boolean = false;


  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
      this.user = user;
      if (user) {
        const currentUrl = this.router.url;
        if (currentUrl === '/' || currentUrl === '/login') {
          this.router.navigate(['/home']);
        }
      }
    });
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    }).catch((error: any) => {
      console.error('Logout failed:', error);
    });
  }


  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
