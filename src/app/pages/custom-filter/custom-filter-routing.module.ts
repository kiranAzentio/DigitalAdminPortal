import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomFilterPage } from './custom-filter.page';

const routes: Routes = [
  {
    path: '',
    component: CustomFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomFilterPageRoutingModule {}
