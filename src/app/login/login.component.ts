import { Component, OnInit, inject } from '@angular/core';
import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { Auth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  email = '';
  password = '';
  showRegisterForm = false;

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
    this.errorMessage = null;
    this.email = '';
    this.password = '';
  }
  errorMessage: string | null = null;

  ngOnInit(): void {

  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
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

  register() {
    this.errorMessage = null;
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.router.navigate(['/']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Registration failed:', errorCode, errorMessage);
        this.errorMessage = errorMessage;
        if (errorCode === 'auth/email-already-in-use') {
          this.errorMessage = 'This email address is already in use.';
        } else if (errorCode === 'auth/weak-password') {
          this.errorMessage = 'The password is too weak. Please use a stronger password (at least 6 characters).';
        } else {
          this.errorMessage = 'An error occurred during registration. Please try again.';
        }
      });
  }  
  
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
