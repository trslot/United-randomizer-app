import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Season1Component } from '../marvel-united/season1/season1.component';
import { Season2Component } from '../marvel-united/season2/season2.component';
import { Season3Component } from '../marvel-united/season3/season3.component';
import { Season1DcComponent } from '../dc-super-hero-united/season1-dc/season1-dc.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { addDoc, collection, getFirestore, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule, Season1Component, Season2Component, Season3Component, Season1DcComponent, MatTabsModule, MatButtonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  @ViewChild(Season1Component) season1Component!: Season1Component;
  @ViewChild(Season2Component) season2Component!: Season2Component;
  @ViewChild(Season3Component) season3Component!: Season3Component;

  async saveSelections() {
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user ? user.uid : 'anonymous';

      const combinedHeroes = [
        ...this.season1Component.selectedHeroes,
        ...this.season2Component.selectedHeroes,
        ...this.season3Component.selectedHeroes
      ];
  
      const combinedVillains = [
        ...this.season1Component.selectedVillains,
        ...this.season2Component.selectedVillains,
        ...this.season3Component.selectedVillains
      ];
  
      const combinedLocations = [
        ...this.season1Component.selectedLocations,
        ...this.season2Component.selectedLocations,
        ...this.season3Component.selectedLocations
      ];
  
      const combinedAntiHeroes = [
        ...this.season2Component.selectedAntiHeroes,
        ...this.season3Component.selectedAntiHeroes
      ];
  
      const combinedPets = [
        ...this.season3Component.selectedPets
      ];

      const userSelectionsRef = collection(db, 'userSelections');
      const q = query(userSelectionsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docToUpdate = querySnapshot.docs[0].ref;
        await updateDoc(docToUpdate, {
          timestamp: new Date().toISOString(),
          heroes: combinedHeroes,
          villains: combinedVillains,
          locations: combinedLocations,
          antiHeroes: combinedAntiHeroes,
          pets: combinedPets
        });
        console.log('Selections updated for user:', userId);
      } else {
        console.log('No existing document found for user:', userId);
        await addDoc(userSelectionsRef, {
          userId: userId,
          timestamp: new Date().toISOString(),
          heroes: combinedHeroes,
          villains: combinedVillains,
          locations: combinedLocations,
          antiHeroes: combinedAntiHeroes,
          pets: combinedPets
        });
        console.log('New document created for user:', userId);
      }

    } catch (error) {
      console.error('Error saving selections:', error);
    }
  }
  
}