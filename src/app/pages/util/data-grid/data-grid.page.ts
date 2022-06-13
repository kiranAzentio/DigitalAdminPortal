import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding, PopoverController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse, HttpClient, HttpEventType } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { UtilityService } from '../../../services/shared/utility/utility.service';
import { AppConfigService } from '../../../services/shared/app-configuration/app-config.service';
import { Validators, FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'page-data-grid',
  templateUrl: 'data-grid.page.html',
  styleUrls: ['data-grid.page.scss'],
})
export class DataGridPage implements OnInit {
  showTable: boolean = false;
  gridId: number = null;
  subGridId: number = null;
  pageName: string = "";
  showSkeleton: boolean = true;

  // 
  parentTableData: any[] = [];
  tableMetaData: any[] = [];
  tableData: any[] = [];
  tableGlobalFilterFields: any[] = [];
  tableTitle: string = "";
  customFilterData: any[] = [];
  downloadData: any = [];

  jsonData: any = [];
  jsonDataFiltered: any = [];

  tableSelectedValueTrack: any = [];

  @Input() screenType;
  @Input() apiUrlAddReqMetaData: any = null;
  @Input() apiUrlCustomSearchReqMataData:any = null;
  showCustomFilterForm: boolean = false;
  customFilterfields: any;
  CustomFilterForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService,
    private appConfigService: AppConfigService,
    private fb: FormBuilder
  ) {

  }
  ngOnInit() {
    console.log("DataGridPage onInit");

   
  }

  ionViewWillEnter() {
    console.log("DataGridPage ionview enter");

    this.activatedRoute.params.subscribe(params => {
      this.gridId = null;
      this.subGridId = null;
      this.tableTitle = "";
      if (params['gridId'] !== undefined) {
        this.gridId = params['gridId'];
        console.log(" this.gridId :" + this.gridId)
        this.subGridId = params['subGridId'];
        console.log(" this.subGridId  :" + this.subGridId)
        // this.pageName  =  params['pageName'];
        // this.tableTitle =  params['pageName'];
        // if ( this.subGridId == 127) { 
        //   // add code
        //   this.showCustomFilterForm = true;
        // }else{
           // JAVA API DATA;
        this.getTableApiData();

        // }
        // JAVA API DATA;
        // this.getTableApiData();

        // setTimeout(() => {
        // this.getApiGridConfigData();          
        // }, 500);

        // this.getApiJsonData();
      } else {
        alert("gridID undefined")
      }
    });

  }

 

  // API GRID CONFIG
  getApiGridConfigData() {
    this.showSkeleton = true;
    this.showTable = false;
    this.tableData = [];
    this.parentTableData = [];
    this.tableMetaData = [];
    this.tableGlobalFilterFields = [];
    this.customFilterData = [];
    this.jsonData = [];
    this.jsonDataFiltered = [];
    this.tableSelectedValueTrack = [];
    let url = "";
    if (this.subGridId == undefined || this.subGridId == null) {
      url = "MetaDataJson/" + this.gridId + "";
    } else {
      url = "MetaDataJson/" + this.subGridId + "";
    }
    this.utilityService.showLoader();
    this.utilityService.getJsonData(url).subscribe((data: any) => {
      this.utilityService.hideLoader();
      this.jsonData = data.body;
      this.jsonDataFiltered = data.body;
      // this.setConfigForTable(data.body.tableMetaData,data.body.tableGlobalFilterFields,data.body.customFilterData);
      this.setConfigForTable();
    }, err => {
      alert("config json error" + JSON.stringify(err));
    })
  }

  getTableApiData() {
    this.showSkeleton = true;
    this.showTable = false;
    this.tableData = [];
    this.parentTableData = [];
    this.tableMetaData = [];
    this.tableGlobalFilterFields = [];
    this.customFilterData = [];
    this.jsonData = [];
    this.jsonDataFiltered = [];
    this.tableSelectedValueTrack = [];
    console.log("test clicked response ");
    let req: any = {};
    req.menuconId = +this.subGridId;
    req.gridId = ""; // NOT IN USE here as we are getting data bby menuConid
    req.langId = this.appConfigService.getLanguageId();
    req.randomKey = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
    req.transactionId = this.utilityService.getTRNTimestamp();
    req.userId = this.appConfigService.getUserData().userId;

    let url = "datagrid";
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

    this.utilityService.callPostApi(crudObj, url).then((resp: any) => {
      // decryption logic
      if (this.appConfigService.getEncryptDatabool()) {
        let decryptedData = this.appConfigService.decrypt(
              this.appConfigService.secretKey,
              resp.encryptedResponse
            );
            let fullResponse = JSON.parse(decryptedData);
            resp = fullResponse;
      } 

    let res = resp.result;

      console.log("KASTLE response " + JSON.stringify(res));

      var finalData = res[0].filterData.replace(/\\/g, "");
      console.log("KASTLE ABC PARSE " + JSON.parse(finalData));

      var finalData2 = res[0].tableConfigurationData.replace(/\\/g, "");
      console.log("KASTLE ABC PARSE 2" + JSON.parse(finalData2));

      var filterDataFieldNameLang = res[0].filterDataFieldNameLang.replace(/\\/g, "");
      console.log("KASTLE ABC PARSE 2" + JSON.parse(filterDataFieldNameLang));

      filterDataFieldNameLang

      let newArr: any = [];
      res.forEach((element: any) => {
        let newObj: any = {};

        if (element.hasOwnProperty("tableMetaData")) {
          newObj.tableMetaData = JSON.parse(element["tableMetaData"].replace(/\\/g, ""));
        }
        if (element.hasOwnProperty("tableMetaDataFieldNameLang")) {
          newObj.tableMetaDataFieldNameLang = JSON.parse(element["tableMetaDataFieldNameLang"].replace(/\\/g, ""));
        }
        if (element.hasOwnProperty("filterData")) {
          newObj.filterData = JSON.parse(element["filterData"].replace(/\\/g, ""));
        }
        if (element.hasOwnProperty("filterDataFieldNameLang")) {
          newObj.filterDataFieldNameLang = JSON.parse(element["filterDataFieldNameLang"].replace(/\\/g, ""));
        }
        if (element.hasOwnProperty("commonLangConfiguration")) {
          newObj.commonLangConfiguration = JSON.parse(element["commonLangConfiguration"].replace(/\\/g, ""));
        }
        if (element.hasOwnProperty("tableConfigurationData")) {
          newObj.tableConfigurationData = JSON.parse(element["tableConfigurationData"].replace(/\\/g, ""));
        }

        newObj['jsonTableData'] = element.jsonTableData;
        newObj['tableTitle'] = element.tableTitle;
        newArr.push(newObj);
      });

      console.log("res FINAL " + JSON.stringify(res));
      console.log("newArr FINAL " + JSON.stringify(newArr));
      this.jsonData = newArr;
      this.jsonDataFiltered = newArr;
      this.setConfigForTable();
      
      this.utilityService.setJsonTableData(newArr);

      // var finalData = res[0].filterData.replace(/\\/g, "");
      //  console.log("KASTLE ABC PARSE "+JSON.parse(finalData));
      // 
      //  let parsedata = JSON.parse(finalData)
      // console.log("KASTLE final "+JSON.stringify(parsedata));

    }, err => {
      console.log("KASTLE error " + JSON.stringify(err));
    })
  }

  // API JSON DATA
  getApiJsonData() {
    this.utilityService.showLoader();
    let url = "DummyDataJson/" + this.gridId + "";
    setTimeout(() => {
      this.utilityService.getJsonData(url).subscribe((data: any) => {
        this.showSkeleton = false;
        // this.setApiTableData(data.body);
      }, err => {
        this.showSkeleton = false;
        alert("api json error" + JSON.stringify(err));
      })
    }, 2000);

  }

  // CONFIGURATION SETUP
  setConfigForTable() {
    this.setTableExtraConfig(this.jsonData); //extra configuration e.g table name and language assigning

  }

  // extra configuration
  setTableExtraConfig(jsonData) {
    // this.tableTitle = jsonData.tableTitle;
    this.parentTableData = [];
    let counter = 0;

    this.jsonData.forEach(element => {
      counter++;
      let obj: any = {};
      // obj.tableTitle = element.tableConfigurationData.tableTitle;
      // obj.searchPlaceholder = element.tableConfigurationData.searchPlaceholder;
      // remove ternary condition later
      // if(element.changeModalTitle != undefined){
      //   obj.modalTitle = element.modalTitle;
      // }
      obj.tableTitle = element.tableTitle != undefined ? element.tableTitle : element.tableConfigurationData.tableTitle;
      obj.searchPlaceholder = element.commonLangConfiguration != undefined ? element.commonLangConfiguration.searchPlaceholder : element.tableConfigurationData.searchPlaceholder;
      obj.rowsPerPageOptions = element.tableConfigurationData.rowsPerPageOptions;
      obj.rows = element.tableConfigurationData.rows;
      obj.showSearchBar = element.tableConfigurationData.showSearchBar;
      obj.modalTitle = element.tableConfigurationData.modalTitle;
      // debugger;
      obj.changeModalTitle = element.tableConfigurationData.changeModalTitle; // eve1
      obj.showDownLoadCsv = element.tableConfigurationData.showDownLoadCsv;
      obj.showCustomFilter = element.tableConfigurationData.showCustomFilter
      obj.showDownLoadFlag = element.tableConfigurationData.showDownLoadFlag;
      obj.filterLabelMsg = element.tableConfigurationData.filterLabelMsg;
      obj.tableSelectedValue = null;
      obj.showActions = element.tableConfigurationData.showActions;
      obj.showActionsAdd = element.tableConfigurationData.showActionsAdd;
      obj.showSortIcon = element.tableConfigurationData.showSortIcon;
      obj.apiUrlAdd = element.tableConfigurationData.apiUrlAdd;
      obj.apiUrlCustomSearch = element.tableConfigurationData.apiUrlCustomSearch;
      obj.apiUrlEdit = element.tableConfigurationData.apiUrlEdit;
     
      obj.apiUrlEditSavedData = element.tableConfigurationData.apiUrlEditSavedData;
      obj.apiSaveDataUrl = element.tableConfigurationData.apiSaveDataUrl;
      obj.apiCustomSearchDataUrl = element.tableConfigurationData.apiCustomSearchDataUrl;
      obj.apiUpdateDataUrl = element.tableConfigurationData.apiUpdateDataUrl;    
      obj.apiDeleteDataUrl = element.tableConfigurationData.apiDeleteDataUrl;
      

      obj.apiSaveDataUrlReqData = element.tableConfigurationData.apiSaveDataUrlReqData;
      obj.apiCustomSearchDataUrlReqData = element.tableConfigurationData.apiCustomSearchDataUrlReqData;
      obj.apiUpdateDataUrlReqData = element.tableConfigurationData.apiUpdateDataUrlReqData;
      obj.apiDeleteDataUrlReqData = element.tableConfigurationData.apiDeleteDataUrlReqData;
     

      // dependant info
      obj.dependantGrid = element.tableConfigurationData.dependantGrid;
      obj.dependantGridMetaData = element.tableConfigurationData.dependantGridMetaData;
      obj.dependantGridReqObj = element.tableConfigurationData.dependantGridReqObj;
      obj.dependantGridUrl = element.tableConfigurationData.dependantGridUrl;

      // screen
      obj.apiUrlAddReqMetaData = element.tableConfigurationData.apiUrlAddReqMetaData;
      obj.apiUrlCustomSearchReqMataData = element.tableConfigurationData.apiUrlCustomSearchReqMataData;
      obj.apiUrlEditReqMetaData = element.tableConfigurationData.apiUrlEditReqMetaData;
      obj.apiUrlEditReqSavedData = element.tableConfigurationData.apiUrlEditReqSavedData;
      obj.apiUrlEditReqSavedDataMetaData = element.tableConfigurationData.apiUrlEditReqSavedDataMetaData;
      

      // submit valdiations
      obj.submitCustomValidation = element.tableConfigurationData.submitCustomValidation;
      obj.submitCustomValidationMetaData = element.tableConfigurationData.submitCustomValidationMetaData;
      obj.submitCustomDataManupulation = element.tableConfigurationData.submitCustomDataManupulation;
      // adding Edit and delete condition
      obj.showEdit = element.tableConfigurationData.showEdit;
      obj.showDelete = element.tableConfigurationData.showDelete;

      obj.dataKey = element.tableConfigurationData.dataKey //*** v.v.v.v.imp - without this issue will arise for ngModel
      this.setTableMetaData(element.tableMetaData, element.tableMetaDataFieldNameLang, obj); //meta data
      // this.setTableGlobalFilterFields(element.tableGlobalFilterFields,obj); //global search bar - formed in upper meta data
      this.setCustomFilterData(element.filterData, element.filterDataFieldNameLang, obj) // custom filter   
      this.setApiTableData(element.jsonTableData, obj, counter, this.jsonData.length)
      this.parentTableData.push(obj);

      if (this.jsonData.length == counter) {
        // this.showSkeleton = false;
        // this.showTable = true; // table gets inside DOM because of this.
      }
      this.showSkeleton = false;
      this.showTable = true;

      // get nested GridData
    });



    // this.setTableMetaData(this.jsonData.tableMetaData); //meta data
    // this.setTableGlobalFilterFields(this.jsonData.tableGlobalFilterFields); //global search bar
    // this.setCustomFilterData(this.jsonData.customFilterData) // custom filter
  }

  // JSON DATA SETUP
  setApiTableData(data, obj, externalCounter, tableLength) {
    this.setTableData(data, obj, externalCounter, tableLength);
  }


  setTableData(data, obj, externalCounter, tableLength) {
    obj.tableData = [];

    let innercounter = 0;


    data.forEach(element => {


      obj.tableMetaData.forEach(innerEle => {
        if (innerEle.bodyType == "currencyText") {
          var innerobj = {
            "currencyValue": element[innerEle.field],
            "currencyLabel": (element.currencyLabel == undefined || element.currencyLabel == '') ? this.appConfigService.getDomesticCurrencyLabel() : element.currencyLabel  //element.currency
          }
          element[innerEle.field] = innerobj
        }
        // show delete added from here
        if (innerEle.bodyType == "actionsText") {
          var innerActobj = {
            "showEdit": (obj.showEdit != undefined) ? obj.showEdit : true,
            "showDelete": (obj.showDelete != undefined) ? obj.showDelete : true
          }
          element[innerEle.field] = innerActobj
        }

        // if()

      });

      if (obj.showActions) {
        element
      }


      // var innerobj = {
      //   "currencyValue": element.requestedAmt,
      //   "currencyLabel": (element.currencyLabel == undefined || element.currencyLabel == '' ) ? this.appConfigService.getDomesticCurrencyLabel() : element.currencyLabel  //element.currency
      // }
      // element.requestedAmt = innerobj
      element['roh_id'] = innercounter;
      // radio button
      element['radioBoxText'] = true,
        element['cancelApplication'] = true;

      // store 1st records info to show selected Radio Button and assign to tableSelectedValue
      if (innercounter == 0) {
        this.tableSelectedValueTrack.push(element);
        obj.tableSelectedValue = element;
      }


      innercounter++;
    });
    console.log("after for loop logg >>>>>>>>>>>", JSON.stringify(data))
    obj.downloadData = [];
    obj.tableData = data
    console.log("tableData", JSON.stringify(this.tableData))

    // alert("tableLength"+tableLength);
    // alert("externalCounter"+externalCounter);
    //  get nested table data
    if (this.jsonData.length > 1) {
      if (tableLength == externalCounter) {
        if (this.tableSelectedValueTrack.length > 0) {
          // boolean which show or hide trans table
          //  let hideTransTable = this.jsonData[0].tableConfigurationData.hideTransTable;  //get from json
          // if(hideTransTable != undefined && hideTransTable){
          //   // var arrayElements = this.jsonData;
          //   const index = this.jsonData.indexOf();
          //   this.jsonData.forEach((element,index)=>{
          //     if(element==1) this.jsonData.splice(index,1);
          //     alert(JSON.stringify(this.jsonData))
          //  });
          //   // this.jsonData= delete this.jsonData[1];// one potion data is delete from array
          // } else{
          //   this.getTableJsonDataByMetaData(this.tableSelectedValueTrack[0], obj);
          // }
          // call nested data api and assign to jsonTableData property
          this.getTableJsonDataByMetaData(this.tableSelectedValueTrack[0], obj);
        }
      }
    }


    // check download flag PENDING
    if (obj.showDownLoadFlag) {
      this.setDownloadedData(this.tableData, obj);
    }

    // this.showTable = true; // table gets inside DOM because of this.
  }

  // META DATA
  setTableMetaData(tableMetaData, tableMetaDataFieldNameLang, obj) {
    //  this.tableMetaData = tableMetaData
    // adding radio button
    // let a :any= { field: 'radioBoxText', header: '', headerType: 'text', bodyType: 'radioBoxText' };
    // tableMetaData.push(a);

    obj.tableGlobalFilterFields = [];
    for (var val of tableMetaData) {
      if (val.bodyType == "currencyText") { // global filters logic
        obj.tableGlobalFilterFields.push(val.field + ".currencyValue");
        obj.tableGlobalFilterFields.push(val.field + ".currencyLabel");
      } else {
        obj.tableGlobalFilterFields.push(val.field);
      }
      for (var innerVal of tableMetaDataFieldNameLang) {
        if (val.field == innerVal.field) {
          val.header = innerVal.header;
          break;
        }
      }
    }


    JSON.stringify("tableMetaData" + tableMetaData, null, 2);
    obj.tableMetaData = tableMetaData;
  }

  // TABLE GLOBAL SEARCH
  setTableGlobalFilterFields(tableGlobalFilterFields, obj) {
    // this.tableGlobalFilterFields =     tableGlobalFilterFields
    obj.tableGlobalFilterFields = tableGlobalFilterFields;
  }

  // Customer filter
  setCustomFilterData(customFilterData, filterDataFieldNameLang, obj) {
    // this.customFilterData = customFilterData;
    for (var custVal of customFilterData) {
      for (var custinnerVal of filterDataFieldNameLang) {
        if (custVal.tableMetaDataField == custinnerVal.tableMetaDataField) {
          custVal.title = custinnerVal.title;
          custVal.placeholder = custinnerVal.placeholder;
          break;
        }
      }
    }
    JSON.stringify("FilterData " + customFilterData, null, 2);
    obj.customFilterData = customFilterData;
  }

  // DOWNLOAD DATA
  setDownloadedData(data, obj) {
    obj.downloadData = obj.tableData;
    let filterData: any = []
    // data.forEach(element => {
    //   let obj: any = {}
    //   if (element.hasOwnProperty('appNo')) {
    //     obj['App No'] = element.appNo;
    //   }
    //   if (element.hasOwnProperty('customerName')) {
    //     obj['Customer Name'] = element.customerName;
    //   }
    //   if (element.hasOwnProperty('productName')) {
    //     obj['Product Name'] = element.productName;
    //   }
    //   if (element.hasOwnProperty('requestedAmount')) {
    //     obj['Requested Amount'] = element.requestedAmount.currencyLabel +
    //       " " + element.requestedAmount.currencyValue;
    //   }
    //   if (element.hasOwnProperty('tenure')) {
    //     obj['Tenure'] = element.tenure
    //   }
    //   filterData.push(obj);
    // });
    // this.downloadData = filterData
    console.log("downloadData", this.downloadData)
  }

  onEdit(data) {

  }
  onAdd() {

  }

  popupClose(data) {
    setTimeout(() => {
      this.getTableApiData();
    }, 100);
  }

  onCancelApplication(data) {

  }

  changeLang(val) {
    if (val == "eng") {
      this.appConfigService.setLanguage(this.appConfigService.engish_lang);
    } else if (val == "hin") {
      this.appConfigService.setLanguage(this.appConfigService.hindi_lang);
    } else if (val == "ara") {
      this.appConfigService.setLanguage(this.appConfigService.arabic_lang);
    }
    this.getApiGridConfigData();
    this.getApiJsonData();
  }

  metaArr = [
    {
      fieldName: "app",
      header: ''
    },
    {
      fieldName: "dob",
      header: ''
    }
  ];

  transOBj = [{ fieldName: "app", header: "Rohit", age: "27" }, { fieldName: "dob", header: "Rohit2", age: "28" }]

  dummyTest() {
    for (let val of this.metaArr) {
      for (let innerVal of this.transOBj) {
        if (val.fieldName == innerVal.fieldName) {
          val.header = innerVal.header;
          break;
        }
      }
    }
    JSON.stringify("whoel obj " + this.metaArr, null, 2);
  }

  onSelect(selectedTableData, index) {
    console.log("selectedTableData " + JSON.stringify(selectedTableData.data));
    if (this.parentTableData.length > 1) {
      if (index == 0) {
        let newIndex = index + 1;
        let obj = this.parentTableData[newIndex];
        obj.tableData = [];
        console.log("table object " + JSON.stringify(obj));
        this.getTableJsonDataByMetaData(selectedTableData.data, obj);
      }
    }
    // if(index == 0){
    //   let newIndex = index + 1; 
    //   let obj = this.parentTableData[newIndex];
    //   obj.tableData = [];
    //   console.log("table object "+JSON.stringify(obj));
    //   this.getTableJsonDataByMetaData(selectedTableData.data,obj);
    // }
    // let obj = this.parentTableData[index];
    // console.log("table object "+JSON.stringify(obj));
    // this.getTableJsonDataByMetaData(selectedTableData.data,obj);
  }

  onUnSelect(unSelectedTableData) {
    console.log("unSelectedTableData " + JSON.stringify(unSelectedTableData.data));
  }

  getTableJsonDataByMetaData(selectedObj, obj) {
    let reqObj: any = {};

    if (obj.dependantGrid != undefined &&
      obj.dependantGridReqObj != undefined &&
      obj.dependantGridMetaData != undefined &&
      obj.dependantGridUrl != undefined &&
      obj.dependantGrid &&
      obj.dependantGridUrl != "") {

      obj.dependantGridMetaData.forEach(element => {
        for (let [key, value] of Object.entries(selectedObj)) {
          if (element.fieldMapping == key) {
            element.value = value;
            reqObj[element.reqKeyName] = element.value;
          }
        }
      });
      console.log("reqObj " + JSON.stringify(reqObj));
      console.log("OLD dependantGridReqObj " + JSON.stringify(obj.dependantGridReqObj));
      // attach to dependantGridReqObj
      // obj.dependantGridReqObj = {...reqObj};
      // console.log("FINAL REQUEST OBJECT "+JSON.stringify(obj.dependantGridReqObj));

    } else {
      // alert("Nested Grid - Dependant information not configured properly")
      return;
    }

    let reqApiReqObj = {
      ...obj.dependantGridReqObj,
      ...reqObj
    };
    console.log("FINAL BODY " + JSON.stringify(reqApiReqObj));
    let url = obj.dependantGridUrl;
    this.getApiDataJson(reqApiReqObj, url, obj);

  }

  getApiDataJson(reqApiReqObj, url, obj) {
    reqApiReqObj.randomKey = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
    reqApiReqObj.transactionId = this.utilityService.getTRNTimestamp();
    reqApiReqObj.userId = this.appConfigService.getUserData().userId;

    let crudObj :any = {};
    if (this.appConfigService.getEncryptDatabool()) {
      let newData = this.appConfigService.encrypt(this.appConfigService.secretKey, reqApiReqObj);
      crudObj['encryptedRequest'] = newData;
      crudObj['randomKey'] = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
    } else {
      crudObj = reqApiReqObj;
      crudObj['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }

    this.utilityService.callPostApi(crudObj, url).then((resp: any) => {
      // decryption logic
      if (this.appConfigService.getEncryptDatabool()) {
        let decryptedData = this.appConfigService.decrypt(
              this.appConfigService.secretKey,
              resp.encryptedResponse
            );
            let fullResponse = JSON.parse(decryptedData);
            resp = fullResponse;
      } 
    let res = resp.result;

      console.log("KASTLE response " + JSON.stringify(res));
      // this.parentTableData[1].tableData = res;
      this.assignDataToNestedTable(res, obj);
    }, err => {
      console.log("KASTLE error " + JSON.stringify(err));
    })
  }

  assignDataToNestedTable(res, obj) {
    // this.parentTableData[1].tableData = res;
    this.setTableData(res, obj, 1, 2) // 1 and 2 coz it should not match,else it will call nested api continous
  }
  // meta data test
  genkeyId = 1;
  test2() {
    this.genkeyId++;
    console.log("test clicked response ");
    let req: any = {};
    req['queryId'] = "2";
    req[':genkeyid'] = this.genkeyId + "";

    //     :genkeyDescription: "Home Loan"
    // :genkeyid: "100"
    // queryId: "2"
    // transactionId: "1234"

    let url = "querydata-by-queryid-metadata";
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

    this.utilityService.callPostApi(crudObj, url).then((resp: any) => {
      // decryption logic
      if (this.appConfigService.getEncryptDatabool()) {
        let decryptedData = this.appConfigService.decrypt(
              this.appConfigService.secretKey,
              resp.encryptedResponse
            );
            let fullResponse = JSON.parse(decryptedData);
            resp = fullResponse;
      } 
    let res = resp.result;

      console.log("KASTLE response " + JSON.stringify(res));
      // let a :any = JSON.stringify(res);
      // let abc = JSON.parse(res[0]);
      // var finalData = res[0].filterData.replace(/\\/g, "");
      //  console.log("KASTLE ABC PARSE "+JSON.parse(finalData));
      //  let parsedata = JSON.parse(finalData)
      // console.log("KASTLE final "+JSON.stringify(parsedata));
      // let xyz = JSON.stringify(abc);
      // console.log("KASTLE XYZ STRNGIFY "+JSON.stringify(xyz));
    }, err => {
      console.log("KASTLE error " + JSON.stringify(err));
    })
  }

  onDelete(data, apiDeleteDataUrlReqData, url) {
    // alert("call delete api "+JSON.stringify(data));
    // alert("apiDeleteDataUrlReqData "+JSON.stringify(apiDeleteDataUrlReqData))
    // extract data.id 
    let req: any = {
      ...apiDeleteDataUrlReqData,
    };

    // req[":id"] = data.id;
    // req[":" + 'updatedBy'] = 1;
    // req[":" + 'updatedDate'] = `'${this.appConfigService.getDate()}'`;
    // req[":" + 'status'] = "'X'";


    req["@id"] = data.id;
    req["@" + 'updatedBy'] = 1;
    req["@" + 'updatedDate'] = `'${this.appConfigService.getDate()}'`;
    req["@" + 'status'] = "'X'";
    req.randomKey = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
    req.transactionId = this.utilityService.getTRNTimestamp();
    req.userId = this.appConfigService.getUserData().userId;

    // alert("REQ "+JSON.stringify(req));


    // let url = "querydata-by-queryid-metadata-delete";
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

    this.utilityService.callPostApi(crudObj, url).then((resp: any) => {
      // decryption logic
      if (this.appConfigService.getEncryptDatabool()) {
        let decryptedData = this.appConfigService.decrypt(
              this.appConfigService.secretKey,
              resp.encryptedResponse
            );
            let fullResponse = JSON.parse(decryptedData);
            resp = fullResponse;
      } 
    let res = resp.result;
      console.log("KASTLE response " + JSON.stringify(res));
      if(res.error){
        this.utilityService.showToast('error', 'Internal Server Error');
      }else{
  // call table again
  this.showSkeleton = true;
  this.showTable = false;
  this.utilityService.showToast('success', 'Record deleted successfully');
  setTimeout(() => {
    this.getTableApiData();
  }, 100);
      }
    

    }, err => {
      console.log("KASTLE error " + JSON.stringify(err));
      // call table again
      this.showSkeleton = true;
      this.showTable = false;
      setTimeout(() => {
        this.getTableApiData();
      }, 100);
    })
  }

  // querydata-by-gridid
  // let parentControls = control['_parent']['controls'];
  //   return Object.keys(parentControls).find(name => control == parentControls[name]);
}