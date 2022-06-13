import { Component, Output,OnInit, EventEmitter, ViewChild,SimpleChanges,Input, OnChanges, AfterViewInit,forwardRef, ChangeDetectorRef } from '@angular/core';
import { IonInput, Platform, NavController, ToastController } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { CustomCurrencyPipe } from '../pipes/CustomCurrencyPipe';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/services/shared/login/login.service';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { UserService } from 'src/app/services/shared/user/user.service';
declare var SMSReceive: any;
@Component({
  selector: 'digital-app-mpin-screen-layout',
  templateUrl: './mpin-screen-layout.component.html',
  styleUrls: ['./mpin-screen-layout.component.scss'],
  
})
export class MpinScreenLayoutComponent implements OnInit {
  @ViewChild('two') two;
  @ViewChild('one') one;
  @ViewChild('three') three;
  @ViewChild('four') four;
  @ViewChild('five') five;
  @ViewChild('six') six;
  @Input() data: any;

  @Output() onValidate = new EventEmitter();
  @Output() onResend = new EventEmitter();
  time: BehaviorSubject<string> = new BehaviorSubject('00:00');
  timer: number;
  interval;
  // data: any;
  account: any = {};
  isDisabled: Boolean;
  isHidden: Boolean;
  hideUser: Boolean = false;
  bgImg: string = 'assets/img/background/logo.svg'
  registrationData: any;
  isBenificiary:boolean = false

  sms={
    address: "CP-SENOTP",
    body: "Dear Customer, 1234 is OTP for registration at Kastle Digital application. OTPSs are secret and do not disclose to anyone. ",
    date: 1602658760732,
    date_sent: 1602658759000,
    service_center: "+911725699997"    
  };

  

  otpError: string;
  otpSuccess: string;
  otpRequired: string;
  otpNomatchError: string;
  otpResend: string;
  otpExpired: string;
  error: string;
  

  constructor(private route: ActivatedRoute, private router: Router, private navController: NavController,
    public translateService: TranslateService, private userService: UserService, public toastController: ToastController,
    public loginService: LoginService,
    public appConfigService: AppConfigService, private platform: Platform,
  ) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.registrationData = this.router.getCurrentNavigation().extras.state.user;
        this.isBenificiary = this.registrationData.isBenificiary ? this.registrationData.isBenificiary : false;
      }
    });
    this.translateService.get(['OTP_PAGE.OTP_SUCCESS', 'OTP_PAGE.OTP_FAILED', 'OTP_PAGE.OTP_EXPIRED', 'INTERNAL_SERVER_ERROR', 'OTP_PAGE.OTP_VARIFIED', 'OTP_PAGE.OTP_REQUIRED', 'OTP_PAGE.OTP_ERROR']).subscribe((values) => {
      this.otpResend = values['OTP_PAGE.OTP_SUCCESS'];
      this.otpError = values['OTP_PAGE.OTP_FAILED'];
      this.otpExpired = values['OTP_PAGE.OTP_EXPIRED'];
      this.otpNomatchError = values['OTP_PAGE.OTP_ERROR'];
      this.otpSuccess = values['OTP_PAGE.OTP_VARIFIED'];
      this.otpRequired = values['OTP_PAGE.OTP_REQUIRED'];
      this.error = values.INTERNAL_SERVER_ERROR;
    });
  }

  ngOnInit() {
    // this.start();
    this.startTimer(2);  
    setTimeout(() => {
      this.one.setFocus();
    }, 200);
    
  }
  ionViewLoaded() {
    // console.log(this.one);
    // setTimeout(() => {
    //   this.one.setFocus();
    // },200)
   
  }
  ionViewWillEnter() {
    // this.appConfigService.assignShowTitleImage();
    // this.item = {
    //   'otp': '',
    //   'userid': '',
    //   'username': '',
    //   'displayName':'',
    //   'mobile': '',
    //   'password': '',
    //   'first': '',
    //   'second': '',
    //   'third': '',
    //   'fourth': '',
    //   'fifth':'',
    //   'sixth':'',
    //   'isRegister': '',
    //   'mpin':''

    // };
    
    let plt = this.platform.platforms();
   
    console.log("platform---->"+plt);
    let mobileweb = plt.find(x=>x == 'mobileweb');
    let ios = plt.find(x=>x == 'ios');
    let android = plt.find(x=>x == 'android');
   console.log("platformmmm --- >"+mobileweb+ios+android);
  //  this.start();
    if(mobileweb == undefined && ios == undefined && android =='android'){
      // this.start();
    }
    
  }
  start() {
    SMSReceive.startWatch(
      () => {
        console.log('watch started');
        document.addEventListener('onSMSArrive', (e: any) => {
          console.log('onSMSArrive()');
          var IncomingSMS = e.data;
          console.log("Incoming SMS"+IncomingSMS);
          this.processSMS(IncomingSMS);
         
          console.log(JSON.stringify(IncomingSMS));
        });
      },
      () => { console.log('watch start failed') }
    )
    
  }
  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }
  processSMS(data) {
    // Check SMS for a specific string sequence to identify it is you SMS
    // Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
    // In this case, I am keeping the first 6 letters as OTP
    const message = data.body;
    console.log("OTP Received"+message);
    if(data.address == "CP-SENOTP"){
      let OTP = data.body.slice(15, 19);
      console.log("otp------>"+OTP)
      let arr = OTP.split("");
console.log("arr------>"+arr)

  // this.item.first = arr[0];
  // this.item.second = arr[1];
  // this.item.third = arr[2]; 
  // this.item.fourth = arr[3];
  this.stop();
    }
   
      
    
  }
  
  startTimer(duration: number) {
    clearInterval(this.interval);
    this.timer = duration * 60;
    this.updateTime();
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
    this.time.next('00:00');
  }
  updateTime() {
    let m: any = this.timer / 60;
    let s: any = this.timer % 60;

    m = String('0' + Math.floor(m)).slice(-2);
    s = String('0' + Math.floor(s)).slice(-2);

    const text = m + ':' + s;

    this.time.next(text);

    --this.timer;

    if (this.timer < 0) {
      this.stopTimer();
    }
  }

  moveFocus(event) {
    console.log("")
    if (event.name == "first")
      setTimeout(() => {
        this.two.setFocus();
      }, 200)
    if (event.name == "second")
      setTimeout(() => {
        this.three.setFocus();
      }, 200)
    if (event.name == "third")
      setTimeout(() => {
        this.four.setFocus();
      }, 200)
      if (event.name == "fourth")
      setTimeout(() => {
        this.five.setFocus();
      }, 200)
      if (event.name == "fifth")
      setTimeout(() => {
        this.six.setFocus();
      }, 200)
  }

  async  onValidateFunc() {
    if (event) {
      event.stopPropagation();
    }
    
   
   if(this.data.mpin == '' ){
    let displayError = 'please enter your 6 digit Mpin';
    const toast = await this.toastController.create({
      message: displayError,
     duration: 3000,
     position: 'bottom',
     color:'danger'
   });
   toast.present();
   }
      // this.data = this.item;
      this.onValidate.emit(this.data);
    
   
    
   
      
  }
 async onResendFunc() {
    // this.appConfigService.showLoader();
    if (event) {
      event.stopPropagation();
    }
    // this.item.isRegister = this.registrationData.isRegister;
    // this.item.first = ""
    //  this.item.second = ""
    //   this.item.third = "" 
    //  this.item.fourth = ""
    //  this.data = this.item;
    //  this.appConfigService.hideLoader();
     this.startTimer(2);
     this.isDisabled = true;
     this.isHidden = true;
     
     setTimeout(() => {
       this.one.setFocus();
     }, 200);
    //  this.appConfigService.showToast('success',this.otpResend);  
     this.onResend.emit(this.data);
}
}
