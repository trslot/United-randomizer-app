import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../Environments/Environment';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  config = {
    apiKey: environment.firebase.apiKey,
    authDomain: environment.firebase.authDomain,
    databaseURL: environment.firebase.databaseURL,
    projectId: environment.firebase.projectId,
    storageBucket: environment.firebase.storageBucket,
    messagingSenderId: environment.firebase.messagingSenderId,
    appId: environment.firebase.appId,
    measurementId: environment.firebase.measurementId
  }

  playerCount: number = 1;

  allHeroes: string[] = [];
  allVillains: string[] = [];
  allLocations: string[] = [];

  selectedHeroes: string[] = [];
  selectedVillain: string | null = null;
  selectedLocations: string[] = [];

  ngOnInit(): void {
    const app = initializeApp(this.config);
    const db = getDatabase();
    const auth = getAuth();


    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const db = getFirestore();
        const userSelectionsRef = collection(db, 'userSelections');
        const q = query(
          userSelectionsRef,
          where('userId', '==', uid),
          orderBy('timestamp', 'desc'),
          limit(1)
        );

        getDocs(q).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            this.allHeroes = data['heroes'] || [];
            this.allVillains = data['villains'] || [];
            this.allLocations = data['locations'] || [];
          } else {
            console.log('No saved selections found for user');
          }
        }).catch((error) => {
          console.error('Error fetching user selections:', error);
        });
      } else {
        console.log("No data available");
      }
    });    
  }

  randomize() {
    this.selectedHeroes = this.getRandomItems(this.allHeroes, this.playerCount);
    this.selectedVillain = this.getRandomItems(this.allVillains, 1)[0] || null;
    this.selectedLocations = this.getRandomItems(this.allLocations, 6);
  }

  getRandomItems(array: string[], count: number): string[] {
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}