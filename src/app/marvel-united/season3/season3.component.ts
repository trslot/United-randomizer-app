import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
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
  selector: 'app-season3',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, MatDividerModule, MatExpansionModule, MatListModule],
  templateUrl: './season3.component.html',
  styleUrl: './season3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Season3Component implements OnInit {

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

  marvelUnitedMultiverseHeroes: Array<string> = [];
  marvelUnitedMultiverseAntiHeroes: Array<string> = [];
  marvelUnitedMultiverseVillains: Array<string> = [];
  marvelUnitedMultiverseLocations: Array<string> = [];

  spiderGeddonCoreHeroes: Array<string> = [];
  spiderGeddonCoreAntiHeroes: Array<string> = [];
  spiderGeddonCoreVillains: Array<string> = [];
  spiderGeddonCoreLocations: Array<string> = [];

  annihilationHeroes: Array<string> = [];
  annihilationAntiHeroes: Array<string> = [];
  annihilationVillains: Array<string> = [];
  annihilationLocations: Array<string> = [];

  civilWarHeroes: Array<string> = [];
  civilWarLocations: Array<string> = [];

  maximumCarnageAntiHeroes: Array<string> = [];
  maximumCarnageVillains: Array<string> = [];
  maximumCarnageLocations: Array<string> = [];

  petCompanions: Array<string> = [];

  secretInvasionHeroes: Array<string> = [];
  secretInvasionVillains: Array<string> = [];
  secretInvasionLocations: Array<string> = [];

  theAgeOfApocalypseHeroes: Array<string> = [];
  theAgeOfApocalypseVillains: Array<string> = [];
  theAgeOfApocalypseLocations: Array<string> = [];

  theComingOfGalactusAntiHeroes: Array<string> = [];
  theComingOfGalactusVillains: Array<string> = [];
  theComingOfGalactusLocations: Array<string> = [];

  warOfKingsHeroes: Array<string> = [];
  warOfKingsAntiHeroes: Array<string> = [];
  warOfKingsVillains: Array<string> = [];
  warOfKingsLocations: Array<string> = [];

  worldWarHulkHeroes: Array<string> = [];
  worldWarHulkAntiHeroes: Array<string> = [];
  worldWarHulkLocations: Array<string> = [];

  multiversePledgeBonusHeroes: Array<string> = [];
  multiversePledgeBonusVillains: Array<string> = [];
  multiversePledgeBonusLocations: Array<string> = [];

  multiversePromosHeroes: Array<string> = [];
  multiversePromosAntiHeroes: Array<string> = [];
  multiversePromosVillains: Array<string> = [];
  multiversePromosLocations: Array<string> = [];

  selectedHeroes: string[] = [];
  selectedVillains: string[] = [];
  selectedLocations: string[] = [];
  selectedAntiHeroes: string[] = [];
  selectedPets: string[] = [];

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


  ngOnInit(): void {
    const app = initializeApp(this.config);
    const db = getDatabase();
    const auth = getAuth();

    const gamesRef = ref(db, '0');

    get(gamesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const dbData = snapshot.val();

        // Helper function to filter and map the data
        function getFilteredNames(data: any[], game: string) {
          const gameData = data.filter((x: any) => x.season === 3 && x.game === game);

          return {
            heroes: gameData.filter((c: any) => c.type === 1).map((name: any) => name.name),
            villains: gameData.filter((c: any) => c.type === 2).map((name: any) => name.name),
            locations: gameData.filter((c: any) => c.type === 3).map((name: any) => name.name),
            antiHeroes: gameData.filter((c: any) => c.type === 4).map((name: any) => name.name),
            pets: gameData.filter((c: any) => c.type === 5).map((name: any) => name.name)
          };
        }

        //Marvel United: Multiverse
        const marvelUnitedMultiverseData = getFilteredNames(dbData, 'Marvel United: Multiverse');
        this.marvelUnitedMultiverseHeroes = marvelUnitedMultiverseData.heroes;
        this.marvelUnitedMultiverseAntiHeroes = marvelUnitedMultiverseData.antiHeroes;
        this.marvelUnitedMultiverseVillains = marvelUnitedMultiverseData.villains;
        this.marvelUnitedMultiverseLocations = marvelUnitedMultiverseData.locations;

        //Spider-Geddon Core
        const spiderGeddonCoreData = getFilteredNames(dbData, 'Spider-Geddon Core');
        this.spiderGeddonCoreHeroes = spiderGeddonCoreData.heroes;
        this.spiderGeddonCoreAntiHeroes = spiderGeddonCoreData.antiHeroes;
        this.spiderGeddonCoreVillains = spiderGeddonCoreData.villains;
        this.spiderGeddonCoreLocations = spiderGeddonCoreData.locations;

        //Annihilation
        const annihilationData = getFilteredNames(dbData, 'Annihilation');
        this.annihilationHeroes = annihilationData.heroes;
        this.annihilationVillains = annihilationData.villains;
        this.annihilationLocations = annihilationData.locations;

        //Civil War
        const civilWarData = getFilteredNames(dbData, 'Civil War');
        this.civilWarHeroes = civilWarData.heroes;
        this.civilWarLocations = civilWarData.locations;

        //Maximum Carnage
        const maximumCarnageData = getFilteredNames(dbData, 'Maximum Carnage');
        this.maximumCarnageAntiHeroes = maximumCarnageData.antiHeroes;
        this.maximumCarnageVillains = maximumCarnageData.villains;
        this.maximumCarnageLocations = maximumCarnageData.locations;

        //Pet Companions
        const petCompanionsData = getFilteredNames(dbData, "Pet Companions");
        this.petCompanions = petCompanionsData.pets;

        //Secret Invasion
        const secretInvasionData = getFilteredNames(dbData, 'Secret Invasion');
        this.secretInvasionHeroes = secretInvasionData.heroes;
        this.secretInvasionVillains = secretInvasionData.villains;
        this.secretInvasionLocations = secretInvasionData.locations;

        //The Age of Apocalypse
        const theAgeOfApocalypseData = getFilteredNames(dbData, 'The Age of Apocalypse');
        this.theAgeOfApocalypseHeroes = theAgeOfApocalypseData.heroes;
        this.theAgeOfApocalypseVillains = theAgeOfApocalypseData.villains;
        this.theAgeOfApocalypseLocations = theAgeOfApocalypseData.locations;

        //The Coming of Galactus
        const theComingOfGalactusData = getFilteredNames(dbData, 'The Coming of Galactus');
        this.theComingOfGalactusAntiHeroes = theComingOfGalactusData.antiHeroes;
        this.theComingOfGalactusVillains = theComingOfGalactusData.villains;
        this.theComingOfGalactusLocations = theComingOfGalactusData.locations;

        //War of Kings
        const warOfKingsData = getFilteredNames(dbData, 'War of Kings');
        this.warOfKingsHeroes = warOfKingsData.heroes;
        this.warOfKingsAntiHeroes = warOfKingsData.antiHeroes;
        this.warOfKingsVillains = warOfKingsData.villains;
        this.warOfKingsLocations = warOfKingsData.locations;

        //World War Hulk
        const worldWarHulkData = getFilteredNames(dbData, 'World War Hulk');
        this.worldWarHulkHeroes = worldWarHulkData.heroes;
        this.worldWarHulkAntiHeroes = worldWarHulkData.antiHeroes;
        this.worldWarHulkLocations = worldWarHulkData.locations;

        //Multiverse Pledge Bonus
        const multiversePledgeBonusData = getFilteredNames(dbData, 'Multiverse Pledge Bonus');
        this.multiversePledgeBonusHeroes = multiversePledgeBonusData.heroes;
        this.multiversePledgeBonusVillains = multiversePledgeBonusData.villains;
        this.multiversePledgeBonusLocations = multiversePledgeBonusData.locations;

        //Multiverse Promos
        const multiversePromosData = getFilteredNames(dbData, 'Multiverse Promos');
        this.multiversePromosHeroes = multiversePromosData.heroes;
        this.multiversePromosAntiHeroes = multiversePromosData.antiHeroes;
        this.multiversePromosVillains = multiversePromosData.villains;
        this.multiversePromosLocations = multiversePromosData.locations;

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
                this.selectedAntiHeroes = data['antiHeroes'] || [];
                this.selectedVillains = data['villains'] || [];
                this.selectedLocations = data['locations'] || [];
                this.selectedPets = data['pets'] || [];
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
        this.selectedHeroes = [...this.marvelUnitedMultiverseHeroes, ...this.spiderGeddonCoreHeroes, ...this.annihilationHeroes, ...this.civilWarHeroes, ...this.secretInvasionHeroes, ...this.theAgeOfApocalypseHeroes, ...this.warOfKingsHeroes, ...this.worldWarHulkHeroes, ...this.multiversePledgeBonusHeroes, ...this.multiversePromosHeroes];
        this.selectedAntiHeroes = [...this.marvelUnitedMultiverseAntiHeroes, ...this.spiderGeddonCoreAntiHeroes, ...this.warOfKingsAntiHeroes, ...this.worldWarHulkAntiHeroes, ...this.multiversePromosAntiHeroes];
        this.selectedVillains = [...this.marvelUnitedMultiverseVillains, ...this.spiderGeddonCoreVillains, ...this.annihilationVillains, ...this.maximumCarnageVillains, ...this.secretInvasionVillains, ...this.theAgeOfApocalypseVillains, ...this.theComingOfGalactusVillains, ...this.warOfKingsVillains, ...this.multiversePledgeBonusVillains, ...this.multiversePromosVillains];
        this.selectedLocations = [...this.marvelUnitedMultiverseLocations, ...this.spiderGeddonCoreLocations, ...this.annihilationLocations, ...this.civilWarLocations, ...this.maximumCarnageLocations, ...this.secretInvasionLocations, ...this.theAgeOfApocalypseLocations, ...this.theComingOfGalactusLocations, ...this.warOfKingsLocations, ...this.worldWarHulkLocations, ...this.multiversePledgeBonusLocations, ...this.multiversePromosLocations];
        this.selectedPets = [...this.petCompanions];
      }
    });
  }
}



