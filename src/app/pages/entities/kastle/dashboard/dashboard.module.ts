import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    DashboardPageRoutingModule,
    SharedComponentsModule,
    TableModule
  ],
  declarations: [DashboardPage],
  providers:[CurrencyPipe, DecimalPipe,] //added 08-20-2021
})
export class DashboardPageModule {}
