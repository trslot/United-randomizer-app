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
import { MatRadioModule } from '@angular/material/radio';

export enum SeasonFilter {
  All = 'all',
  MarvelOnly = 'marvel',
  DcOnly = 'dc'
}

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getFirestore, collection } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatSlideToggleModule, MatRadioModule],
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
  SeasonFilter = SeasonFilter;

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
  includeMarvelAndDC: boolean = false;
  seasonFilter: SeasonFilter = SeasonFilter.All;
  hasMarvelGames: boolean = false;
  hasDcGames: boolean = false;
  get showSeasonFilter(): boolean {
    return this.hasMarvelGames && this.hasDcGames;
  }

  allHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  allVillains: Array<{ name: string; game: string, type: string, season: number }> = [];
  allAntiHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  allLocations: Array<{ name: string; game: string, type: string, season: number }> = [];
  allPets: Array<{ name: string; game: string, type: string, season: number }> = [];

  selectedHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  selectedVillain: Array<{ name: string; game: string, type: string, season: number }> = [];
  selectedAntiHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  selectedLocations: Array<{ name: string; game: string, type: string, season: number }> = [];
  selectedPets: Array<{ name: string; game: string, type: string, season: number }> = [];

  ngOnInit(): void {
    const app = initializeApp(this.config);
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const db = getFirestore();
        const userSelectionsRef = collection(db, 'userSelections');
        const playerPreferencesRef = collection(db, 'playerPreferences');
        const q = query(
          userSelectionsRef,
          where('userId', '==', uid),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const p = query(
          playerPreferencesRef,
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
            this.updateGameAvailability();
          } else {
          }
        }).catch((error) => {
          console.error('Error fetching user selections:', error);
        });

        getDocs(p).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            const playerCount = data['numberOfPlayers'];

            if (typeof playerCount === 'number') {
              this._playerCount = playerCount;
            }
          } else {
          }
        }).catch((error) => {
          console.error('Error fetching user selections:', error);
        });
      } else {
      }
    });
  }

  randomize() {
    // Filter data based on season selection
    // DC games have season: 4, Marvel games have season: 1, 2, or 3
    const isMarvelGame = (item: { season: number }) => item.season >= 1 && item.season <= 3;
    const isDcGame = (item: { season: number }) => item.season === 4;

    let filteredHeroes = this.allHeroes;
    let filteredVillains = this.allVillains;
    let filteredAntiHeroes = this.allAntiHeroes;
    let filteredLocations = this.allLocations;
    let filteredPets = this.allPets;

    switch (this.seasonFilter) {
      case SeasonFilter.MarvelOnly:
        filteredHeroes = this.allHeroes.filter(isMarvelGame);
        filteredVillains = this.allVillains.filter(isMarvelGame);
        filteredAntiHeroes = this.allAntiHeroes.filter(isMarvelGame);
        filteredLocations = this.allLocations.filter(isMarvelGame);
        filteredPets = this.allPets.filter(isMarvelGame);
        break;
      case SeasonFilter.DcOnly:
        filteredHeroes = this.allHeroes.filter(isDcGame);
        filteredVillains = this.allVillains.filter(isDcGame);
        filteredAntiHeroes = this.allAntiHeroes.filter(isDcGame);
        filteredLocations = this.allLocations.filter(isDcGame);
        filteredPets = this.allPets.filter(isDcGame);
        break;
      case SeasonFilter.All:
      default:
        // Use all data
        break;
    }

    // Number of anti-heroes to include (adjustable)
    const antiHeroCount = Math.min(filteredAntiHeroes.length, this.playerCount);
    const selectedAntiHeroes = this.getRandomItems(filteredAntiHeroes, antiHeroCount);

    // Reset selections
    this.selectedAntiHeroes = selectedAntiHeroes;
    this.selectedHeroes = [];

    // Assign anti-heroes randomly as hero or villain
    const antiHeroesAsHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
    const antiHeroesAsVillains: Array<{ name: string; game: string, type: string, season: number }> = [];

    selectedAntiHeroes.forEach(ah => {
      if (Math.random() < 0.5) {
        antiHeroesAsHeroes.push(ah);
      } else {
        antiHeroesAsVillains.push(ah);
      }
    });

    // Select heroes excluding anti-heroes assigned as villain
    const heroPool = filteredHeroes.filter(h => !antiHeroesAsVillains.includes(h));
    const remainingHeroSlots = Math.max(0, this.playerCount - antiHeroesAsHeroes.length);
    this.selectedHeroes = [
      ...antiHeroesAsHeroes,
      ...this.getRandomItems(heroPool, remainingHeroSlots)
    ].map(item => ({
      name: item.name,
      game: item.game,
      type: item.type,
      season: item.season
    }));

    // Select villain excluding anti-heroes assigned as hero
    const villainPool = filteredVillains.filter(v => !antiHeroesAsHeroes.includes(v));
    const combinedVillainPool = villainPool.concat(antiHeroesAsVillains);
    this.selectedVillain = [this.getRandomItems(combinedVillainPool, 1)[0]];

    // Locations remain unchanged
    this.selectedLocations = this.getRandomItems(filteredLocations, 6);

    // Pets
    if (this.includePets && filteredPets && filteredPets.length > 0) {
      const petCount = Math.min(filteredPets.length, this.playerCount);
      this.selectedPets = this.getRandomItems(filteredPets, petCount);
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
    this.selectedHeroes = [];
    this.selectedVillain = [];
    this.selectedAntiHeroes = [];
    this.selectedLocations = [];
    this.selectedPets = [];
  }

  onSeasonFilterChange(filter: string): void {
    this.seasonFilter = filter as SeasonFilter;
    this.selectedHeroes = [];
    this.selectedVillain = [];
    this.selectedAntiHeroes = [];
    this.selectedLocations = [];
    this.selectedPets = [];
  }

  private updateGameAvailability(): void {
    const allItems = [
      ...this.allHeroes,
      ...this.allVillains,
      ...this.allAntiHeroes,
      ...this.allLocations,
      ...this.allPets
    ];
    this.hasMarvelGames = allItems.some(item => item.season >= 1 && item.season <= 3);
    this.hasDcGames = allItems.some(item => item.season === 4);

    // Auto-set filter if user only has one type
    if (this.hasMarvelGames && !this.hasDcGames) {
      this.seasonFilter = SeasonFilter.MarvelOnly;
    } else if (!this.hasMarvelGames && this.hasDcGames) {
      this.seasonFilter = SeasonFilter.DcOnly;
    }
  }
}