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

  dcSuperHeroesHeroes: Array<{ name: string; game: string }> = [];
  dcSuperHeroesVillains: Array<{ name: string; game: string }> = [];
  dcSuperHeroesLocations: Array<{ name: string; game: string }> = [];

  arkhamAsylumBreakoutHeroes: Array<{ name: string; game: string }> = [];
  arkhamAsylumBreakoutVillains: Array<{ name: string; game: string }> = [];
  arkhamAsylumBreakoutLocations: Array<{ name: string; game: string }> = [];

  gothamCityHeroes: Array<{ name: string; game: string }> = [];
  gothamCityVillains: Array<{ name: string; game: string }> = [];
  gothamCityLocations: Array<{ name: string; game: string }> = [];
  gothamCityDualModes: Array<{ name: string; game: string }> = [];
  gothamCitySupports: Array<{ name: string; game: string }> = [];

  greenLaternCorpsHeroes: Array<{ name: string; game: string }> = [];

  jsaHeroes: Array<{ name: string; game: string }> = [];
  jsaDualModes: Array<{ name: string; game: string }> = [];

  metropolisHeroes: Array<{ name: string; game: string }> = [];
  metropolisVillains: Array<{ name: string; game: string }> = [];
  metropolisLocations: Array<{ name: string; game: string }> = [];
  metropolisSupports: Array<{ name: string; game: string }> = [];

  sidekicks: Array<{ name: string; game: string }> = [];

  suicideSquadDualModes: Array<{ name: string; game: string }> = [];

  teenTitansHeroes: Array<{ name: string; game: string }> = [];
  teenTitansVillains: Array<{ name: string; game: string }> = [];

  warOfLightHeroes: Array<{ name: string; game: string }> = [];
  warOfLightDualModes: Array<{ name: string; game: string }> = [];
  warOfLightVillains: Array<{ name: string; game: string }> = [];

  pledgeBonusHeroes: Array<{ name: string; game: string }> = [];
  pledgeBonusVillains: Array<{ name: string; game: string }> = [];
  pledgeBonusSupports: Array<{ name: string; game: string }> = [];

  stretchGoalsHeroes: Array<{ name: string; game: string }> = [];
  stretchGoalsDualModes: Array<{ name: string; game: string }> = [];
  stretchGoalsVillains: Array<{ name: string; game: string }> = [];
  stretchGoalsLocations: Array<{ name: string; game: string }> = [];


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
            heroes: gameData.filter((c: any) => c.type === 1).map((item: any) => ({ name: item.name, game })),
            villains: gameData.filter((c: any) => c.type === 2).map((item: any) => ({ name: item.name, game })),
            locations: gameData.filter((c: any) => c.type === 3).map((item: any) => ({ name: item.name, game })),
            dualMode: gameData.filter((c: any) => c.type === 6).map((item: any) => ({ name: item.name, game })),
            support: gameData.filter((c: any) => c.type === 7).map((item: any) => ({ name: item.name, game })),
            sidekick: gameData.filter((c: any) => c.type === 8).map((item: any) => ({ name: item.name, game }))
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
      }
    });
  }
}