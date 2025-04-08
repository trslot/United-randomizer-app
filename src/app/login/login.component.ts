import { Component, OnInit, inject } from '@angular/core';
import { signInWithEmailAndPassword } from '@angular/fire/auth'; // Import email/password sign-in
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth'; // Import necessary Firebase Auth modules
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink
import { Router } from '@angular/router'; // Import Router for navigation after login
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [FormsModule, CommonModule, RouterModule, MatButtonModule, MatFormFieldModule, MatInputModule], // Added Material form modules
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private auth: Auth = inject(Auth); // Inject Auth service
  private router: Router = inject(Router); // Inject Router service

  email = '';
  password = '';
  errorMessage: string | null = null; // To display login errors
  ngOnInit(): void {
    // Optional: Check if user is already logged in on init
    this.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User already logged in:', user);
        // Optionally navigate away if already logged in
        // this.router.navigate(['/']); // Navigate to home or dashboard
      }
    });
  }

  // Method to handle Google Sign-In
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log('Login successful:', user);
        this.router.navigate(['/home']); // Navigate to home page after successful login
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData?.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error('Login failed:', errorCode, errorMessage);
      });
  }

  // Method to handle Email/Password Sign-In
  loginWithEmailPassword() {
    this.errorMessage = null; // Reset error message
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((result) => {
        // Signed in 
        const user = result.user;
        console.log('Login successful (Email/Password):', user);
        this.router.navigate(['/home']); // Navigate to home page after successful login
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login failed (Email/Password):', errorCode, errorMessage);
        this.errorMessage = errorMessage; // Display error message to the user
        // Handle specific errors (e.g., 'auth/user-not-found', 'auth/wrong-password')
        if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
      });
  }

}

