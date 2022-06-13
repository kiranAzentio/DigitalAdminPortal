import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../app-configuration/app-config.service';
import { UtilityService } from '../utility/utility.service';


@Injectable({ providedIn: 'root' })
export class MenuConfigurationService {
  menuData: any[] = [];
  seqArr: any[] = []

  constructor(
    private appConfigService: AppConfigService,
    private apiService: ApiService,
    private utilityService: UtilityService,
    ) { }

  public assignMenuData(data) {
    this.menuData = [];
    this.menuData = data;
    console.log('after assigning menu data in menu config' + JSON.stringify(this.menuData));
  }

  public assignMenuHomeSelected() {
    this.menuData.forEach((ele) => {
      if (ele.title == 'MENU_HOME') {
        ele.menuselected = true;
      } else {
        ele.menuselected = false;
      }
    });
  }

  public assignMenuSelectedByIdentifier(name) {
    this.menuData.forEach((ele) => {
      if (ele.identifier == name) {
        ele.menuselected = true;
      } else {
        ele.menuselected = false;
      }
    });
  }

  public getInitialMenuData() {
    return [
      {
        id: -99,
        menudesc:"Dashboard 1",
        title: 'MENU_HOME',
        menulink: '/menu/tabs/entities/i-and-m/dashboard',
        icon: 'apps-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: true,
        tabdataarray: [],
        identifier:'Dashboard'
      },
      {
        id: -9954,
        menudesc:"Dashboard 2",
        title: 'MENU_HOME',
        menulink: '/menu/tabs/entities/kastle/dashboard',
        icon: 'apps-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: true,
        tabdataarray: [],
        identifier:'Dashboard'
      },
      {
        id: -9999,
        menudesc:"DATA GRID 1",
        title: 'MENU_HOME',
        menulink: '/menu/tabs/entities/kastle/datagrid/1',
        icon: 'list-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
        identifier:'inbox'
      },
      {
        id: -9999999,
        menudesc:"DATA GRID 2",
        title: 'MENU_HOME',
        // menulink: '/menu/tabs/entities/i-and-m/create-application',
        menulink: '/menu/tabs/entities/kastle/datagrid/2',
        icon: 'create-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
        identifier:'createApplication'
      },
      {
        id: -93211219,
        menudesc:"DATA GRID 3",
        title: 'MENU_HOME',
        // menulink: '/menu/tabs/entities/i-and-m/application-summary',
        menulink: '/menu/tabs/entities/kastle/datagrid/3',
        icon: 'list-circle-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
        identifier:"applicationSummary"
      },
      {
        id: -90000,
        menudesc:"Logout",
        title: 'MENU_SRH',
        // menulink: '/menu/tabs/entities/i-and-m/dummy1',
        // menulink: '/menu/tabs/entities/i-and-m/accounting',
        menulink: null,
        icon: 'log-out-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: 'bottom',
        tabselected: false,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
        identifier:'Logout',
        
      }
    ];
  }

  async getMenu(langchange?) {
    var menuObj = {
      roleid: this.appConfigService.getRoleId(),
      language: this.appConfigService.getLanguage(),
      transactionId: this.utilityService.getTRNTimestamp(),
      channel: this.appConfigService.getChannel(),
      requestedOn: this.appConfigService.getDateTime(),
      randomKey : this.appConfigService.rsa_encrypt(this.appConfigService.getSecret()),
      // "transactionId" : this.utilityService.getTRNTimestamp(),
      userId : this.appConfigService.getUserData().userId
    };

    // var menuRequestObj: any = {};
    // if (this.appConfigService.getEncryptDatabool()) {
    //   // ENCRYPTION MODE n
    //   let newData = this.utilityService.encrypt(menuObj);
    //   menuRequestObj['encryptedRequest'] = newData;
    // } else {
    //   // NORMAL MODE
    //   menuRequestObj = menuObj;
    //   menuRequestObj['encryptedRequest'] = null;
    // }

    let crudObj :any = {};
    if (this.appConfigService.getEncryptDatabool()) {
      let newData = this.appConfigService.encrypt(this.appConfigService.secretKey, menuObj);
      crudObj['encryptedRequest'] = newData;
      crudObj['randomKey'] = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
    } else {
      crudObj = menuObj;
      crudObj['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }

    if (langchange != undefined) {
      this.utilityService.showLoader();
    }
    this.apiService
      .post('menu/get-menu', crudObj)
      .pipe(
        filter((res: HttpResponse<any>) => res.ok),
        map((res: HttpResponse<any>) => res.body)
      )
      .subscribe(
        async (response: any) => {
          if (langchange != undefined) {
            this.utilityService.hideLoader();
          }
          if (response) {
            var responseData: any;
            // if (this.appConfigService.getEncryptDatabool()) {
            //   // encryption
            //   let decryptedData = this.utilityService.decrypt(response.result.encryptedResponse);
            //   var fullResponse = JSON.parse(decryptedData);
            //   responseData = fullResponse;
            // } 
            if (this.appConfigService.getEncryptDatabool()) {
              let decryptedData = this.appConfigService.decrypt(
                    this.appConfigService.secretKey,
                    response.encryptedResponse
                  );
                  let fullResponse = JSON.parse(decryptedData);
                  responseData = fullResponse;
            } 
            else {
              // normal
              responseData = response.result;
            }
            if (responseData.message == 'SUCCESS') {
              if (langchange != undefined) {
                if (responseData.menuList.length > 0 && this.menuData.length > 0) {
                  responseData.menuList.forEach((resEle) => {
                    this.menuData.forEach((menuEle) => {
                      if (menuEle.menuconid == resEle.menuconid) {
                        menuEle.menudesc = resEle.menudesc;
                        return;
                      }
                    });
                  });
                }
              } else {
                this.assignMenuData(responseData.menuList);
              }
            } else if (responseData.message == 'FAIL') {
              var emptyMenu = [];
              this.assignMenuData(emptyMenu);
              this.utilityService.showToast('error', this.appConfigService.getFailMessage(responseData));
            } else {
              console.log('FAIL ' + JSON.stringify(responseData));
              var emptyMenu = [];
              this.assignMenuData(emptyMenu);
            }
          } else {
            this.utilityService.showToast('error');
          }
        },
        async (error) => {
          if (langchange != undefined) {
            this.utilityService.hideLoader();
          }
          console.error('MENU error' + error);
          this.utilityService.showToast('error');
        }
      );
  }

  getMenudummySales(){
    this.menuData = [];
    this.menuData = this.getInitialMenuData();
  }

  getMenudummyRm(){
    this.menuData = [];
    this.menuData = this.getInitialMenuDataRm();
  }

  getMenudummyEnquiry(){
    this.menuData = [];
    this.menuData = this.getInitialMenuDataEnquiry();
  }

  getMenuJson(){
    this.menuData = [];
    this.getMenuDataFromApi();
  }

  setNestedMenuData(menuDataArr){
    let counter = 0;
    // alert("menuDataArr"+ JSON.stringify(menuDataArr))

    // var obj = JSON.parse(JSON.stringify(menuDataArr));
    var subMenu=JSON.parse(JSON.stringify(menuDataArr));
    var sorted_menu={};
    subMenu.forEach((item) => {
        if(item.submMenuList && item.submMenuList.length >0) {
            item.submMenuList.sort((a, b) => parseInt(a.menusequence) > parseInt(b.menusequence) ? 1 : -1);
           // console.log(item.submMenuList);
            sorted_menu=item.submMenuList;
        }
            
    });
    // obj.result.menuList=subMenu;
    console.log(JSON.stringify(subMenu));
    menuDataArr= subMenu;


    menuDataArr.forEach(element => {
      console.log("menudescription"+JSON.stringify(element.menudesc) +"menusequence"+JSON.stringify(element.menusequence))

      element.menuselected = false;
      element.image = this.utilityService.convertBase64Data('image/png', element.menuicon);
      if(counter == 0 && element.submMenuList.length > 0){
        element.menuOpened = true;
      }else{
        element.menuOpened = false;
      }


      element.submMenuList.forEach(innerEle => {
        console.log("menudescription"+JSON.stringify(innerEle.menudesc) +"menusequence"+JSON.stringify(innerEle.menusequence))
      

        console.log("this.seqArr"+JSON.stringify(this.seqArr))


       
        innerEle.menuselected = false;
        innerEle.image = this.utilityService.convertBase64Data('image/png', innerEle.menuicon);
      });
      counter++;
      this.menuData.push(element);
    });
  }
  public getMenuDataFromApi(){
    let url = '';
    let obj :any = {};
    // this.utilityService.callPostApi(obj,url).then( (res:any)=>{
    //   this.menuData = res.menuList;
    // },err=>{
    //   console.log("error");
    // });

    // test dummy menu
    this.test3();
    //  let data = this.dummyAdminPortalData();
    //  this.setNestedMenuData(data);
  }

    // menu
    test3(){
      console.log("test clicked response ");
      let req:any = {};
      req['companyId'] = 2;
      req['roleid'] = 1;
      req['encryptedRequest'] = null;
      req['productCode'] = 'LENDING';
      req['language'] = 'en_US';
      req['channel'] = '0';
      req['randomKey'] = null;
      req['requestedOn'] = "03-11-2021 16:40:46";
      req['transactionId'] = this.utilityService.getTRNTimestamp();
      req['randomKey'] = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
      req['userId'] = this.appConfigService.getUserData().userId

      let url = "menu/get-menu";
      let crudObj :any = {};
    if (this.appConfigService.getEncryptDatabool()) {
      let newData = this.appConfigService.encrypt(this.appConfigService.secretKey, req);
      crudObj['encryptedRequest'] = newData;
      crudObj['randomKey'] = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
    } else {
      crudObj = req;
      crudObj['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }

      this.utilityService.callPostApi(crudObj,url).then( (res:any)=>{
        // uncomment for checking HARDCODED STATIC old temp2 database menu list
        // res = this.dummyTemp2MenuData();
        // 

        console.log("KASTLE response "+JSON.stringify(res));
        if (this.appConfigService.getEncryptDatabool()) {
          let decryptedData = this.appConfigService.decrypt(
                this.appConfigService.secretKey,
                res.encryptedResponse
              );
              let fullResponse = JSON.parse(decryptedData);
              res = fullResponse;
        } 

     this.setNestedMenuData(res.result.menuList);

        // let a :any = JSON.stringify(res);
        // let abc = JSON.parse(res[0]);
        // var finalData = res[0].filterData.replace(/\\/g, "");
        //  console.log("KASTLE ABC PARSE "+JSON.parse(finalData));
        //  let parsedata = JSON.parse(finalData)
        // console.log("KASTLE final "+JSON.stringify(parsedata));
        // let xyz = JSON.stringify(abc);
        // console.log("KASTLE XYZ STRNGIFY "+JSON.stringify(xyz));
      },err=>{
        console.log("KASTLE error "+JSON.stringify(err));
      })
    }

  dummyAdminPortalData(){
     let data =  [ {
      "menuconid" : "891",
      "menuicon" : null,
      "menulink" : "/menu/tabs/entities/i-and-m/dashboard",
      "menudesc" : "DASHBOARD",
      "menuposition" : "L",
      "menulevel" : "1",
      "menusequence" : "1",
      "identifier" : "Dashboard",
      "submMenuList" : [ ]
      },
      // {
      //   "menuconid" : "89134",
      //   "menuicon" : null,
      //   "menulink" : "/menu/tabs/entities/kastle/dashboard",
      //   "menudesc" : "Kastle Dashboard",
      //   "menuposition" : "L",
      //   "menulevel" : "1",
      //   "menusequence" : "1",
      //   "identifier" : "Dashboard",
      //   "submMenuList" : [ ]
      //   }, 
      //    {
      // "menuconid" : "894",
      // "menuicon" : null,
      // "menulink" : null,
      // "menudesc" : "Company Level",
      // "menuposition" : "L",
      // "menulevel" : "1",
      // "menusequence" : "3",
      // "identifier" : "NestedGrid",
      // "submMenuList" : [ {
      //         "menuconid" : "4",
      //         "menuicon" : null,
      //         "menulink" : "/menu/tabs/entities/kastle/datagrid",
      //         "menudesc" : "Language Master",
      //         "menuposition" : "L",
      //         "menulevel" : "2",
      //         "menusequence" : "1",
      //         "identifier" : "Grid"
      //         }, {
      //         "menuconid" : "2",
      //         "menuicon" : null,
      //         "menulink" : "/menu/tabs/entities/kastle/datagrid",
      //         "menudesc" : "Company Master",
      //         "menuposition" : "L",
      //         "menulevel" : "2",
      //         "menusequence" : "2",
      //         "identifier" : "Grid"
      //         }, {
      //         "menuconid" : "3",
      //         "menuicon" : null,
      //         "menulink" : "/menu/tabs/entities/kastle/datagrid",
      //         "menudesc" : "Currency Master",
      //         "menuposition" : "L",
      //         "menulevel" : "2",
      //         "menusequence" : "3",
      //         "identifier" : "Grid"
      //         } ]
      // }, 
      {
        "menuconid" : "1",
        "menuicon" : null,
        "menulink" : null,
        "menudesc" : "Generic Masters",
        "menuposition" : "L",
        "menulevel" : "1",
        "menusequence" : "3",
        "identifier" : "NestedGrid",
        "submMenuList" : [ 
          // {
          //       "menuconid" : "5",
          //       "menuicon" : null,
          //       "menulink" : "/menu/tabs/entities/kastle/datagrid",
          //       "menudesc" : "Key Value Master",
          //       "menuposition" : "L",
          //       "menulevel" : "2",
          //       "menusequence" : "1",
          //       "identifier" : "Grid"
          //       },
                {
                  "menuconid" : "1",
                  "menuicon" : null,
                  "menulink" : "/menu/tabs/entities/kastle/datagrid",
                  "menudesc" : "Key Value Master",
                  "menuposition" : "L",
                  "menulevel" : "2",
                  "menusequence" : "1",
                  "identifier" : "Grid"
                  },  ]
        }, 
      // {
      //   "menuconid" : "1",
      //   "menuicon" : null,
      //   "menulink" : "/menu/tabs/entities/kastle/datagrid",
      //   "menudesc" : "ENGLISH GRID",
      //   "menuposition" : "L",
      //   "menulevel" : "1",
      //   "menusequence" : "1",
      //   "identifier" : "Grid",
      //   "submMenuList" : [ ]
      //   },
      //   {
      //     "menuconid" : "2",
      //     "menuicon" : null,
      //     "menulink" : "/menu/tabs/entities/kastle/datagrid",
      //     "menudesc" : "ARABIC GRID",
      //     "menuposition" : "L",
      //     "menulevel" : "1",
      //     "menusequence" : "1",
      //     "identifier" : "Grid",
      //     "submMenuList" : [ ]
      //     },
      //     {
      //       "menuconid" : "3",
      //       "menuicon" : null,
      //       "menulink" : "/menu/tabs/entities/kastle/datagrid",
      //       "menudesc" : "HINDI GRID",
      //       "menuposition" : "L",
      //       "menulevel" : "1",
      //       "menusequence" : "1",
      //       "identifier" : "Grid",
      //       "submMenuList" : [ ]
      //       } 
    ]
      return data;
  }

  public getInitialMenuDataRm() {
    return [
      {
        id: -99,
        menudesc:"Dashboard",
        title: 'MENU_HOME',
        menulink: '/menu/tabs/entities/i-and-m/dashboard',
        icon: 'apps-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: true,
        tabdataarray: [],
        identifier:'Dashboard'
      },
      {
        id: -9999,
        menudesc:"Inbox",
        title: 'MENU_HOME',
        menulink: '/menu/tabs/entities/i-and-m/inbox',
        icon: 'list-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
        identifier:'inbox'
      },
      {
        id: -92339,
        menudesc:"Analytics Data View",
        title: 'MENU_HOME',
        menulink: '/menu/tabs/entities/i-and-m/analytics-data-view',
        icon: 'eye-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
        identifier:"analytics"
      },
      {
        id: -93211219,
        menudesc:"Application Summary",
        title: 'MENU_HOME',
        menulink: '/menu/tabs/entities/i-and-m/application-summary',
        icon: 'list-circle-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
        identifier:"applicationSummary"
      },
      {
        id: -90000,
        menudesc:"Logout",
        title: 'MENU_SRH',
        menulink: null,
        icon: 'log-out-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: 'bottom',
        tabselected: false,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
        identifier:'Logout',
      }
    ];
  }

  public getInitialMenuDataEnquiry() {
    return [
      {
        id: -93211219,
        menudesc:"Application Summary",
        title: 'MENU_HOME',
        menulink: '/menu/tabs/entities/i-and-m/application-summary',
        icon: 'list-circle-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: true,
        tabdataarray: [],
        identifier:"applicationSummary"
      },
      {
        id: -92339,
        menudesc:"Analytics Data View",
        title: 'MENU_HOME',
        menulink: '/menu/tabs/entities/i-and-m/analytics-data-view',
        icon: 'eye-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: null,
        tabselected: true,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
        identifier:"analytics"
      },
      {
        id: -90000,
        menudesc:"Logout",
        title: 'MENU_SRH',
        menulink: null,
        icon: 'log-out-outline',
        image:'assets/img/products/kastle/menuicon1.png',
        menuposition: 'menu',
        tabposition: 'bottom',
        tabselected: false,
        tabenable: true,
        tabstate: 'DEFAULT',
        menuselected: false,
        tabdataarray: [],
        identifier:'Logout',
      }
    ];
  }

  dummyTemp2MenuData(){
    return  {
      "result" : {
        "message" : "SUCCESS",
        "transactionId" : "TRN1653382492373",
        "responseOn" : "24-05-2022 14:24:57",
        "menuList" : [ {
          "menuconid" : "105",
          "menuicon" : null,
          "menulink" : "/menu/tabs/entities/kastle/dashboard",
          "menudesc" : "Dashboard",
          "menuposition" : "L",
          "menulevel" : "1",
          "menusequence" : "1",
          "identifier" : "Dashboard",
          "submMenuList" : [ ],
          "extra1" : null
        }, {
          "menuconid" : "108",
          "menuicon" : null,
          "menulink" : null,
          "menudesc" : "Company Management",
          "menuposition" : "L",
          "menulevel" : "1",
          "menusequence" : "2",
          "identifier" : "NestedGrid",
          "submMenuList" : [ {
            "menuconid" : "212",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Company Branch ",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "4",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "109",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Company ",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "3",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "110",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Currency ",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "2",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "111",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Language",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "1",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "214",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Core Product",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "5",
            "identifier" : "Grid",
            "extra1" : null
          } ],
          "extra1" : null
        }, {
          "menuconid" : "103",
          "menuicon" : null,
          "menulink" : null,
          "menudesc" : "System Management",
          "menuposition" : "L",
          "menulevel" : "1",
          "menusequence" : "3",
          "identifier" : "NestedGrid",
          "submMenuList" : [ {
            "menuconid" : "120",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Start/Stop Schedular",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "3",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "121",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "View Job Status",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "4",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "112",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Configuration Parameter",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "1",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "118",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Deactivate Session",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "5",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "133",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Error Codes",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "2",
            "identifier" : "Grid",
            "extra1" : null
          } ],
          "extra1" : null
        }, {
          "menuconid" : "113",
          "menuicon" : null,
          "menulink" : null,
          "menudesc" : "Security Management",
          "menuposition" : "L",
          "menulevel" : "1",
          "menusequence" : "4",
          "identifier" : "NestedGrid",
          "submMenuList" : [ {
            "menuconid" : "249",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Menu Mapping",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "6",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "116",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Menu",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "3",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "114",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Password Policy",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "1",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "115",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Roles",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "2",
            "identifier" : "Grid",
            "extra1" : null
          } ],
          "extra1" : null
        }, {
          "menuconid" : null,
          "menuicon" : null,
          "menulink" : null,
          "menudesc" : null,
          "menuposition" : null,
          "menulevel" : null,
          "menusequence" : null,
          "identifier" : null,
          "submMenuList" : [ ],
          "extra1" : null
        }, {
          "menuconid" : "122",
          "menuicon" : null,
          "menulink" : null,
          "menudesc" : "Master Data Management",
          "menuposition" : "L",
          "menulevel" : "1",
          "menusequence" : "6",
          "identifier" : "NestedGrid",
          "submMenuList" : [ {
            "menuconid" : "213",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Product Data",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "3",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "104",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Key Value ",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "2",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "124",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Promotions",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "4",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "107",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Key ",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "1",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "125",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : " Documents",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "5",
            "identifier" : "Grid",
            "extra1" : null
          } ],
          "extra1" : null
        }, {
          "menuconid" : null,
          "menuicon" : null,
          "menulink" : null,
          "menudesc" : null,
          "menuposition" : null,
          "menulevel" : null,
          "menusequence" : null,
          "identifier" : null,
          "submMenuList" : [ ],
          "extra1" : null
        }, {
          "menuconid" : "128",
          "menuicon" : null,
          "menulink" : null,
          "menudesc" : "Reports",
          "menuposition" : "L",
          "menulevel" : "1",
          "menusequence" : "8",
          "identifier" : "NestedGrid",
          "submMenuList" : [ {
            "menuconid" : "129",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "User Log",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "1",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "130",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Password Log",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "2",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "252",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Version",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "5",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "131",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Invalid log",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "3",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "117",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Configured Users",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "6",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "127",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Audit Trail",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "7",
            "identifier" : "Grid",
            "extra1" : null
          }, {
            "menuconid" : "132",
            "menuicon" : null,
            "menulink" : "/menu/tabs/entities/kastle/datagrid",
            "menudesc" : "Stale Account",
            "menuposition" : "L",
            "menulevel" : "1",
            "menusequence" : "4",
            "identifier" : "Grid",
            "extra1" : null
          } ],
          "extra1" : null
        } ],
        "encryptedResponse" : null,
        "messageDescription" : null
      }
    }
  }
}
