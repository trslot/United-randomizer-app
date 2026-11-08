import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../../Environments/Environment';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { getFirestore, collection } from 'firebase/firestore';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@Component({
  standalone: true,
  selector: 'app-season1-dc',
  imports: [MatCheckboxModule, MatButtonModule, MatDividerModule, MatExpansionModule, MatListModule],
  templateUrl: './season1-dc.component.html',
  styleUrl: './season1-dc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Season1DcComponent implements OnInit {

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

  isAllSelected(items: Array<{ name: string; game: string, type: string }>, selected: Array<{ name: string; game: string, type: string }>): boolean {
    return items.length > 0 && items.every(item => selected.some(sel => sel.name === item.name));
  }

  toggleSelectAll(items: Array<{ name: string; game: string, type: string }>, selected: Array<{ name: string; game: string, type: string }>): void {
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

  toggleSelection(item: { name: string; game: string, type: string }, selected: Array<{ name: string; game: string, type: string }>): void {
    const index = selected.findIndex(sel => sel.name === item.name);
    if (index !== -1) {
      selected.splice(index, 1);
    } else {
      selected.push(item);
    }
  }

  dcSuperHeroesHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  dcSuperHeroesVillains: Array<{ name: string; game: string, type: string, season: number }> = [];
  dcSuperHeroesLocations: Array<{ name: string; game: string, type: string, season: number }> = [];

  arkhamAsylumBreakoutHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  arkhamAsylumBreakoutVillains: Array<{ name: string; game: string, type: string, season: number }> = [];
  arkhamAsylumBreakoutLocations: Array<{ name: string; game: string, type: string, season: number }> = [];

  gothamCityHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  gothamCityVillains: Array<{ name: string; game: string, type: string, season: number }> = [];
  gothamCityLocations: Array<{ name: string; game: string, type: string, season: number }> = [];
  gothamCityDualModes: Array<{ name: string; game: string, type: string, season: number }> = [];
  gothamCitySupports: Array<{ name: string; game: string, type: string, season: number }> = [];

  greenLanternCorpsHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];

  jsaHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  jsaDualModes: Array<{ name: string; game: string, type: string, season: number }> = [];

  metropolisHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  metropolisVillains: Array<{ name: string; game: string, type: string, season: number }> = [];
  metropolisLocations: Array<{ name: string; game: string, type: string, season: number }> = [];
  metropolisSupports: Array<{ name: string; game: string, type: string, season: number }> = [];

  sidekicks: Array<{ name: string; game: string, type: string, season: number }> = [];

  suicideSquadDualModes: Array<{ name: string; game: string, type: string, season: number }> = [];

  teenTitansHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  teenTitansVillains: Array<{ name: string; game: string, type: string, season: number }> = [];

  warOfLightHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  warOfLightDualModes: Array<{ name: string; game: string, type: string, season: number }> = [];
  warOfLightVillains: Array<{ name: string; game: string, type: string, season: number }> = [];

  pledgeBonusHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  pledgeBonusVillains: Array<{ name: string; game: string, type: string, season: number }> = [];
  pledgeBonusSupports: Array<{ name: string; game: string, type: string, season: number }> = [];

  stretchGoalsHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  stretchGoalsDualModes: Array<{ name: string; game: string, type: string, season: number }> = [];
  stretchGoalsVillains: Array<{ name: string; game: string, type: string, season: number }> = [];
  stretchGoalsLocations: Array<{ name: string; game: string, type: string, season: number }> = [];

  dcSuperHeroesHushHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  dcSuperHeroesHushDualModes: Array<{ name: string; game: string, type: string, season: number }> = [];
  dcSuperHeroesHushVillains: Array<{ name: string; game: string, type: string, season: number }> = [];
  dcSuperHeroesHushLocations: Array<{ name: string; game: string, type: string, season: number }> = [];

  selectedHeroes: Array<{ name: string; game: string, type: string, season: number }> = [];
  selectedVillains: Array<{ name: string; game: string, type: string, season: number }> = [];
  selectedLocations: Array<{ name: string; game: string, type: string, season: number }> = [];
  selectedDualModes: Array<{ name: string; game: string, type: string, season: number }> = [];
  selectedPets: Array<{ name: string; game: string, type: string, season: number }> = [];

  async ngOnInit(): Promise<void> {
    const app = initializeApp(this.config);
    const db = getDatabase();
    const auth = getAuth();

    const gamesRef = ref(db, '0');

    get(gamesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const dbData = snapshot.val();

        // Helper function to filter and map the data
        function getFilteredNames(data: any[], game: string) {
          const gameData = data.filter((x: any) => x.season === 4 && x.game === game);

          return {
            heroes: gameData.filter((c: any) => c.type === 1).map((item: any) => ({ name: item.name, game, type: "hero", season: item.season })),
            villains: gameData.filter((c: any) => c.type === 2).map((item: any) => ({ name: item.name, game, type: "villain", season: item.season })),
            locations: gameData.filter((c: any) => c.type === 3).map((item: any) => ({ name: item.name, game, type: "location", season: item.season })),
            dualMode: gameData.filter((c: any) => c.type === 6).map((item: any) => ({ name: item.name, game, type: "dualMode", season: item.season })),
            pets: gameData.filter((c: any) => c.type === 5).map((item: any) => ({ name: item.name, game, type: "pet", season: item.season })),
            support: gameData.filter((c: any) => c.type === 7).map((item: any) => ({ name: item.name, game, type: "support", season: item.season })),
            sidekick: gameData.filter((c: any) => c.type === 8).map((item: any) => ({ name: item.name, game, type: "sidekick", season: item.season })),
          };
        }

        // DC Super Heroes
        const dcSuperHeroesData = getFilteredNames(dbData, 'DC Super Heroes United');
        this.dcSuperHeroesHeroes = dcSuperHeroesData.heroes;
        this.dcSuperHeroesVillains = dcSuperHeroesData.villains;

        // Arkham Asylum Breakout
        const arkhamAsylumBreakoutData = getFilteredNames(dbData, 'Arkham Asylum Breakout');
        this.arkhamAsylumBreakoutHeroes = arkhamAsylumBreakoutData.heroes;
        this.arkhamAsylumBreakoutVillains = arkhamAsylumBreakoutData.villains;

        // Gotham City
        const gothamCityData = getFilteredNames(dbData, 'Gotham City');
        this.gothamCityHeroes = gothamCityData.heroes;
        this.gothamCityVillains = gothamCityData.villains;
        this.gothamCityDualModes = gothamCityData.dualMode;
        this.gothamCitySupports = gothamCityData.support;

        // Green Lantern Corps
        const greenLanternCorpsData = getFilteredNames(dbData, "Green Lantern Corps");
        this.greenLanternCorpsHeroes = greenLanternCorpsData.heroes;

        // Justice Society of America
        const jsaData = getFilteredNames(dbData, "Justice Society of America");
        this.jsaHeroes = jsaData.heroes;
        this.jsaDualModes = jsaData.dualMode;

        // Metropolis
        const metropolisData = getFilteredNames(dbData, "Metropolis");
        this.metropolisHeroes = metropolisData.heroes;
        this.metropolisVillains = metropolisData.villains;
        this.metropolisLocations = metropolisData.locations;
        this.metropolisSupports = metropolisData.support;

        // Sidekicks
        const sidekicksData = getFilteredNames(dbData, "Sidekicks");
        this.sidekicks = sidekicksData.sidekick;

        // Suicide Squad
        const suicideSquadData = getFilteredNames(dbData, "Suicide Squad");
        this.suicideSquadDualModes = suicideSquadData.dualMode;

        // Teen Titans
        const teenTitansData = getFilteredNames(dbData, "Teen Titans");
        this.teenTitansHeroes = teenTitansData.heroes;
        this.teenTitansVillains = teenTitansData.villains;

        // War of Light
        const warOfLightData = getFilteredNames(dbData, "War of Light");
        this.warOfLightHeroes = warOfLightData.heroes;
        this.warOfLightDualModes = warOfLightData.dualMode;
        this.warOfLightVillains = warOfLightData.villains;

        // Pledge Bonus
        const pledgeBonusData = getFilteredNames(dbData, "Pledge Bonus");
        this.pledgeBonusHeroes = pledgeBonusData.heroes;
        this.pledgeBonusVillains = pledgeBonusData.villains;
        this.pledgeBonusSupports = pledgeBonusData.support;

        // Stretch Goals
        const stretchGoalsData = getFilteredNames(dbData, "Stretch Goals");
        this.stretchGoalsHeroes = stretchGoalsData.heroes;
        this.stretchGoalsDualModes = stretchGoalsData.dualMode;
        this.stretchGoalsVillains = stretchGoalsData.villains;
        this.stretchGoalsLocations = stretchGoalsData.locations;

        // DC Super Heroes Hush
        const dcSuperHeroesHushData = getFilteredNames(dbData, 'DC United Super Heroes: Batman Hush');
        this.dcSuperHeroesHushHeroes = dcSuperHeroesHushData.heroes;
        this.dcSuperHeroesHushDualModes = dcSuperHeroesHushData.dualMode;
        this.dcSuperHeroesHushVillains = dcSuperHeroesHushData.villains;
        this.dcSuperHeroesHushLocations = dcSuperHeroesHushData.locations;
      }
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
              const docData = querySnapshot.docs[0].data();
              this.selectedHeroes = docData['heroes'] || [];
              this.selectedVillains = docData['villains'] || [];
              this.selectedLocations = docData['locations'] || [];
              this.selectedDualModes = docData['dualModes'] || [];
              this.selectedPets = docData['pets'] || [];
            } else {
            }
          }).catch((error) => {
            console.error('Error fetching user selections:', error);
          });
          // ...


        } else {
          // User is signed out
          // Set everything to selected
          this.selectedHeroes = [
            ...this.dcSuperHeroesHeroes,
            ...this.arkhamAsylumBreakoutHeroes,
            ...this.gothamCityHeroes,
            ...this.greenLanternCorpsHeroes,
            ...this.jsaHeroes,
            ...this.metropolisHeroes,
            ...this.sidekicks,
            ...this.teenTitansHeroes,
            ...this.warOfLightHeroes,
            ...this.pledgeBonusHeroes,
            ...this.stretchGoalsHeroes,
            ...this.dcSuperHeroesHushHeroes
          ];
          this.selectedVillains = [
            ...this.dcSuperHeroesVillains,
            ...this.arkhamAsylumBreakoutVillains,
            ...this.gothamCityVillains,
            ...this.metropolisVillains,
            ...this.teenTitansVillains,
            ...this.warOfLightVillains,
            ...this.pledgeBonusVillains,
            ...this.stretchGoalsVillains,
            ...this.dcSuperHeroesHushVillains
          ];
          this.selectedLocations = [
            ...this.dcSuperHeroesLocations,
            ...this.arkhamAsylumBreakoutLocations,
            ...this.gothamCityLocations,
            ...this.metropolisLocations,
            ...this.stretchGoalsLocations,
            ...this.dcSuperHeroesHushLocations
          ];
          this.selectedDualModes = [
            ...this.gothamCityDualModes,
            ...this.jsaDualModes,
            ...this.suicideSquadDualModes,
            ...this.warOfLightDualModes,
            ...this.stretchGoalsDualModes,
            ...this.dcSuperHeroesHushDualModes
          ];
          this.selectedPets = [
            ...this.gothamCitySupports,
            ...this.metropolisSupports,
            ...this.pledgeBonusSupports,
            ...this.sidekicks
          ];
        }
      });

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

  isDualModeSelected(dualMode: { name: string; game: string; type: string }): boolean {
    return this.selectedDualModes.some(a => a.name === dualMode.name);
  }

  isPetSelected(pet: { name: string; game: string; type: string }): boolean {
    return this.selectedPets.some(p => p.name === pet.name);
  }
}
