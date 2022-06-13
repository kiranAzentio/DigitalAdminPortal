import { ChangeDetectorRef, Component, NgZone, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform} from '@ionic/angular';
import { Router } from '@angular/router';
import { AppConfigService } from './services/shared/app-configuration/app-config.service';
import { UserService } from './services/shared/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from './services/shared/utility/utility.service';
import { fromEvent, interval, merge, Observable, Subscription } from 'rxjs';
import { skipWhile, switchMap, take, tap } from 'rxjs/operators';
import { AuthServerProvider } from './services/shared/auth/auth-jwt.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  hideRouter: Boolean = false;
  data:any;
  show: boolean;
  // [document, 'mousemove']
  // [window, 'mousemove']
public inactivityTimerEvent: Array<any>[] = [[document, 'load'],[document, 'click'], [document, 'wheel'], [document, 'scroll'], [document, 'keyup'], [window, 'resize'], [window, 'scroll'], ,[window, 'onload']];
mergedObservable$: Observable<any>;
// here we need to give the time in second ie how long we want the inactivity timer default i have kept as 5 sec
inactivityTime: number = this.appConfigService.getInactivityTimerSeconds();

timeLapsedSinceInactivity: number = 0;
minute: number = this.padZero(0);
seconds: number = this.padZero(0);
subscription: Subscription;
observeable$: Observable<any>;
showTimeLeftPopup:boolean = false;


  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private appConfigService: AppConfigService,
    private router: Router,
    private userService: UserService,
    private translate: TranslateService,
    private utilityService:UtilityService,
    public _ngZone: NgZone,
    public _cd: ChangeDetectorRef,
    private authServerProvider: AuthServerProvider
  ) {

    this.initializeApp();
    this.utilityService.loadState.subscribe(res => {
      this.show = res;
    });
    //https://stackblitz.com/edit/angular-loader-interceptor-demo?file=src%2Fapp%2Floader.component.ts
    // https://loading.io/
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // idle timeout uncomment below 2 lines
      this.checkSessionIdleTimeout();
      this.startTimer('');
    this.hideRouter = true;
      if (this.platform.is('desktop')) {
        this.appConfigService.setPlatform('desktop');
        this.appConfigService.setPlatformMobile(false);
      } else {
        this.appConfigService.setPlatform('mobile');
        this.appConfigService.setPlatformMobile(true);
      }
      this.translate.use('en');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  // splash screen loaded
  onRedirect() {
    this.hideRouter = true;
    this.translate.use('en');
    this.router.navigateByUrl('/login');
    // let userObj : any = {
    //   'name': 'Daniel George',
    //   'lastlogin': new Date(),
    //   'role':'sales'
    // }
    // this.appConfigService.assignUserData(userObj);
    // this.router.navigateByUrl('/menu/tabs/entities/i-and-m/dashboard');
  }

  checkSessionIdleTimeout(){
    let observableArray$: Observable<any>[] = [];
    this.inactivityTimerEvent.forEach(x => {
      observableArray$.push(fromEvent(x[0], x[1]))
    })
    this.mergedObservable$ = merge(...observableArray$);

    // this.createObserable();
  }

  startTimer($event) {
    this.createObserable();
  }

  createObserable(): void {
    // console.log('-----start timer-----');
    // console.log('subscription started');
    this._ngZone.runOutsideAngular(() => {
      // console.log('-----inside create observale-----');
      this.observeable$ = this.mergedObservable$.pipe(
        switchMap((ev) => interval(1000).pipe(take(this.inactivityTime))),

        tap((value) => this.isItTimeToShowPopUp(value)),

        skipWhile((x) => {
          this.timeLapsedSinceInactivity = x;
      // console.log('----SKIP WHILE X'+x);
      // console.log('-----SKIP WHILE inactivityTime -----'+ this.inactivityTime);
          return x != this.inactivityTime - 1;
        })
      );

      this.subscribeObservable();
    });
  }

  isItTimeToShowPopUp(val: number) {
    // console.log('-----inside is time to show popup -----');
    
    
    let timeLeftForInactive = this.inactivityTime - val;
    // console.log('%%%%%%%%%% timeLeftForInactive %%%%%%%%%%%%'+timeLeftForInactive);
    if(this.showTimeLeftPopup && timeLeftForInactive > 13){
      this.showTimeLeftPopup = false;
      this._cd.detectChanges();
    }

    if (timeLeftForInactive <= 13) {
      let url = "";
    url = this.router.url;
    if(url.search("login") == -1){
      this.showTimeLeftPopup = true;
    }
      // this.showTimeLeftPopup = true;
      // console.log('-----timeLeftForInactive less than 13 sec -----');

      this.timeLapsedSinceInactivity = timeLeftForInactive;
      this.minute = this.padZero(Math.floor(timeLeftForInactive / 13));
      this.seconds = this.padZero(timeLeftForInactive % 13);
      this._cd.detectChanges();
      // this.utilityService.closToast();
      // this.utilityService.showToast('error',`Session will expire in ${timeLeftForInactive} seconds.Click To Continue`,{})
      // console.log('time LEFT ' + timeLeftForInactive);
    }
  }

  subscribeObservable() {
    this.subscription = this.observeable$.subscribe((x) => {
      // console.log(`subscribed for ${x + 1} sec`);
      this.unsubscribeObservable();
    });
  }
  padZero(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }

  unsubscribeObservable(manual?) {
    // console.log('  unsubscriebd');
    this.subscription.unsubscribe();
    // alert("call api to logout api as session expired");
    // this.utilityService.showToast('error','Call logout api');
    this.showTimeLeftPopup = false;
    this.inactivityTime = this.appConfigService.getInactivityTimerSeconds();
    this.minute = this.padZero(0);
    this.seconds = this.padZero(0);
    this._cd.detectChanges();
    this.startTimer('');
    // call logout api
    let url = "";
    url = this.router.url;
    if(url.search("login") == -1){
      if(manual == undefined){
        this.expiryLogOut();
      }
    }else{
      // alert("already on login oage- dont call api");
    }
  }

    expiryLogOut(){
      // call api
      this.onLogoOutFunc();
      // this.appConfigService.logout();
      // this.authServerProvider.logout().subscribe();
      // this.utilityService.showToast('success','User has been logged out successfully due to session inactivity timeout',{});
      // this.router.navigateByUrl('login');
    }

    onLogoOutFunc(): void {
      console.log("logout api called due to timeout");
      let url = "user-log-onlogout";
      let newObj :any = {};
      newObj.id = this.appConfigService.getUserData().id;
      newObj.sessionId = this.appConfigService.getUserData().sessionId;
      newObj.langId = this.appConfigService.getLanguageId();
      newObj.randomKey = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
      newObj.transactionId = this.utilityService.getTRNTimestamp();
      newObj.userId = this.appConfigService.getUserData().userId;
  
      let errorHandlingObj = {
        returnToParent:true
      };

      let crudObj2 :any = {};
      if (this.appConfigService.getEncryptDatabool()) {
        let newData = this.appConfigService.encrypt(this.appConfigService.secretKey, newObj);
        crudObj2['encryptedRequest'] = newData;
        crudObj2['randomKey'] = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
      } else {
        crudObj2 = newObj;
        crudObj2['encryptedRequest'] = null;
        // crudObj['randomKey'] = null;
      }
  
  
      this.utilityService
        .callPostApi( 
          crudObj2,
          url
        )
        .then(
          (resp :any) => {
            this.appConfigService.logout();
            this.authServerProvider.logout().subscribe();
            this.utilityService.showToast('success','User has been logged out successfully due to session inactivity timeout',{});
            this.router.navigateByUrl('login');
          },
          (err =>{
            this.utilityService.showToast("error", "Internal Server Error");
          })
        )
    }

}