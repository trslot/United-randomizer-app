import { MatTabGroup } from '@angular/material/tabs';
import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Season1Component } from '../marvel-united/season1/season1.component';
import { Season2Component } from '../marvel-united/season2/season2.component';
import { Season3Component } from '../marvel-united/season3/season3.component';
import { Season1DcComponent } from '../dc-super-hero-united/season1-dc/season1-dc.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatButtonModule, Season1Component, Season2Component, Season3Component, Season1DcComponent],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  selectedIndex: number = 0;
  private startX: number = 0;
  private currentX: number = 0;
  private swipeThreshold: number = 50; // Minimum pixels to trigger swipe
  @ViewChild(Season1Component) season1Component!: Season1Component;
  @ViewChild(Season2Component) season2Component!: Season2Component;
  @ViewChild(Season3Component) season3Component!: Season3Component;
  @ViewChild(Season1DcComponent) seasonDCComponent!: Season1DcComponent;
  saveMessage = '';
  saveSuccess = false;

  async saveSelections() {
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;

      // ---------- Combine all selections ----------
      const combinedHeroes = [
        ...this.season1Component.selectedHeroes,
        ...this.season2Component.selectedHeroes,
        ...this.season3Component.selectedHeroes,
        ...this.seasonDCComponent.selectedHeroes
      ];

      const combinedVillains = [
        ...this.season1Component.selectedVillains,
        ...this.season2Component.selectedVillains,
        ...this.season3Component.selectedVillains,
        ...this.seasonDCComponent.selectedVillains
      ];

      const combinedLocations = [
        ...this.season1Component.selectedLocations,
        ...this.season2Component.selectedLocations,
        ...this.season3Component.selectedLocations,
        ...this.seasonDCComponent.selectedLocations
      ];

      const combinedAntiHeroes = [
        ...this.season2Component.selectedAntiHeroes,
        ...this.season3Component.selectedAntiHeroes,
        ...this.seasonDCComponent.selectedDualModes
      ];

      const combinedPets = [
        ...this.season3Component.selectedPets,
        ...this.seasonDCComponent.selectedPets
      ];

      // ---------- De-duplication helper ----------
      const uniqueByKey = <T extends { name: string; game: string; type: string }>(arr: T[]) =>
        Array.from(
          new Map(arr.map(item => [`${item.name}|${item.game}|${item.type}`, item])).values()
        );

      const payload = {
        userId,
        timestamp: new Date().toISOString(),
        heroes: uniqueByKey(combinedHeroes),
        villains: uniqueByKey(combinedVillains),
        locations: uniqueByKey(combinedLocations),
        antiHeroes: uniqueByKey(combinedAntiHeroes),
        pets: uniqueByKey(combinedPets)
      };

      // ---------- Save (overwrite) ----------
      const userDocRef = doc(db, 'userSelections', userId);
      await setDoc(userDocRef, payload);

      this.saveSuccess = true;
      this.saveMessage = 'Game selections saved successfully.';

    } catch (error) {
      console.error('Error saving game selections:', error);

      this.saveSuccess = false;
      this.saveMessage = 'Unable to save game selections. Please try again.';
    }
  }


  // Swipe navigation methods
  onSwipeStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
    this.currentX = this.startX;
  }

  onSwipeMove(event: TouchEvent): void {
    this.currentX = event.touches[0].clientX;
  }

  onSwipeEnd(): void {
    const deltaX = this.currentX - this.startX;

    if (Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX < 0) {
        // Swiped left
        this.swipeRight();
      } else {
        // Swiped right
        this.swipeLeft();
      }
    }
    // Reset positions
    this.startX = 0;
    this.currentX = 0;
  }

  swipeLeft(): void {
    const numTabs = this.tabGroup?._tabs?.length ?? 0;
    if (numTabs > 0) {
      this.selectedIndex = (this.selectedIndex === 0) ? (numTabs - 1) : (this.selectedIndex - 1);
      this.tabGroup.selectedIndex = this.selectedIndex;
    }
  }

  swipeRight(): void {
    const numTabs = this.tabGroup?._tabs?.length ?? 0;
    if (numTabs > 0) {
      this.selectedIndex = (this.selectedIndex === numTabs - 1) ? 0 : (this.selectedIndex + 1);
      this.tabGroup.selectedIndex = this.selectedIndex;
    }
  }
}