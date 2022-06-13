import { Component, Output, EventEmitter, Input, OnChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgModel } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';


@Component({
  selector: 'digital-cs-registration-layout',
  templateUrl: 'registration-layout.page.html',
  styleUrls: ['registration-layout.page.scss'],
})
export class RegistrationLayoutPage implements OnChanges {
  @Input() data: any;

  @Output() onSubmit = new EventEmitter();
  @Output() onForgotPassword = new EventEmitter();
  @Output() onSkip = new EventEmitter();
  @Output() onFacebook = new EventEmitter();
  @Output() onTwitter = new EventEmitter();
  @Output() onGoogle = new EventEmitter();
  @Output() onPinterest = new EventEmitter();
  @ViewChild('username') username = NgModel;

  public isUsernameValid = true;
  public isPasswordValid = true;
  showResidentCountry:boolean = false;
  isStart:boolean = true;
  isIndividual:boolean = false;
  isEntity:boolean =false;
  public requiredValidation :string;
  bgImg : string ='assets/img/background/logo.svg'
  indiIcon: string ='contact'
  entityIcon:string ='contacts'
  maxDate = "2020-11-01"; 
  // item = {
  //   'username': '',
  //   'password': ''
  // };

  constructor(public translateService: TranslateService,private toastController:ToastController,private router: Router,public appConfigService:AppConfigService) { 
    this.translateService.get(['FORM_ERROR.REQUIRED_VAL']).subscribe((values) => {
      this.requiredValidation = values['FORM_ERROR.REQUIRED_VAL'];     
});


  }
  onChangeResident(event){
    
    if(event.selectedItem == 2){
      this.showResidentCountry = true;
    }
    
  }
  onEntity(){
this.isStart = false
this.isEntity =true;
this.isIndividual =false;
  }
  onIndividual(){
    this.isStart = false;
    this.isIndividual =true;
    this.isEntity =false;
  }
  ngOnChanges(changes: { [propKey: string]: any }) {
    this.data = changes['data'].currentValue;
  }
async onNextFunc(event){
  this.data.isPageOne = false;
}
  async onSubmitFunc(event){
    if (event) {
      event.stopPropagation();
    }
    if (this.validate(event)) {
      this.onSubmit.emit(this.data);
    }else{
      let displayError = this.requiredValidation;
      const toast = await this.toastController.create({
        message: displayError,
       duration: 3000,
       position: 'bottom',
       color:'danger'
     });
     toast.present();
    }
  }

  onForgotPasswordFunc(): void {
    if (event) {
      event.stopPropagation();
    }
    this.onForgotPassword.emit('');
    // if (this.validate()) {
    //   this.onRegister.emit(this.item);
    // }
  }

  onFacebookFunc(): void {
      this.onFacebook.emit(this.data);
  }

  onTwitterFunc(): void {
    if (event) {
      event.stopPropagation();
    }
      this.onTwitter.emit(this.data);
  }

  onGoogleFunc(): void {
    if (event) {
      event.stopPropagation();
    }
    this.onGoogle.emit(this.data);
  }

  onPinterestFunc(): void {
    if (event) {
      event.stopPropagation();
    }
    this.onPinterest.emit(this.data);
  }

  onSkipFunc(): void {
    if (event) {
      event.stopPropagation();
    }

    this.onSkip.emit(this.data);
  }

  validate(event): boolean {
    // console.log(this.username. = true);
    this.isUsernameValid = true;
    this.isPasswordValid = true;
    

    return this.isPasswordValid && this.isUsernameValid;
  }
  back(){
    if(this.isStart){
      this.router.navigate(['/login']);
    }else{
      if(this.isEntity){
        if(this.data.isPageOne){
          this.isStart =true;
        }else{
          this.data.isPageOne =true;
        }
      }else{
        if(this.data.isPageOne){
          this.isStart =true;
        }else{
          this.data.isPageOne =true;
        }
      }
    }
  }

}
