import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ApiService } from '../api/api.service';
import { AppConfigService } from '../app-configuration/app-config.service';

@Injectable({ providedIn: 'root' })
export class TabsConfigurationService {
  private tabsData: Array<any> = [];
  private topTabsArray: Array<any> = [];
  private bottomTabsArray: Array<any> = [];
  private showTopTab: boolean = false;
  private showBottomTab: boolean = false;
  private showTabs: boolean = true;

  constructor(
    public appConfigService: AppConfigService
  ) {
    console.log('tab config service called');
    // this.assignDefaultArray();
  }

  getTopTabBool() {
    return this.showTopTab;
  }
  getBottomTabBool() {
    return this.showBottomTab;
  }
  setTopTabBool(bool) {
    this.showTopTab = bool;
  }
  setBottomTabBool(bool) {
    this.showBottomTab = bool;
  }

  // call this on fresh login to reset values
  assignDefaultArray() {
    this.showTabs = true;
    this.showboolTabs();
    this.showTopTab = false;
    this.showBottomTab = true;
    this.assignEmptyArray();
    this.tabsData = this.getInitialTabsData();
    this.setTopAndBottomTabs();
  }

  // check epty tabs for show / hide tabs logic and assign default Tabs Array
  checkEmptyTabsAndAssignDefaultTabs() {
    if (this.tabsData.length == 0) {
      this.showTabs = true;
      this.showboolTabs();
      this.assignDefaultArray();
    }
  }

  assignMenuTabsArray(data) {
    this.showTopTab = false;
    this.showBottomTab = false;
    this.assignEmptyArray();
    data.tabdataarray.forEach((element) => {
      if (element.tabposition == 'top') {
        this.showTopTab = true;
      }
      if (element.tabposition == 'bottom') {
        this.showBottomTab = true;
      }
    });
    this.tabsData = data.tabdataarray;

    this.setTopAndBottomTabs();
  }

  hideTabs() {
    this.showTabs = false;
    this.showBottomTab = false;
  }
  showboolTabs() {
    this.showTabs = true;
    this.showBottomTab = true;
  }
  assignEmptyArray() {
    this.tabsData = [];
    this.topTabsArray = [];
    this.bottomTabsArray = [];
  }

  public setTopAndBottomTabs() {
    this.topTabsArray = [];
    this.bottomTabsArray = [];

    this.tabsData.forEach((ele) => {
      if (ele.tabposition == 'top') {
        this.topTabsArray.push(ele);
      } else if (ele.tabposition == 'bottom') {
        this.bottomTabsArray.push(ele);
      } else {
        alert('tab position not declared');
      }
    });
  }

  public getTopTabs() {
    return this.topTabsArray;
  }

  public getBottomTabs() {
    return this.bottomTabsArray;
  }

  public unSelectTabs(data) {
    this.bottomTabsArray.forEach((element) => {
      element.tabselected = false;
    });
    this.topTabsArray.forEach((element) => {
      element.tabselected = false;
    });
  }

  public assignSelectedTab(data) {
    let arrayName = 'bottomTabsArray';

    if (data.tabposition == 'top') {
      arrayName = 'topTabsArray';
    }

    this[arrayName].forEach((element) => {
      if (data.id == element.id) {
        element.tabselected = true;
      } else {
        element.tabselected = false;
      }
    });
  }

  // For menu match with title rather than id
  public assignMenuTabsDefaultWithTitle(data) {
    let arrayName = 'bottomTabsArray';

    if (data.tabposition == 'top') {
      arrayName = 'topTabsArray';
    }

    this[arrayName].forEach((ele) => {
      if (ele.title.toLowerCase() == data.title.toLowerCase()) {
        ele.tabselected = true;
      } else {
        ele.tabselected = false;
      }
    });
  }

  public getInitialTabsData() {
    return [
      {
        id: -8,
        title: 'MENU_NSR',
        route: 'entities/service-request/customer-type',
        icon: 'git-network',
        menuposition: 'menu',
        tabposition: 'bottom',
        tabselected: false,
        tabenable: false,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
      },
      {
        id: -9,
        title: 'MENU_SRH',
        route: 'entities/service-request-history/info',
        icon: 'git-network',
        menuposition: 'menu',
        tabposition: 'bottom',
        tabselected: false,
        tabenable: false,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
      },
      {
        id: -10,
        title: 'MENU_SOC',
        // "route" : "entities/schedule-of-charges/info",
        route: 'entities/switch-loan/list',
        // "route" : null,
        icon: 'git-network',
        menuposition: 'menu',
        tabposition: 'bottom',
        tabselected: false,
        tabenable: false,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
      }
    ];
  }


}
