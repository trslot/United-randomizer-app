import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../../Environments/Environment';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-season1-dc',
  imports: [MatCheckboxModule, MatButtonModule, MatDividerModule, MatExpansionModule, MatListModule, MatLabel, MatIconModule],
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

  dcSuperHeroesHeroes: Array<{ name: string; game: string, type: string }> = [];
  dcSuperHeroesVillains: Array<{ name: string; game: string, type: string }> = [];
  dcSuperHeroesLocations: Array<{ name: string; game: string, type: string }> = [];

  arkhamAsylumBreakoutHeroes: Array<{ name: string; game: string, type: string }> = [];
  arkhamAsylumBreakoutVillains: Array<{ name: string; game: string, type: string }> = [];
  arkhamAsylumBreakoutLocations: Array<{ name: string; game: string, type: string }> = [];

  gothamCityHeroes: Array<{ name: string; game: string, type: string }> = [];
  gothamCityVillains: Array<{ name: string; game: string, type: string }> = [];
  gothamCityLocations: Array<{ name: string; game: string, type: string }> = [];
  gothamCityDualModes: Array<{ name: string; game: string, type: string }> = [];
  gothamCitySupports: Array<{ name: string; game: string, type: string }> = [];

  greenLaternCorpsHeroes: Array<{ name: string; game: string, type: string }> = [];

  jsaHeroes: Array<{ name: string; game: string, type: string }> = [];
  jsaDualModes: Array<{ name: string; game: string, type: string }> = [];

  metropolisHeroes: Array<{ name: string; game: string, type: string }> = [];
  metropolisVillains: Array<{ name: string; game: string, type: string }> = [];
  metropolisLocations: Array<{ name: string; game: string, type: string }> = [];
  metropolisSupports: Array<{ name: string; game: string, type: string }> = [];

  sidekicks: Array<{ name: string; game: string, type: string }> = [];

  suicideSquadDualModes: Array<{ name: string; game: string, type: string }> = [];

  teenTitansHeroes: Array<{ name: string; game: string, type: string }> = [];
  teenTitansVillains: Array<{ name: string; game: string, type: string }> = [];

  warOfLightHeroes: Array<{ name: string; game: string, type: string }> = [];
  warOfLightDualModes: Array<{ name: string; game: string, type: string }> = [];
  warOfLightVillains: Array<{ name: string; game: string, type: string }> = [];

  pledgeBonusHeroes: Array<{ name: string; game: string, type: string }> = [];
  pledgeBonusVillains: Array<{ name: string; game: string, type: string }> = [];
  pledgeBonusSupports: Array<{ name: string; game: string, type: string }> = [];

  stretchGoalsHeroes: Array<{ name: string; game: string, type: string }> = [];
  stretchGoalsDualModes: Array<{ name: string; game: string, type: string }> = [];
  stretchGoalsVillains: Array<{ name: string; game: string, type: string }> = [];
  stretchGoalsLocations: Array<{ name: string; game: string, type: string }> = [];

  dcSuperHeroesHushHeroes: Array<{ name: string; game: string, type: string }> = [];
  dcSuperHeroesHushDualModes: Array<{ name: string; game: string, type: string }> = [];
  dcSuperHeroesHushVillains: Array<{ name: string; game: string, type: string }> = [];
  dcSuperHeroesHushLocations: Array<{ name: string; game: string, type: string }> = [];

  selectedHeroes: Array<{ name: string; game: string, type: string }> = [];
  selectedVillains: Array<{ name: string; game: string, type: string }> = [];
  selectedLocations: Array<{ name: string; game: string, type: string }> = [];
  selectedDualModes: Array<{ name: string; game: string, type: string }> = [];
  selectedPets: Array<{ name: string; game: string, type: string }> = [];

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

  async ngOnInit(): Promise<void> {
    this.selectedHeroes = [];
    this.selectedVillains = [];
    this.selectedLocations = [];
    this.selectedDualModes = [];
    this.selectedPets = [];

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
            heroes: gameData.filter((c: any) => c.type === 1).map((item: any) => ({ name: item.name, game, type: "hero" })),
            villains: gameData.filter((c: any) => c.type === 2).map((item: any) => ({ name: item.name, game, type: "villain"})),
            locations: gameData.filter((c: any) => c.type === 3).map((item: any) => ({ name: item.name, game, type: "location" })),
            dualMode: gameData.filter((c: any) => c.type === 6).map((item: any) => ({ name: item.name, game, type: "dualMode" })),
            pets: gameData.filter((c: any) => c.type === 5).map((item: any) => ({ name: item.name, game, type: "pet" })),
            support: gameData.filter((c: any) => c.type === 5).map((item: any) => ({ name: item.name, game, type: "support" })),
            sidekick: gameData.filter((c: any) => c.type === 5).map((item: any) => ({ name: item.name, game, type: "sidekick" })),
          };
        }

        // DC Super Heroes
        const dcSuperHeroesData = getFilteredNames(dbData, 'DC Super Heroes');
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
        this.greenLaternCorpsHeroes = greenLanternCorpsData.heroes;

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
        const dcSuperHeroesHushData = getFilteredNames(dbData, 'Hush');
        this.dcSuperHeroesHushHeroes = dcSuperHeroesHushData.heroes;
        this.dcSuperHeroesHushDualModes = dcSuperHeroesHushData.dualMode;
        this.dcSuperHeroesHushVillains = dcSuperHeroesHushData.villains;
        this.dcSuperHeroesHushLocations = dcSuperHeroesHushData.locations;
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

  isDualModeSelected(dualMode: { name: string; game: string; type: string }): boolean {
    return this.selectedDualModes.some(a => a.name === dualMode.name);
  }

  isPetSelected(pet: { name: string; game: string; type: string }): boolean {
    return this.selectedPets.some(p => p.name === pet.name);
  }
}