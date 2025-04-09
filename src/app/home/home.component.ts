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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getFirestore, collection } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatSlideToggleModule],
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

  private _playerCount = 1;
  get playerCount(): number {
    return this._playerCount;
  }
  set playerCount(value: number) {
    if (this._playerCount !== value) {
      this._playerCount = value;
      this.selectedHeroes = [];
      this.selectedVillain = [];
      this.selectedLocations = [];
    }
  }

  includePets: boolean = false;

  allHeroes: Array<{ name: string; game: string, type: string }> = [];
  allVillains: Array<{ name: string; game: string, type: string }> = [];
  allAntiHeroes: Array<{ name: string; game: string, type: string }> = [];
  allLocations: Array<{ name: string; game: string, type: string }> = [];
  allPets: Array<{ name: string; game: string, type: string }> = [];

  selectedHeroes: Array<{ name: string; game: string, type: string }> = [];
  selectedVillain: Array<{ name: string; game: string, type: string }> = [];
  selectedAntiHeroes: Array<{ name: string; game: string, type: string }> = [];
  selectedLocations: Array<{ name: string; game: string, type: string }> = [];
  selectedPets: Array<{ name: string; game: string, type: string }> = [];

  ngOnInit(): void {
    const app = initializeApp(this.config);
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
            this.allAntiHeroes = data['antiHeroes'] || [];
            this.allLocations = data['locations'] || [];
            this.allPets = data['pets'] || [];
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
    // Number of anti-heroes to include (adjustable)
    const antiHeroCount = Math.min(this.allAntiHeroes.length, this.playerCount);
    const selectedAntiHeroes = this.getRandomItems(this.allAntiHeroes, antiHeroCount);

    // Reset selections
    this.selectedAntiHeroes = selectedAntiHeroes;
    this.selectedHeroes = [];

    // Assign anti-heroes randomly as hero or villain
    const antiHeroesAsHeroes: Array<{ name: string; game: string, type: string }> = [];
    const antiHeroesAsVillains: Array<{ name: string; game: string, type: string }> = [];

    selectedAntiHeroes.forEach(ah => {
      if (Math.random() < 0.5) {
        antiHeroesAsHeroes.push(ah);
      } else {
        antiHeroesAsVillains.push(ah);
      }
    });

    // Select heroes excluding anti-heroes assigned as villain
    const heroPool = this.allHeroes.filter(h => !antiHeroesAsVillains.includes(h));
    const remainingHeroSlots = Math.max(0, this.playerCount - antiHeroesAsHeroes.length);
    this.selectedHeroes = [
      ...antiHeroesAsHeroes,
      ...this.getRandomItems(heroPool, remainingHeroSlots)
    ];

    // Select villain excluding anti-heroes assigned as hero
    const villainPool = this.allVillains.filter(v => !antiHeroesAsHeroes.includes(v));
    const combinedVillainPool = villainPool.concat(antiHeroesAsVillains);
    this.selectedVillain = [this.getRandomItems(combinedVillainPool, 1)[0]];

    // Locations remain unchanged
    this.selectedLocations = this.getRandomItems(this.allLocations, 6);

    // Pets
    if (this.includePets && this.allPets && this.allPets.length > 0) {
      const petCount = Math.min(this.allPets.length, this.playerCount);
      this.selectedPets = this.getRandomItems(this.allPets, petCount);
    } else {
      this.selectedPets = [];
    }
  }

  getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  onIncludePetsChange(event: any): void {
    this.includePets = event.checked;
  }
}