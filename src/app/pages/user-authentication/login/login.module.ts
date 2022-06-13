import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  }
];

@NgModule({
  imports: [CommonModule, FormsModule,SharedComponentsModule, IonicModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [LoginPage],
  providers:[
    
  ]
})
export class LoginPageModule {}
