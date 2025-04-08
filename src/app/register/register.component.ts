import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  email = '';
  password = '';
  errorMessage: string | null = null;

  register() {
    this.errorMessage = null;
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Registration successful:', user);
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
}
