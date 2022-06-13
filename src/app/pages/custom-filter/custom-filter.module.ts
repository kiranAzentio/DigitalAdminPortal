import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomFilterPageRoutingModule } from './custom-filter-routing.module';

import { CustomFilterPage } from './custom-filter.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from '../../components/shared-components.module';
import {TableModule} from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomFilterPageRoutingModule,
    SharedComponentsModule,
    TranslateModule,
    TableModule
  ],
  declarations: [CustomFilterPage]
})
export class CustomFilterPageModule {}
