import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AppConfigService } from '../app-configuration/app-config.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
    providedIn: 'root',
  })
  export class UserRoleGuard implements CanActivate {
    constructor(
    private localStorage: LocalStorageService,
    private appConfig : AppConfigService,
    private utilityService : UtilityService,
          public router: Router) {}
  
    canActivate(): boolean {
        // alert("guard test")
      const userDataKeyEnc = this.localStorage.retrieve(this.appConfig.getUserDataKey());

      if (!!userDataKeyEnc) {
        let decryptedData = this.appConfig.decrypt(this.appConfig.secretKey,userDataKeyEnc);
        let userDataKey = JSON.parse(decryptedData);
        //   let url = this.router.url;
          let routeurl :any = this.router;
          let length = routeurl.currentNavigation.extractedUrl.root.children.primary.segments.length;
          let url = routeurl.currentNavigation.extractedUrl.root.children.primary.segments[length - 1].path
          if(userDataKey.role == "sales"){ // SALES
            if(url.search("analytics") != -1){
                return this.logoutFun(); // wrong
            }
          }else if(userDataKey.role == "branchManager"){ // Branch manager
                if(url.search("create-application") != -1){
                    return this.logoutFun(); // wrong
                }
          }else if(userDataKey.role == "enquiry"){ //  enquiry
            if(url.search("create-application") != -1){
                return this.logoutFun(); // wrong
            }else if(url.search("dashboard") != -1){
                return this.logoutFun(); // wrong
            }else if(url.search("inbox") != -1){
               return this.logoutFun(); // wrong
            }
          }
        return true; // PROPER
      }else{
        this.utilityService.showToast('error', this.appConfig.getUserNotAuthMsg());
        console.log("localstorage  does not have user data key - do logout");
        this.appConfig.logout();
        this.appConfig.storagelogout().subscribe();
        this.router.navigateByUrl('login');
        return false; // wrong
      }
    }

    logoutFun(){
        this.utilityService.showToast('error',this.appConfig.getUserNotAuthMsg());
        this.appConfig.logout();
        this.appConfig.storagelogout().subscribe();
        this.router.navigateByUrl('login');
        return false;
    }
  }