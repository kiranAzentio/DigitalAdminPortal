import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageNotFoundPage } from './page-not-found.page';
import { PageNotFoundRoutingModule } from './page-not-found.routing.module';
import { TranslateModule } from '@ngx-translate/core';    



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageNotFoundRoutingModule,  
    IonicModule,
    TranslateModule
  ],
  declarations: [PageNotFoundPage]
})
export class PageNotFoundModule {}
