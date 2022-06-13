import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengComponentsModule } from 'src/app/components/primeng-components/primeng-components.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
];


@NgModule({
  declarations: [
],
imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    SharedComponentsModule,
    PrimengComponentsModule,
    RouterModule.forChild(routes)
]
})
export class KastlePageModule {}
