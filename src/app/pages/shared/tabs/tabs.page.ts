import { Component,OnInit } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { HttpResponse,HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { ApiService } from 'src/app/services/shared/api/api.service';
import { TabsConfigurationService } from 'src/app/services/shared/tab-config/tabs-configuration.service';
import { MenuConfigurationService } from 'src/app/services/shared/menu-config/menu-configuration.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit{
  topRoutes:Array<any> = [];
  bottomRoutes:Array<any> = [];
  routesData:any;
  showTopTab:boolean = true;
  showBottomTab:boolean = true;  

  constructor(public appConfigService:AppConfigService,
  private apiService:ApiService,
  private activatedRoute: ActivatedRoute,
  public router: Router,
  public tabsConfig :TabsConfigurationService,
  private menuConfig:MenuConfigurationService,
  private navController:NavController){
  }

  ngOnInit(){

  }

  ionViewWillEnter(){
  console.log("tabs ionview enter");
  }

  tabClickTop(entity){
   this.tabsConfig.unSelectTabs(entity);
   this.tabsConfig.assignSelectedTab(entity);
   this.assignMenuSelected(entity);
   
    // this.navController.navigateRoot([data.route], {});    
  }

  tabClickBottom(entity){
    console.log(entity.title);

  this.tabsConfig.unSelectTabs(entity);
  this.tabsConfig.assignSelectedTab(entity);
      
  // route
  var preUrl = "/menu/tabs/";
  var url =  preUrl+entity.route;

    console.log("TABS FORMATEED URL "+url);
  this.router.navigateByUrl(url);
 

  }

  assignMenuSelected(entity){
    this.menuConfig.menuData.forEach(element => {
      if(element.title.toLowerCase() == entity.title.toLowerCase()){
        element.menuselected = true;
      }else{
        element.menuselected = false;
      }
    });
  }

}
