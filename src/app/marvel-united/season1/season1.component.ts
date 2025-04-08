import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../../Environments/Environment';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-season1',
    standalone: true,
    imports: [MatCheckboxModule, MatButtonModule, MatDividerModule, MatExpansionModule, MatListModule],
    templateUrl: './season1.component.html',
    styleUrl: './season1.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Season1Component implements OnInit {
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

  selectedHeroes: string[] = [];
  selectedVillains: string[] = [];
  selectedLocations: string[] = [];

  isAllSelected(items: string[], selected: string[]): boolean {
    return items.length > 0 && items.every(item => selected.includes(item));
  }

  toggleSelectAll(items: string[], selected: string[]): void {
    if (this.isAllSelected(items, selected)) {
      items.forEach(item => {
        const index = selected.indexOf(item);
        if (index !== -1) selected.splice(index, 1);
      });
    } else {
      items.forEach(item => {
        if (!selected.includes(item)) selected.push(item);
      });
    }
  }

  toggleSelection(item: string, selected: string[]): void {
    const index = selected.indexOf(item);
    if (index !== -1) {
      selected.splice(index, 1);
    } else {
      selected.push(item);
    }
  }

  marvelUnitedHeroes: Array<string> = [];
  marvelUnitedVillains: Array<string> = [];
  marvelUnitedLocations: Array<string> = [];

  enterTheSpiderVerseHeroes: Array<string> = [];
  enterTheSpiderVerseVillains: Array<string> = [];
  enterTheSpiderVerseLocations: Array<string> = [];

  guardiansOfTheGalaxyRemixHeroes: Array<string> = [];
  guardiansOfTheGalaxyRemixVillains: Array<string> = [];
  guardiansOfTheGalaxyRemixLocations: Array<string> = [];

  returnOfTheSinisterSixVillains: Array<string> = [];

  riseOfTheBlackPantherHeroes: Array<string> = [];
  riseOfTheBlackPantherVillains: Array<string> = [];
  riseOfTheBlackPantherLocations: Array<string> = [];

  talesOfAsgardHeroes: Array<string> = [];
  talesOfAsgardVillains: Array<string> = [];
  talesOfAsgardLocations: Array<string> = [];

  theInfinityGauntletVillains: Array<string> = [];
  theInfinityGauntletLocations: Array<string> = [];

  unitedPledgeBonusHeroes: Array<string> = [];

  unitedStretchGoalsHeroes: Array<string> = [];
  unitedStretchGoalsVillains: Array<string> = [];

  async ngOnInit(): Promise<void> {
    const app = initializeApp(this.config);
    const db = getDatabase();
    const auth = getAuth();

    const gamesRef = ref(db, '0');

    get(gamesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const dbData = snapshot.val();

        function getFilteredNames(data: any[], game: string) {
          const gameData = data.filter((x: any) => x.season === 1 && x.game === game);

          return {
            heroes: gameData.filter((c: any) => c.type === 1).map((name: any) => name.name),
            villains: gameData.filter((c: any) => c.type === 2).map((name: any) => name.name),
            locations: gameData.filter((c: any) => c.type === 3).map((name: any) => name.name)
          };
        }

        const marvelUnitedData = getFilteredNames(dbData, 'Marvel United');
        this.marvelUnitedHeroes = marvelUnitedData.heroes;
        this.marvelUnitedVillains = marvelUnitedData.villains;
        this.marvelUnitedLocations = marvelUnitedData.locations;

        // Enter the Spider-Verse
        const enterTheSpiderVerseData = getFilteredNames(dbData, 'Enter the Spider-Verse');
        this.enterTheSpiderVerseHeroes = enterTheSpiderVerseData.heroes;
        this.enterTheSpiderVerseVillains = enterTheSpiderVerseData.villains;
        this.enterTheSpiderVerseLocations = enterTheSpiderVerseData.locations;

        // Guardians of the Galaxy Remix
        const guardiansOfTheGalaxyRemixData = getFilteredNames(dbData, 'Guardians of the Galaxy Remix');
        this.guardiansOfTheGalaxyRemixHeroes = guardiansOfTheGalaxyRemixData.heroes;
        this.guardiansOfTheGalaxyRemixVillains = guardiansOfTheGalaxyRemixData.villains;
        this.guardiansOfTheGalaxyRemixLocations = guardiansOfTheGalaxyRemixData.locations;

        // Return of the Sinister Six
        const returnOfTheSinisterSixData = getFilteredNames(dbData, 'Return of the Sinister Six');
        this.returnOfTheSinisterSixVillains = returnOfTheSinisterSixData.villains;

        // Rise of the Black Panther
        const riseOfTheBlackPantherData = getFilteredNames(dbData, 'Rise of the Black Panther');
        this.riseOfTheBlackPantherHeroes = riseOfTheBlackPantherData.heroes;
        this.riseOfTheBlackPantherVillains = riseOfTheBlackPantherData.villains;
        this.riseOfTheBlackPantherLocations = riseOfTheBlackPantherData.locations;

        // Tales of Asgard
        const talesOfAsgardData = getFilteredNames(dbData, 'Tales of Asgard');
        this.talesOfAsgardHeroes = talesOfAsgardData.heroes;
        this.talesOfAsgardVillains = talesOfAsgardData.villains;
        this.talesOfAsgardLocations = talesOfAsgardData.locations;

        // The Infinity Gauntlet
        const theInfinityGauntletData = getFilteredNames(dbData, 'The Infinity Gauntlet');
        this.theInfinityGauntletVillains = theInfinityGauntletData.villains;
        this.theInfinityGauntletLocations = theInfinityGauntletData.locations;

        // United Pledge Bonus
        const unitedPledgeBonusData = getFilteredNames(dbData, 'United Pledge Bonus');
        this.unitedPledgeBonusHeroes = unitedPledgeBonusData.heroes;

        // United Stretch Goals
        const unitedStretchGoalsData = getFilteredNames(dbData, 'United Stretch Goals');
        this.unitedStretchGoalsHeroes = unitedStretchGoalsData.heroes;
        this.unitedStretchGoalsVillains = unitedStretchGoalsData.villains;

        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
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
                this.selectedHeroes = data['heroes'] || [];
                this.selectedVillains = data['villains'] || [];
                this.selectedLocations = data['locations'] || [];
              } else {
                console.log('No saved selections found for user');
              }
            }).catch((error) => {
              console.error('Error fetching user selections:', error);
            });
            // ...


          } else {
            console.log("No data available");
          }
        });
      } else {
        // User is signed out
        // ...

        //Set everything to selected
        this.selectedHeroes = [...this.marvelUnitedHeroes, ...this.enterTheSpiderVerseHeroes, ...this.guardiansOfTheGalaxyRemixHeroes, ...this.riseOfTheBlackPantherHeroes, ...this.talesOfAsgardHeroes, ...this.unitedPledgeBonusHeroes, ...this.unitedStretchGoalsHeroes];
        this.selectedVillains = [...this.marvelUnitedVillains, ...this.enterTheSpiderVerseVillains, ...this.guardiansOfTheGalaxyRemixVillains, ...this.returnOfTheSinisterSixVillains, ...this.riseOfTheBlackPantherVillains, ...this.talesOfAsgardVillains, ...this.theInfinityGauntletVillains, ...this.unitedStretchGoalsVillains];
        this.selectedLocations = [...this.marvelUnitedLocations, ...this.enterTheSpiderVerseLocations, ...this.guardiansOfTheGalaxyRemixLocations, ...this.riseOfTheBlackPantherLocations, ...this.talesOfAsgardLocations, ...this.theInfinityGauntletLocations];
      }
    });
  }

}

