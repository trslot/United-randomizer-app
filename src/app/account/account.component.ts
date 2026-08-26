import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';

import {
  Auth,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  updatePassword,
} from '@angular/fire/auth';
import { getFirestore, doc, setDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [SharedModule, MatSelectModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  // Account
  userEmail = '';

  // Creation Date
  accountCreated = '';

  // Last Login Date
  lastLoginDate = '';

  // Login method
  loginMethod = '';

  // Preferences
  defaultPlayerCount = 1;

  preferencesMessage = '';
  preferencesSuccess = false;

  // Password
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  passwordMessage = '';
  passwordSuccess = false;

  // Authentication providers
  hasPassword = false;
  isGoogleOnly = false;

  // Version number
  versionNumber = '';


  // ==============================
  // Initialization
  // ==============================

  ngOnInit(): void {
    const user = this.auth.currentUser;
    this.accountCreated =
      this.auth.currentUser?.metadata.creationTime
        ? new Date(this.auth.currentUser.metadata.creationTime).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
        : '';

    this.lastLoginDate = this.auth.currentUser?.metadata.lastSignInTime
      ? new Date(this.auth.currentUser.metadata.lastSignInTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      : '';

    this.loginMethod = this.auth.currentUser?.providerData[0].providerId ?? 'google.com' ? 'Google' : 'Email';

    if (!user) {
      return;
    }

    this.userEmail = user.email ?? '';

    const db = getFirestore();
    const playerPreferencesRef = collection(db, 'playerPreferences');
    const p = query(
      playerPreferencesRef,
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    getDocs(p).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        const playerCount = data['numberOfPlayers'];

        this.defaultPlayerCount = playerCount;
      } else {
      }
    }).catch((error) => {
      console.error('Error fetching player preferences:', error);
    });

    const versionRef = collection(db, 'version');
    const v = query(
      versionRef,
      where('version', '>=', '0'),
      orderBy('date', 'desc'),
      limit(1)
    );

    getDocs(v).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        this.versionNumber = data['version'];
      } else {
      }
    }).catch((error) => {
      console.error('Error fetching player preferences:', error);
    });

    this.checkAuthProviders(user);
  }


  // ==============================
  // Change Password
  // ==============================

  async changePassword(): Promise<void> {

    this.passwordMessage = '';
    this.passwordSuccess = false;

    if (!this.currentPassword) {
      this.setPasswordError('Please enter your current password.');
      return;
    }

    if (!this.newPassword) {
      this.setPasswordError('Please enter a new password.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.setPasswordError('Passwords do not match.');
      return;
    }

    const user = this.auth.currentUser;

    if (!user?.email) {
      this.setPasswordError('No authenticated user.');
      return;
    }

    try {

      const credential = EmailAuthProvider.credential(
        user.email,
        this.currentPassword
      );

      // Re-authenticate before changing password
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, this.newPassword);

      this.passwordMessage = 'Password updated successfully.';
      this.passwordSuccess = true;

      this.clearPasswordFields();

    } catch (error: any) {

      console.error('Error updating password:', error);

      this.passwordMessage = this.getAuthErrorMessage(error);
      this.passwordSuccess = false;
    }
  }

  async savePreferences() {
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;

      const payload = {
        userId,
        timestamp: new Date().toISOString(),
        numberOfPlayers: this.defaultPlayerCount
      };

      const userDocRef = doc(db, 'playerPreferences', userId);
      await setDoc(userDocRef, payload);

      this.preferencesSuccess = true;
      this.preferencesMessage = 'Preferences saved successfully.';
    } catch (error) {
      console.error('Error saving preferences:', error);

      this.preferencesSuccess = false;
      this.preferencesMessage = 'Unable to save preferences. Please try again.';
    }
  }

  // ==============================
  // Delete Email/Password Account
  // ==============================

  async deleteAccountWithPassword(): Promise<void> {

    const user = this.auth.currentUser;

    if (!user?.email) {
      console.error('No authenticated user.');
      return;
    }

    if (!this.currentPassword) {
      this.setPasswordError(
        'Please enter your current password before deleting your account.'
      );
      return;
    }

    try {

      // Make sure this is actually an email/password account
      if (!this.hasPassword) {
        console.error('User does not have a password provider.');
        return;
      }

      // Re-authenticate
      const credential = EmailAuthProvider.credential(
        user.email,
        this.currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      // Delete Firebase Auth account
      await deleteUser(user);

      console.log('Account deleted successfully.');

      // Return to login/home
      await this.router.navigate(['/']);

    } catch (error: any) {

      console.error('Error deleting account:', error);

      this.passwordMessage = this.getAuthErrorMessage(error);
      this.passwordSuccess = false;
    }
  }


  // ==============================
  // Delete Google Account
  // ==============================

  async deleteGoogleOnlyAccount(): Promise<void> {

    const user = this.auth.currentUser;

    if (!user) {
      console.error('No authenticated user.');
      return;
    }

    try {

      const provider = new GoogleAuthProvider();

      // Google reauthentication
      await reauthenticateWithPopup(user, provider);

      console.log('Google reauthentication successful.');

      // Delete Firebase Auth account
      await deleteUser(user);

      console.log('Account deleted successfully.');

      await this.router.navigate(['/']);

    } catch (error: any) {

      console.error('Error deleting Google account:', error);

      if (error.code === 'auth/popup-blocked') {
        console.error(
          'The browser blocked the Google popup. Please allow popups for this site.'
        );
        return;
      }

      if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed the Google login window.');
        return;
      }

      if (error.code === 'auth/requires-recent-login') {
        console.error(
          'Recent authentication is required before deleting this account.'
        );
        return;
      }
    }
  }


  // ==============================
  // Authentication Providers
  // ==============================

  private checkAuthProviders(user: any): void {

    this.hasPassword = user.providerData.some(
      (provider: any) =>
        provider.providerId === EmailAuthProvider.PROVIDER_ID
    );

    const hasGoogle = user.providerData.some(
      (provider: any) =>
        provider.providerId === GoogleAuthProvider.PROVIDER_ID
    );

    this.isGoogleOnly = hasGoogle && !this.hasPassword;
  }


  // ==============================
  // Helpers
  // ==============================

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  private clearPasswordFields(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }


  private setPasswordError(message: string): void {
    this.passwordMessage = message;
    this.passwordSuccess = false;
  }


  private getAuthErrorMessage(error: any): string {

    switch (error?.code) {

      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'The password you entered is incorrect.';

      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';

      case 'auth/requires-recent-login':
        return 'Please sign in again before performing this action.';

      case 'auth/weak-password':
        return 'The new password is too weak.';

      default:
        return error?.message
          ? `Error: ${error.message}`
          : 'An unexpected error occurred.';
    }
  }
}