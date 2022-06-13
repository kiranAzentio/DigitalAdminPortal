import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InboxPageRoutingModule } from './inbox-routing.module';

import { InboxPage } from './inbox.page';
import { PrimengComponentsModule } from 'src/app/components/primeng-components/primeng-components.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InboxPageRoutingModule,
    TranslateModule,
    SharedComponentsModule,
    PrimengComponentsModule,
  ],
  declarations: [InboxPage]
})
export class InboxPageModule {}
