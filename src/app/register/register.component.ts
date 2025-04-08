import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { Router, RouterModule } from '@angular/router'; // Import Router and RouterModule for navigation and routerLink
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth'; // Import Firebase Auth functions

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Add FormsModule and RouterModule
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private auth: Auth = inject(Auth); // Inject Auth service
  private router: Router = inject(Router); // Inject Router service

  email = '';
  password = '';
  errorMessage: string | null = null; // To display registration errors

  register() {
    this.errorMessage = null; // Reset error message
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        // Signed up successfully
        const user = userCredential.user;
        console.log('Registration successful:', user);
        // Optionally navigate the user after registration, e.g., back to login or to a dashboard
        this.router.navigate(['/']); // Navigate to home/login page after successful registration
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Registration failed:', errorCode, errorMessage);
        this.errorMessage = errorMessage; // Display error message to the user
        // Handle specific errors (e.g., 'auth/email-already-in-use', 'auth/weak-password')
        if (errorCode === 'auth/email-already-in-use') {
          this.errorMessage = 'This email address is already in use.';
        } else if (errorCode === 'auth/weak-password') {
          this.errorMessage = 'The password is too weak. Please use a stronger password (at least 6 characters).';
        } else {
          this.errorMessage = 'An error occurred during registration. Please try again.';
        }
      });
  }
}
