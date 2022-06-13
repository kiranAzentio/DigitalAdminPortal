import { Component, Output, EventEmitter, Input, OnChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgModel, NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';

@Component({
  selector: 'digital-cs-login-layout-1',
  templateUrl: 'login-layout-1.page.html',
  styleUrls: ['login-layout-1.page.scss'],
})
export class LoginLayout1Page implements OnChanges {
  @ViewChild('one') one;

  @Input() data: any;
  @Output() onLogin = new EventEmitter();
  logo1 = 'assets/img/products/kastle/company.jpg';

  public isUsernameInvalid = true;
  public isPasswordInvalid = true;
  public isFormSubmitted = false;

  showPassword:boolean = false;
  inputType :string = 'password';
  
  constructor(
    public translateService: TranslateService,
    public appConfigService:AppConfigService
  ) { 
    // setTimeout(() => {
    //   this.one.setFocus();
    // }, 1500);
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    this.data = changes['data'].currentValue;
  } 

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.inputType = this.showPassword ? 'text' : 'password';
  }

  async onLoginFunc(event){
    // ctrl.reset()
    // ctrl.setValue(null);
    // this.data.password=null
    if (event) {
      event.stopPropagation();
    }
    this.isFormSubmitted = true;
    
    if(!this.validate()){
      this.onLogin.emit(this.data)
    }
  }

 

  validate(): boolean {
    this.data.username == null || this.data.username == "" ? this.isUsernameInvalid = true : this.isUsernameInvalid = false;
    this.data.password == null || this.data.password == "" ? this.isPasswordInvalid = true : this.isPasswordInvalid = false;
    if(this.isPasswordInvalid || this.isUsernameInvalid){
      return true;
    }else{
      return false;
    }
  }

  usernameInputCheck(data){
    // if (data.target.value.length > 0) {
    //   this.isUsernameInvalid = false;
    //   this.data.username = data.target.value;
    // } else {
    //   this.data.username = '';
    //   this.isUsernameInvalid = true
    // }
  }
  passwordInputCheck(data){
    // if (data.target.value.length > 0) {
    //   this.isPasswordInvalid = false;
    //   this.data.password = data.target.value;
    // } else {
    //   this.data.password = '';
    //   this.isPasswordInvalid = true
    // }
  }
 
}
