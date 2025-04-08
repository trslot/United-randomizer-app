import { Component, OnInit, inject } from '@angular/core';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  email = '';
  password = '';
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User already logged in:', user);
      }
    });
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log('Login successful:', user);
        localStorage.setItem('userToken', 'true');
        this.router.navigate(['/home']);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error('Login failed:', errorCode, errorMessage);
      });
  }

  loginWithEmailPassword() {
    this.errorMessage = null;
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((result) => {
        const user = result.user;
        console.log('Login successful (Email/Password):', user);
        localStorage.setItem('userToken', 'true');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login failed (Email/Password):', errorCode, errorMessage);
        this.errorMessage = errorMessage;
        if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
      });
  }
}
