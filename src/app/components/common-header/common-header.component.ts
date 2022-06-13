import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { LoginService } from 'src/app/services/shared/login/login.service';
import { TabsConfigurationService } from 'src/app/services/shared/tab-config/tabs-configuration.service';
import { MenuConfigurationService } from 'src/app/services/shared/menu-config/menu-configuration.service';
import { ApiService } from 'src/app/services/shared/api/api.service';
import { AuthServerProvider } from 'src/app/services/shared/auth/auth-jwt.service';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';


@Component({
  selector: 'digital-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent implements OnInit, AfterViewInit {
  @Input() title: string = 'COMPANY_TITLE';
  @Input() showSettings: boolean = true;
  @Input() showLogOut: boolean = true;
  @Input() showFilter: boolean = false;
  @Input() filterUsed: boolean = false;
  @Input() showHome: boolean = true;
  @Input() showDefaultBackButton: boolean = false;
  @Input() showCustomBackButton: boolean = false;
  @Input() showMenu: boolean = true;
  @Output() onSettings = new EventEmitter();
  @Output() onLogOut = new EventEmitter();
  @Output() onFilterClicked = new EventEmitter();
  @Output() onBack = new EventEmitter();
  @Output() notificationsRead = new EventEmitter();
  @Input() isMenu: boolean = true;
  unreadNotificationCount: any = null;

  logo = 'assets/img/products/kastle/logo.svg'
  constructor(
    public loginservic: LoginService,
    public navController: NavController,
    public appConfigService: AppConfigService,
    private router: Router,
    public tabsConfig: TabsConfigurationService,
    private menuConfig: MenuConfigurationService,
    private apiService: ApiService,
    private authServerProvider : AuthServerProvider,
    private utilityservice:UtilityService
  ) {}

  ngOnInit() {
  
  }

  ngAfterViewInit() {

  }


 
  onSettingsFunc(): void {
    //below code is for passing control to parent screen
    // this.onSettings.emit(true);
    // this.router.navigate(['tabs/menu/user-profile']);
  }

  

  onLogoOutFunc(): void {
    console.log("logout clicked");
    // this.appConfigService.logout();
    // this.authServerProvider.logout().subscribe();
    // this.utilityservice.showToast('success','User has been logged out successfully',{});
    // this.navController.navigateBack('login');
    // return;

    // comment above for logout api
    let url = "user-log-onlogout";
    let newObj :any = {};
    newObj.id = this.appConfigService.getUserData().id;
    newObj.sessionId = this.appConfigService.getUserData().sessionId;
    newObj.langId = this.appConfigService.getLanguageId();
      newObj.randomKey = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
      newObj.transactionId = this.utilityservice.getTRNTimestamp();
      newObj.userId = this.appConfigService.getUserData().userId;

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

    let errorHandlingObj = {
      returnToParent:true
    };

    this.utilityservice
      .callPostApi( 
        crudObj2,
        url
      )
      .then(
        (resp :any) => {
          this.appConfigService.logout();
          this.authServerProvider.logout().subscribe();
          this.utilityservice.showToast('success','User has been logged out successfully',{});
          this.navController.navigateBack('login');
        },
        (err =>{
          this.utilityservice.showToast("error", "Internal Server Error");
        })
      )
  }

  private goBackToHomePage(): void {
    this.navController.navigateBack('login');
  }
  onFilterFunc() {
    this.onFilterClicked.emit(true);
  }

  onBackFunc(): void {
    this.onBack.emit(true);
  }



  appConfigBackRoute() {
    this.appConfigService.titleBackRoute();
  }

  onHomeFunc() {
    // this.tabsConfig.assignDefaultArray(); // to reset tabs configuration to DEFAULT mode
    // this.menuConfig.assignMenuHomeSelected(); //to assign default home
    // this.navController.navigateBack('/menu/tabs/entities/switch-loan/list');
  }

  onNotification() {
    // this.navController.navigateForward('/menu/tabs/entities/notification');
    // this.unreadNotificationCount = null;
  }
}
