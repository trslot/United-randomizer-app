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
  selector: 'app-season1-dc',
  standalone: true,
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

  dcSuperHeroesHeroes: Array<string> = [];
  dcSuperHeroesVillains: Array<string> = [];
  dcSuperHeroesLocations: Array<string> = [];

  arkhamAsylumBreakoutHeroes: Array<string> = [];
  arkhamAsylumBreakoutVillains: Array<string> = [];
  arkhamAsylumBreakoutLocations: Array<string> = [];

  gothamCityHeroes: Array<string> = [];
  gothamCityVillains: Array<string> = [];
  gothamCityLocations: Array<string> = [];
  gothamCityDualModes: Array<string> = [];
  gothamCitySupports: Array<string> = [];

  greenLaternCorpsHeroes: Array<string> = [];

  jsaHeroes: Array<string> = [];
  jsaDualModes: Array<string> = [];

  metropolisHeroes: Array<string> = [];
  metropolisVillains: Array<string> = [];
  metropolisLocations: Array<string> = [];
  metropolisSupports: Array<string> = [];

  sidekicks: Array<string> = [];

  suicideSquadDualModes: Array<string> = [];

  teenTitansHeroes: Array<string> = [];
  teenTitansVillains: Array<string> = [];

  warOfLightHeroes: Array<string> = [];
  warOfLightDualModes: Array<string> = [];
  warOfLightVillains: Array<string> = [];

  pledgeBonusHeroes: Array<string> = [];
  pledgeBonusVillains: Array<string> = [];
  pledgeBonusSupports: Array<string> = [];

  stretchGoalsHeroes: Array<string> = [];
  stretchGoalsDualModes: Array<string> = [];
  stretchGoalsVillains: Array<string> = [];
  stretchGoalsLocations: Array<string> = [];


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
            heroes: gameData.filter((c: any) => c.type === 1).map((name: any) => name.name),
            villains: gameData.filter((c: any) => c.type === 2).map((name: any) => name.name),
            locations: gameData.filter((c: any) => c.type === 3).map((name: any) => name.name),
            dualMode: gameData.filter((c: any) => c.type === 6).map((name: any) => name.name),
            support: gameData.filter((c: any) => c.type === 7).map((name: any) => name.name),
            sidekick: gameData.filter((c: any) => c.type === 8).map((name: any) => name.name)
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