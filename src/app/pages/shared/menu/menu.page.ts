import { Component, OnInit, RendererFactory2, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { filter, map } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { TabsConfigurationService } from 'src/app/services/shared/tab-config/tabs-configuration.service';
import { MenuConfigurationService } from 'src/app/services/shared/menu-config/menu-configuration.service';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { LoginService } from 'src/app/services/shared/login/login.service';
import { UserService } from 'src/app/services/shared/user/user.service';
import { ApiService } from 'src/app/services/shared/api/api.service';
import { SIZE_TO_MEDIA } from '@ionic/core/dist/collection/utils/media';
import { StepperConfigurationService } from 'src/app/services/shared/stepper-config/stepper-configuration.service';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';
import { AuthServerProvider } from 'src/app/services/shared/auth/auth-jwt.service';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  renderer: Renderer2;
  logo1 = 'assets/img/products/kastle/logo.svg'
  logo = 'assets/img/products/kastle/company.jpg';
  bgImg: string = 'assets/img/background/logo.svg'
  menuImg: string = 'assets/img/background/5.png';
  menuData: any[] = [];

  constructor(private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    private tabsConfig: TabsConfigurationService,
    public menuConfig: MenuConfigurationService,
    private router: Router,
    private navController: NavController,
    public appConfig: AppConfigService,
    public menu: MenuController,
    private loginservic: LoginService,
    private userService: UserService,
    private storage: Storage,
    private apiService: ApiService,
    private stepperConfigurationService: StepperConfigurationService,
    private utilityService: UtilityService,
    private authServerProvider: AuthServerProvider,
    private localStorage: LocalStorageService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngOnInit() {
    console.log("menu onInit");
    this.appConfig.reloadSetAppConfig();
  }


  ionViewWillEnter() {
    console.log("menu ionview enter");
    // assign company name for all pages
    this.appConfig.assignCompanyTitle();
       
    const userDataKey = this.localStorage.retrieve(this.appConfig.getUserDataKey());
    if(!!userDataKey){
      let decryptedData = this.appConfig.decrypt(this.appConfig.secretKey,userDataKey);
      let fullResponse = JSON.parse(decryptedData);
      console.log("localstorage has user data key");
      this.assignMenuByRoles();
    }else{
      this.utilityService.showToast('error', this.appConfig.getUserNotAuthMsg());
      console.log("localstorage  does not have user data key - do logout");
      this.appConfig.logout();
      this.authServerProvider.logout();
      this.router.navigateByUrl('login');
    }
        
  }

  assignMenuByRoles(){
     // load menus
      // this.menuConfig.getMenu();
    this.appConfig.resetRoles();
    if (this.appConfig.getUserData().role == 'sales') {
      this.appConfig.setIsSalesUser(true);
      this.menuConfig.getMenudummySales();
      this.checkUrlandAssignMenuColor();
    } else if (this.appConfig.getUserData().role == 'branchManager') {
      this.appConfig.setIsBranchManager(true);
      this.menuConfig.getMenudummyRm();
      this.checkUrlandAssignMenuColor();
    } else if(this.appConfig.getUserData().role == 'enquiry'){
      this.appConfig.setIsEnquiry(true);
      this.menuConfig.getMenudummyEnquiry();
      this.checkUrlandAssignMenuColor();
    }else if(this.appConfig.getUserData().role == 'admin'){
      this.appConfig.setIsAdminUser(true);
      this.menuConfig.getMenuJson();
      // this.checkUrlandAssignMenuColor();
    }else {
      this.utilityService.showToast('error', 'User role not found');
      console.log("User role not found");
      this.appConfig.logout();
      this.router.navigateByUrl('login');

    }

  }

  checkUrlandAssignMenuColor(){
    let url = null;
    // let createAppPageBool :boolean = false;
    // let inboxPageBool :boolean = false;

    url = this.router.url;
    if(url != undefined && url != null){
    
      if(url.search("create-application") != -1){
        if(this.appConfig.getIsBranchManager()){
          // inboxPageBool = true;
          this.menuConfig.assignMenuSelectedByIdentifier('inbox');
        }else{
          // createAppPageBool = true;
        this.menuConfig.assignMenuSelectedByIdentifier('createApplication');
        }
      }else if(url.search("inbox") != -1){
        // inboxPageBool = true;
      this.menuConfig.assignMenuSelectedByIdentifier('inbox');
      }else if(url.search("application-summary") != -1){
        this.menuConfig.assignMenuSelectedByIdentifier('applicationSummary');
      }else if(url.search("analytics-data-view") != -1){
        this.menuConfig.assignMenuSelectedByIdentifier('analytics');
      }
      
    }
  }

  tabenableLight() {
    console.log("light");
    this.renderer.removeClass(this.document.body, 'dark-theme');
  }

  tabenableDark() {
    console.log("dark");
    this.renderer.addClass(this.document.body, 'dark-theme');
  }

  changeTheme(name) {
    if (name) {
      document.body.removeAttribute("class");
      document.body.classList.add(name);
    }
  }

  menuClicked(data) {
    console.log("menu clicked" + JSON.stringify(data));
    let menuOpened :any = data.menuOpened;
    console.log("INITIAL menuOpened BOOL "+menuOpened);
    this.menuConfig.menuData.forEach(element => {
      element.menuselected = false;
      element.menuOpened = false;
    });
    data.menuselected = true;
    if(menuOpened){
      data.menuOpened = false;
    }else{
      data.menuOpened = true;
    }
    console.log("FINAL menuOpened BOOL "+data.menuOpened);
    this.stepperConfigurationService.emptyStepsArray();
    this.appConfig.setInitialJourneyData();
   if(data.identifier == "Dashboard"){
    this.menu.close();
    this.navController.navigateRoot(data.menulink);
   }else if(data.menulink != null && data.menulink != ""){
    this.menu.close();
     let url = null;
     url = data.menulink+"/"+data.menuconid;
     console.log(url);
    this.navController.navigateRoot(data.menulink+"/"+data.menuconid);
   }
  }

  subMenuClicked(categories, parentItem){
    this.menu.close();
    parentItem.submMenuList.forEach(element => {
      element.menuselected = false;
    });
    categories.menuselected = true;
    let url = null;
    url = categories.menulink+"/"+parentItem.menuconid+"/"+categories.menuconid;
    console.log(url);
    this.navController.navigateRoot(url);

    if(categories.menuconid == 127){
      // alert("hi audit trail")
      // this.router.navigate(['/custom-filter']);
      // this.router.navigateByUrl('/custom-filter');
      this.router.navigateByUrl('/menu/tabs/custom-filter');
      
    }
  }


  goBackToHomePage() {
    this.navController.navigateBack('login');
  };

  toogleMenu() {
    const splitPane = document.querySelector('ion-split-pane');

    if (window.matchMedia(SIZE_TO_MEDIA[splitPane.when] || splitPane.when).matches)
      splitPane.classList.toggle('split-pane-visible')

    {

    }
  }
}
