import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EntitiesPage } from './entities.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'kastle',
    pathMatch: 'full',
     // data: {
    //   authorities: ['ROLE_USER'],
    // },
    // canActivate: [UserRouteAccessService],
  },
  { 
    path: 'i-and-m',
    loadChildren: './i-and-m/i-and-m.page.module#IAndMPageModule',
  },
  {
    path:'kastle',
    loadChildren: './kastle/kastle.page.module#KastlePageModule',
  }
    
  
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [EntitiesPage],
})
export class EntitiesPageModule {}
