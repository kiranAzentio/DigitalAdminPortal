import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'custom-filter',
    loadChildren: () => import('../../custom-filter/custom-filter.module').then( m => m.CustomFilterPageModule)
  },
  {
    path: '',
    component: TabsPage,
    children: [
      { 
        path: 'entities',
        loadChildren: '../../entities/entities.module#EntitiesPageModule',
      },
      { path: 'dashboard',
       loadChildren: '../dashboard/dashboard.module#DashboardPageModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
