import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { SharedModule } from '../shared/shared.module';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [SharedModule],
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
