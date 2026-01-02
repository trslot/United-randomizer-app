import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../Environments/Environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  app = initializeApp(environment.firebase);
  db = getDatabase(this.app);
  auth = getAuth(this.app);
  firestore = getFirestore(this.app);
}
