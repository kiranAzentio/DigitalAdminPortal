import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MenuPage } from './menu.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'tabs',
        loadChildren: '../tabs/tabs.module#TabsPageModule',
      },
      {
        path: 'entities',
        loadChildren: '../../entities/entities.module#EntitiesPageModule',        
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,    
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
