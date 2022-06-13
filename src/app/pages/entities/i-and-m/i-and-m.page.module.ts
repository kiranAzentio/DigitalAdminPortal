import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengComponentsModule } from 'src/app/components/primeng-components/primeng-components.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
// import { MessageModalPage } from './create-application/popup-screen/message-modal.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
     // data: {
    //   authorities: ['ROLE_USER'],
    // },
    // canActivate: [UserRouteAccessService],
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./i-and-m-dashboard/i-and-m-dashboard.module').then( m => m.IAndMDashboardPageModule)
  //  data: {
    //   authorities: ['ROLE_USER'],
    // },
    // canActivate: [UserRouteAccessService],
  },
  {
    path: 'inbox',
    loadChildren: () => import('./inbox/inbox.module').then( m => m.InboxPageModule),
     //  data: {
    //   authorities: ['ROLE_USER'],
    // },
    // canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [
    // MessageModalPage
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
export class IAndMPageModule {}
