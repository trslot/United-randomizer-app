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

  marvelUnitedMultiverseHeroes: Array<{ name: string; game: string, type: string  }> = [];
  marvelUnitedMultiverseAntiHeroes: Array<{ name: string; game: string, type: string  }> = [];
  marvelUnitedMultiverseVillains: Array<{ name: string; game: string, type: string  }> = [];
  marvelUnitedMultiverseLocations: Array<{ name: string; game: string, type: string  }> = [];

  spiderGeddonCoreHeroes: Array<{ name: string; game: string, type: string  }> = [];
  spiderGeddonCoreAntiHeroes: Array<{ name: string; game: string, type: string  }> = [];
  spiderGeddonCoreVillains: Array<{ name: string; game: string, type: string  }> = [];
  spiderGeddonCoreLocations: Array<{ name: string; game: string, type: string  }> = [];

  annihilationHeroes: Array<{ name: string; game: string, type: string  }> = [];
  annihilationAntiHeroes: Array<{ name: string; game: string, type: string  }> = [];
  annihilationVillains: Array<{ name: string; game: string, type: string  }> = [];
  annihilationLocations: Array<{ name: string; game: string, type: string  }> = [];

  civilWarHeroes: Array<{ name: string; game: string, type: string  }> = [];
  civilWarLocations: Array<{ name: string; game: string, type: string  }> = [];

  maximumCarnageAntiHeroes: Array<{ name: string; game: string, type: string  }> = [];
  maximumCarnageVillains: Array<{ name: string; game: string, type: string  }> = [];
  maximumCarnageLocations: Array<{ name: string; game: string, type: string  }> = [];

  petCompanions: Array<{ name: string; game: string, type: string  }> = [];

  secretInvasionHeroes: Array<{ name: string; game: string, type: string  }> = [];
  secretInvasionVillains: Array<{ name: string; game: string, type: string  }> = [];
  secretInvasionLocations: Array<{ name: string; game: string, type: string  }> = [];

  theAgeOfApocalypseHeroes: Array<{ name: string; game: string, type: string  }> = [];
  theAgeOfApocalypseVillains: Array<{ name: string; game: string, type: string  }> = [];
  theAgeOfApocalypseLocations: Array<{ name: string; game: string, type: string  }> = [];

  theComingOfGalactusAntiHeroes: Array<{ name: string; game: string, type: string  }> = [];
  theComingOfGalactusVillains: Array<{ name: string; game: string, type: string  }> = [];
  theComingOfGalactusLocations: Array<{ name: string; game: string, type: string  }> = [];

  warOfKingsHeroes: Array<{ name: string; game: string, type: string  }> = [];
  warOfKingsAntiHeroes: Array<{ name: string; game: string, type: string  }> = [];
  warOfKingsVillains: Array<{ name: string; game: string, type: string  }> = [];
  warOfKingsLocations: Array<{ name: string; game: string, type: string  }> = [];

  worldWarHulkHeroes: Array<{ name: string; game: string, type: string  }> = [];
  worldWarHulkAntiHeroes: Array<{ name: string; game: string, type: string  }> = [];
  worldWarHulkLocations: Array<{ name: string; game: string, type: string  }> = [];

  multiversePledgeBonusHeroes: Array<{ name: string; game: string, type: string  }> = [];
  multiversePledgeBonusVillains: Array<{ name: string; game: string, type: string  }> = [];
  multiversePledgeBonusLocations: Array<{ name: string; game: string, type: string  }> = [];

  multiversePromosHeroes: Array<{ name: string; game: string, type: string  }> = [];
  multiversePromosAntiHeroes: Array<{ name: string; game: string, type: string  }> = [];
  multiversePromosVillains: Array<{ name: string; game: string, type: string  }> = [];
  multiversePromosLocations: Array<{ name: string; game: string, type: string  }> = [];

  selectedHeroes: Array<{ name: string; game: string, type: string  }> = [];
  selectedVillains: Array<{ name: string; game: string, type: string  }> = [];
  selectedLocations: Array<{ name: string; game: string, type: string  }> = [];
  selectedAntiHeroes: Array<{ name: string; game: string, type: string  }> = [];
  selectedPets: Array<{ name: string; game: string, type: string  }> = [];

  isAllSelected(items: Array<{ name: string; game: string, type: string  }>, selected: Array<{ name: string; game: string, type: string  }>): boolean {
    return items.length > 0 && items.every(item => selected.some(sel => sel.name === item.name));
  }

  toggleSelectAll(items: Array<{ name: string; game: string, type: string  }>, selected: Array<{ name: string; game: string, type: string  }>): void {
    if (this.isAllSelected(items, selected)) {
      items.forEach(item => {
        const index = selected.findIndex(sel => sel.name === item.name);
        if (index !== -1) selected.splice(index, 1);
      });
    } else {
      items.forEach(item => {
        if (!selected.some(sel => sel.name === item.name)) selected.push(item);
      });
    }
  }

  toggleSelection(item: { name: string; game: string, type: string  }, selected: Array<{ name: string; game: string, type: string  }>): void {
    const index = selected.findIndex(sel => sel.name === item.name);
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
            heroes: gameData.filter((c: any) => c.type === 1).map((item: any) => ({ name: item.name, game, type: "hero" })),
            villains: gameData.filter((c: any) => c.type === 2).map((item: any) => ({ name: item.name, game, type: "villain"})),
            locations: gameData.filter((c: any) => c.type === 3).map((item: any) => ({ name: item.name, game, type: "location" })),
            antiHeroes: gameData.filter((c: any) => c.type === 4).map((item: any) => ({ name: item.name, game, type: "anti-hero" })),
            pets: gameData.filter((c: any) => c.type === 5).map((item: any) => ({ name: item.name, game, type: "pet" }))
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
  isHeroSelected(hero: { name: string; game: string; type: string }): boolean {
    return this.selectedHeroes.some(h => h.name === hero.name);
  }

  isVillainSelected(villain: { name: string; game: string; type: string }): boolean {
    return this.selectedVillains.some(v => v.name === villain.name);
  }

  isLocationSelected(location: { name: string; game: string; type: string }): boolean {
    return this.selectedLocations.some(l => l.name === location.name);
  }

  isAntiHeroSelected(antiHero: { name: string; game: string; type: string }): boolean {
    return this.selectedAntiHeroes.some(a => a.name === antiHero.name);
  }

  isPetSelected(pet: { name: string; game: string; type: string }): boolean {
    return this.selectedPets.some(p => p.name === pet.name);
  }
}



