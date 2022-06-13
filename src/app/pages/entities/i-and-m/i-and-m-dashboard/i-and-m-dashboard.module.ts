import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IAndMDashboardPageRoutingModule } from './i-and-m-dashboard-routing.module';

import { IAndMDashboardPage } from './i-and-m-dashboard.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { PrimengComponentsModule } from 'src/app/components/primeng-components/primeng-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IAndMDashboardPageRoutingModule,
    TranslateModule,
    SharedComponentsModule,
    PrimengComponentsModule,
  ],
  declarations: [IAndMDashboardPage]
})
export class IAndMDashboardPageModule {}
