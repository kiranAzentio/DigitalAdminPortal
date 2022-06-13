import { Component, OnInit, Output, EventEmitter, Input, ViewContainerRef, ComponentFactoryResolver,ViewChild, OnChanges } from '@angular/core';
import { NavController, PopoverController, NavParams, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginLayout1Page } from '../login-layout-1/login-layout-1.page';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import * as moment from 'moment';
import { Table } from 'primeng/table';

@Component({
  selector: 'digital-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.scss'],
})
export class CommonPopupComponent implements OnInit, OnChanges {
  @ViewChild('dt') table: Table;
  
  @Input() data;
  @Input() title;
  @Input() apiJsonName;
  @Input() buttonName;
  buttonName2;
  @Input() screenType;
  @Input() apiUrlEditSavedData;
  @Output() onOutput = new EventEmitter();

  @Output() customfilterFormData = new EventEmitter();
  // @Input() isDuplicate;

  isFormSubmitted: boolean = false;
  parentThis: any = null;
  showSkeleton: boolean = true;
  show: boolean = false;

  dynamicForm: FormGroup;
  fields = [];

  formArrayKeyNameTrackArr: any[] = [];
  jsonFormArrayTrack: any[] = [];
  apiUrlAddReqMetaData: any = null;
  apiUrlCustomSearchReqMataData:any = null;
  apiUrlEditReqMetaData: any = null;
  apiUrlEditReqSavedDataMetaData: any = null;
  apiUrlEditReqSavedData: any = null;


  apiSaveDataUrlReqData: any = null;
  apiCustomSearchDataUrlReqData: any = null;
  apiUpdateDataUrlReqData: any = null;
  apiDeleteDataUrlReqData: any = null;
  apiCustomSearchUrlReqData: any = null;

  apiSaveDataUrl: any = null;
  apiCustomSearchDataUrl: any = null;
  apiUpdateDataUrl: any = null;

  submitCustomValidation: boolean = false;
  submitCustomValidationMetaData: any = null;
  submitCustomDataManupulation: any = null;
  modalTitle: any = null;

  ConvertedselectedFromDate: any;
  ConvertedselectedStartDate: any;
  submitData: any;
  changeModalTitle: any;

  constructor(
    public navController: NavController,
    public translateService: TranslateService,
    private navParams: NavParams,
    private router: Router, private popoverController: PopoverController,
    private modalController: ModalController,
    private cvRef: ViewContainerRef, private resolver: ComponentFactoryResolver,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private appConfig: AppConfigService

  ) {
    this.data = this.navParams.get('data');
    this.title = this.navParams.get('title');
    this.modalTitle = this.navParams.get('modalTitle');
    this.changeModalTitle = this.navParams.get('changeModalTitle');
    this.apiJsonName = this.navParams.get('apiJsonName');
    // this.buttonName = this.navParams.get('buttonName');
    this.screenType = this.navParams.get('screenType');
    this.apiUrlEditSavedData = this.navParams.get('apiUrlEditSavedData');
    this.apiUrlAddReqMetaData = this.navParams.get('apiUrlAddReqMetaData');
    this.apiUrlCustomSearchReqMataData  = this.navParams.get('apiUrlCustomSearchReqMataData ');
    this.apiUrlEditReqMetaData = this.navParams.get('apiUrlEditReqMetaData');
    this.apiUrlEditReqSavedDataMetaData = this.navParams.get('apiUrlEditReqSavedDataMetaData');
    this.apiUrlEditReqSavedData = this.navParams.get('apiUrlEditReqSavedData');

    this.apiSaveDataUrlReqData = this.navParams.get('apiSaveDataUrlReqData');
    this.apiCustomSearchDataUrlReqData = this.navParams.get('apiCustomSearchDataUrlReqData');
    this.apiUpdateDataUrlReqData = this.navParams.get('apiUpdateDataUrlReqData');
    this.apiDeleteDataUrlReqData = this.navParams.get('apiDeleteDataUrlReqData');
    
    
    this.apiSaveDataUrl = this.navParams.get('apiSaveDataUrl');
    this.apiCustomSearchDataUrl = this.navParams.get('apiCustomSearchDataUrl');
    this.apiUpdateDataUrl = this.navParams.get('apiUpdateDataUrl');

    this.submitCustomValidation = this.navParams.get('submitCustomValidation');
    this.submitCustomValidationMetaData = this.navParams.get('submitCustomValidationMetaData');
    this.submitCustomDataManupulation = this.navParams.get('submitCustomDataManupulation');

    if (this.screenType == "add") {
      // this.getApiJsonData();
      // DUMMY JSON CALL
      // this.getApiJsonData();
      // java api CALL
      this.buttonName = "Save";
      this.buttonName2 = "Save";
      this.getScreenData();
    } else if(this.screenType == "edit") { //edit
      this.buttonName = "Update";
      this.buttonName2 = "Update";
      // get edit screen data and then call config url
      if (this.apiUrlEditSavedData == undefined) {
        // DUMMY JSON CALL
        // this.getApiJsonData();
        // java api CALL
        this.getScreenData( );
      } else {
        // DUMMY JSON
        // this.getEditScreenSavedConfigData();

        // JAVA API CALL
        this.getEditScreenSavedConfigDataApi();
      }
    }else if(this.screenType == "customFilter"){
      
      this.buttonName = "Search";
      this.buttonName2 = "Search";
      this.getScreenData();
    }
    this.parentThis = this;
   
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    // this.data = changes['data'].currentValue;
  }
  async getEditScreenSavedConfigDataApi() {

    this.formArrayKeyNameTrackArr = []; // this is very important *** for showing mutiple form array fields pre populated
    this.showSkeleton = true;

    let obj1: any = {};
    if (this.apiUrlEditReqMetaData != null) {
      for (let [key, value] of Object.entries(this.apiUrlEditReqMetaData)) {
        if (key == "langId") {
          obj1[key] = this.appConfig.getLanguageId();// get from appconfig
        } else {
          obj1[key] = value;
        }

        // if (key == "days") {
        //   obj1[key] = 30;// get from appconfig
        // } else {
        //   obj1[key] = value;
        // }

      }
    } else {
      alert("no api meta data present for screen");
    }


    let url1 = this.apiJsonName;
    obj1.randomKey = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    obj1.transactionId = this.utilityService.getTRNTimestamp();
    obj1.userId = this.appConfig.getUserData().userId;
    console.log("obj1 " + JSON.stringify(obj1));

    let crudObj :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, obj1);
      crudObj['encryptedRequest'] = newData;
      crudObj['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj = obj1;
      crudObj['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }

    debugger;
    let resp: any = await this.utilityService.callPostApi(crudObj, url1);
    // decryption logic
    if (this.appConfig.getEncryptDatabool()) {
      let decryptedData = this.appConfig.decrypt(
            this.appConfig.secretKey,
            resp.encryptedResponse
          );
          let fullResponse = JSON.parse(decryptedData);
          resp = fullResponse;
    } 

    const editScreenConfigData = resp.result;

    console.log("editScreenConfigData222222222 " + JSON.stringify(editScreenConfigData));


    let newEditScreenConfigArr: any = [];

    if (editScreenConfigData.length > 0) {
      try {
        var tableMetaData = editScreenConfigData[0].tableMetaData.replace(/\\/g, "");
        console.log("KASTLE ABC PARSE " + JSON.parse(tableMetaData));
      } catch (e) {
        alert("Inside KDB_SCREEN_CONFIG_MASTER's TABLEMETADATA1/2 column json is not properly formed");
      }
      try {
        var onSubmitMetaDataCheck = editScreenConfigData[0].onSubmitMetaDataCheck.replace(/\\/g, "");
        console.log("KASTLE ABC PARSE " + JSON.parse(onSubmitMetaDataCheck));
      } catch (e) {
        alert("Inside KDB_SCREEN_CONFIG_MASTER's EXTRA1 column json is not properly formed");
      }
      try {
        var tableMetaDataFieldNameLang = editScreenConfigData[0].tableMetaDataFieldNameLang.replace(/\\/g, "");
        console.log("KASTLE ABC PARSE " + JSON.parse(tableMetaDataFieldNameLang));
      } catch (e) {
        alert("Inside KDB_SCREEN_CONFIG_MASTER_TRNS's META_FIELD_NAME_LANG1/2/3/4 column json is not properly formed");
      }
      editScreenConfigData.forEach((element: any) => {
        let newObj: any = {};

        if (element.hasOwnProperty("tableMetaData")) {
          newObj.tableMetaData = JSON.parse(element["tableMetaData"].replace(/\\/g, ""));
        }
        if (element.hasOwnProperty("onSubmitMetaDataCheck")) {
          newObj.onSubmitMetaDataCheck = JSON.parse(element["onSubmitMetaDataCheck"].replace(/\\/g, ""));
        }
        if (element.hasOwnProperty("tableMetaDataFieldNameLang")) {
          newObj.tableMetaDataFieldNameLang = JSON.parse(element["tableMetaDataFieldNameLang"].replace(/\\/g, ""));
        }
        newEditScreenConfigArr.push(newObj);
      });

      console.log("FINAL fullData" + JSON.stringify(newEditScreenConfigArr));

    } else {
      this.utilityService.showToast('error', 'No data present');
    }


    // ----------------------------- SAVED DATA-------------------------------------------------------------
    let obj2: any = {};
    let reqObj: any = {};

    if (this.apiUrlEditReqSavedDataMetaData != null) {
      this.apiUrlEditReqSavedDataMetaData.forEach(element => {
        for (let [key, value] of Object.entries(this.data)) {
          if (element.fieldMapping == key) {
            element.value = value;
            reqObj[element.reqKeyName] = element.value;
          }
        }
      });
    } else {
      alert("no api meta data present for screen");
    }
    // obj2 = {
    //   ...this.apiUrlEditReqSavedData,
    //   ...reqObj
    // }

    var finalReqArr: any = [];
    finalReqArr = JSON.parse(JSON.stringify(this.apiUrlEditReqSavedData));
    finalReqArr.forEach((element: any) => {
      for (let [key, value] of Object.entries(reqObj)) {
        element[key] = value;
      }
    });
    console.log("finalReqArr " + JSON.stringify(finalReqArr));

    obj2.data = finalReqArr;
    console.log("obj2 " + JSON.stringify(obj2));

    // let url2 = "MetaDataJson/" + this.apiJsonName + "";
    // const editScreenConfigData = await this.utilityService.getJsonDataPROMISE(url2);


    let url2 = this.apiUrlEditSavedData;
    let modObj = {
      randomKey : this.appConfig.rsa_encrypt(this.appConfig.getSecret()),
      transactionId : this.utilityService.getTRNTimestamp(),
      userId : this.appConfig.getUserData().userId,
      dataArray:finalReqArr
    }
    debugger;
    let crudObj2 :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, modObj);
      crudObj2['encryptedRequest'] = newData;
      crudObj2['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj2 = modObj;
      crudObj2['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }
    
    let resp1: any = await this.utilityService.callPostApi(crudObj2, url2);
     // decryption logic
     if (this.appConfig.getEncryptDatabool()) {
      let decryptedData = this.appConfig.decrypt(
            this.appConfig.secretKey,
            resp.encryptedResponse
          );
          let fullResponse = JSON.parse(decryptedData);
          resp1 = fullResponse;
    } 
    const editScreenSavedData = resp1.result
    console.log("editScreenSavedData " + JSON.stringify(editScreenSavedData));

    let newsavedDataObj: any = {};

    let arrayKeyName = "";
    let newSavedArr: any = [];
    for (let [key, value] of Object.entries(editScreenSavedData)) {
      if (key != "singleLevel") {
        arrayKeyName = key;
        newSavedArr = value;
      }
    }
    if (editScreenSavedData.singleLevel != undefined) {
      newsavedDataObj = {
        ...editScreenSavedData.singleLevel[0],
      }
      newsavedDataObj[arrayKeyName] = newSavedArr;
    }

    console.log("newsavedDataObj " + JSON.stringify(newsavedDataObj));

    this.showSkeleton = false;
    let newJsonArr: any[] = [];
    this.jsonFormArrayTrack = [];

    // if(editScreenSavedData.length > 0){
    for (let [key, value] of Object.entries(newsavedDataObj)) {
      console.log(`${key}: ${value}`);
      let obj: any = {};
      obj.fieldJsonMapping = key;
      obj.value = value
      if (Array.isArray(obj.value)) {
        this.jsonFormArrayTrack = obj.value;
        this.formArrayKeyNameTrackArr.push(key) //used at end of form for showing mutiple fields
        let firstElecounter = 0;
        let newValArr: any = [];
        obj.value.forEach(element => {
          let newValArrInner: any = [];
          // if(firstElecounter == 0){ // take only first element as it is used to create form array and remaining data is added at last
          for (let [innerkey, innervalue] of Object.entries(element)) {
            let innerobj: any = {};
            innerobj.fieldJsonMapping = innerkey;
            innerobj.value = innervalue;
            newValArrInner.push(innerobj);
          }
          newValArr.push(newValArrInner);
          // }
          firstElecounter++;
          obj.value = newValArr;
        });
      }
      console.log("new obj " + JSON.stringify(obj));
      newJsonArr.push(obj);
    }
    // }else{
    // alert("edit screen data not present");
    // }

    console.log("newJsonArr " + JSON.stringify(newJsonArr));
    this.data = null;
    this.data = newJsonArr;
    console.log("data " + JSON.stringify(this.data));

    if (newEditScreenConfigArr.length > 0) {
      this.createForm(newEditScreenConfigArr);
    } else {
      alert("edit screen config not present");
    }

  }

  async getEditScreenSavedConfigData() {

    this.formArrayKeyNameTrackArr = []; // this is very important *** for showing mutiple form array fields pre populated
    this.showSkeleton = true;
    let url1 = "MetaDataJson/" + this.apiUrlEditSavedData + "";
    const editScreenSavedData = await this.utilityService.getJsonDataPROMISE(url1);
    console.log("editScreenSavedData " + JSON.stringify(editScreenSavedData));

    let url2 = "MetaDataJson/" + this.apiJsonName + "";
    const editScreenConfigData = await this.utilityService.getJsonDataPROMISE(url2);
    console.log("editScreenConfigData222222222 " + JSON.stringify(editScreenConfigData));
    this.showSkeleton = false;
    let newJsonArr: any[] = [];
    this.jsonFormArrayTrack = [];

    for (let [key, value] of Object.entries(editScreenSavedData)) {
      console.log(`${key}: ${value}`);
      let obj: any = {};
      obj.fieldJsonMapping = key;
      obj.value = value
      if (Array.isArray(obj.value)) {
        this.jsonFormArrayTrack = obj.value;
        this.formArrayKeyNameTrackArr.push(key) //used at end of form for showing mutiple fields
        let firstElecounter = 0;
        let newValArr: any = [];
        obj.value.forEach(element => {
          let newValArrInner: any = [];
          // if(firstElecounter == 0){ // take only first element as it is used to create form array and remaining data is added at last
          for (let [innerkey, innervalue] of Object.entries(element)) {
            let innerobj: any = {};
            innerobj.fieldJsonMapping = innerkey;
            innerobj.value = innervalue;
            newValArrInner.push(innerobj);
          }
          newValArr.push(newValArrInner);
          // }
          firstElecounter++;
          obj.value = newValArr;
        });
      }
      console.log("new obj " + JSON.stringify(obj));
      newJsonArr.push(obj);
    }
    console.log("newJsonArr " + JSON.stringify(newJsonArr));
    this.data = newJsonArr;
    console.log("data " + JSON.stringify(this.data));

    this.createForm(editScreenConfigData);

  }

  getScreenData() {
    // screenconfig
    let req: any = {};
    if (this.apiUrlAddReqMetaData != null && this.screenType == 'add') {
      for (let [key, value] of Object.entries(this.apiUrlAddReqMetaData)) {
        if (key == "langId") {
          req[key] = this.appConfig.getLanguageId();// get from appconfig
        } else {
          req[key] = value;
        }

        // if(key == "days")
        // {
        //   req[key] = 30; 
        // }else{
        //   req[key] = value;
        // }

      }

    }else if(this.apiUrlCustomSearchReqMataData  != null && this.screenType == "customFilter"){
      for (let [key, value] of Object.entries(this.apiUrlCustomSearchReqMataData )) {
        if (key == "langId") {
          req[key] = 1;// get from appconfig
        } else {
          req[key] = value;
        }
      }
    } else {
      alert("no api meta data present for screen");
    }
    // req.screenConfigId = 1;
    // req.langId = 1;
    // let url = "screenconfig";
    let url = this.apiJsonName;
    req.randomKey = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    req.transactionId = this.utilityService.getTRNTimestamp();
    req.userId = this.appConfig.getUserData().userId;
    debugger;
    let crudObj2 :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, req);
      crudObj2['encryptedRequest'] = newData;
      crudObj2['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj2 = req;
      crudObj2['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }

    this.utilityService.callPostApi(crudObj2, url).then((resp: any) => {
        // decryption logic
     if (this.appConfig.getEncryptDatabool()) {
      let decryptedData = this.appConfig.decrypt(
            this.appConfig.secretKey,
            resp.encryptedResponse
          );
          let fullResponse = JSON.parse(decryptedData);
          resp = fullResponse;
    } 
    let res = resp.result;
      console.log("KASTLE response " + JSON.stringify(res));
      this.showSkeleton = false;

      if (res.length > 0) {

        try {
          var tableMetaData = res[0].tableMetaData.replace(/\\/g, "");
          console.log("KASTLE ABC PARSE " + JSON.parse(tableMetaData));
        } catch (e) {
          alert("Inside KDB_SCREEN_CONFIG_MASTER's TABLEMETADATA1/2 column json is not properly formed");
        }
        try {
          var onSubmitMetaDataCheck = res[0].onSubmitMetaDataCheck.replace(/\\/g, "");
          console.log("KASTLE ABC PARSE " + JSON.parse(onSubmitMetaDataCheck));
        } catch (e) {
          alert("Inside KDB_SCREEN_CONFIG_MASTER's EXTRA1 column json is not properly formed");
        }
        try {
          var tableMetaDataFieldNameLang = res[0].tableMetaDataFieldNameLang.replace(/\\/g, "");
          console.log("KASTLE ABC PARSE " + JSON.parse(tableMetaDataFieldNameLang));
        } catch (e) {
          alert("Inside KDB_SCREEN_CONFIG_MASTER_TRNS's META_FIELD_NAME_LANG1/2/3/4 column json is not properly formed");

        }

        let newArr: any = [];
        res.forEach((element: any) => {
          let newObj: any = {};

          if (element.hasOwnProperty("tableMetaData")) {
            newObj.tableMetaData = JSON.parse(element["tableMetaData"].replace(/\\/g, ""));
          }
          if (element.hasOwnProperty("onSubmitMetaDataCheck")) {
            newObj.onSubmitMetaDataCheck = JSON.parse(element["onSubmitMetaDataCheck"].replace(/\\/g, ""));
          }
          if (element.hasOwnProperty("tableMetaDataFieldNameLang")) {
            newObj.tableMetaDataFieldNameLang = JSON.parse(element["tableMetaDataFieldNameLang"].replace(/\\/g, ""));
          }
          newArr.push(newObj);
        });

        console.log("FINAL fullData" + JSON.stringify(newArr));
        this.createForm(newArr);

      } else {
        this.utilityService.showToast('error', 'No data present');
      }

    }, err => {
      this.showSkeleton = false;
      console.log("error while fetching screen data");
    });
  }
  // API JSON CONFIG DATA
  getApiJsonData() {
    this.showSkeleton = true;
    this.utilityService.showLoader();
    let url = "MetaDataJson/" + this.apiJsonName + "";
    setTimeout(() => {
      this.utilityService.getJsonData(url).subscribe((data: any) => {
        this.utilityService.hideLoader();
        this.showSkeleton = false;
        // this.fields = data.body;
        let fullData = [];
        fullData = data.body;
        // this.setApiTableData(data.body);
        this.createForm(fullData);
      }, err => {
        this.utilityService.hideLoader();
        this.showSkeleton = false;
        alert("api json error" + JSON.stringify(err));
      })
    }, 500);

  }

  createForm(fullData) {

    fullData.forEach(fullEle => {
      for (var val of fullEle.tableMetaData) {
        for (var innerVal of fullEle.tableMetaDataFieldNameLang) {
          if (val.fieldJsonMapping == innerVal.fieldJsonMapping) {
            val.label = innerVal.label;
            val.placeholder = innerVal.placeholder;
            // add stuff more for single level

            // handling nested object
            if (val.type == "array") {
              if (val.fieldArrayNestedData != undefined && val.fieldArrayNestedData != null && val.fieldArrayNestedData.length > 0) {
                val.fieldArrayNestedData.forEach(nestedEle => {
                  if (innerVal.fieldArrayNestedDataNameLang != undefined && innerVal.fieldArrayNestedDataNameLang != null && innerVal.fieldArrayNestedDataNameLang.length > 0) {
                    innerVal.fieldArrayNestedDataNameLang.forEach(nestedEleLang => {
                      if (nestedEle.fieldJsonMapping == nestedEleLang.fieldJsonMapping) {
                        nestedEle.label = nestedEleLang.label;
                        nestedEle.placeholder = nestedEleLang.placeholder;
                        // nested valdations
                        // assign nested validations
                        if (nestedEle.validations != undefined && nestedEle.validations != null && nestedEle.validations.length > 0) {
                          let nestedcounter = 0;
                          if (nestedEleLang.validations != undefined && nestedEleLang.validations != null && nestedEleLang.validations.length > 0) {
                            for (var nestedvalEle of nestedEleLang.validations) {
                              nestedEle.validations[nestedcounter].message = nestedvalEle;
                              nestedcounter++;
                            }
                          }
                        }
                      }
                      // add stuff more for nested form array level
                    });


                  }
                });
              }
            }
            if (innerVal.fieldArrayNestedDataNameLang != undefined && innerVal.fieldArrayNestedDataNameLang != null && innerVal.fieldArrayNestedDataNameLang.length > 0) {
              //  not in use
            } else {
              let counter = 0;
              for (var valEle of innerVal.validations) {
                val.validations[counter].message = valEle;
                counter++;
              }
              break; // check this or comment it***
            }
          }
        }
      }
    });

    console.log("full formated data " + fullData);
    if (fullData.length > 0) {
      this.fields = fullData[0].tableMetaData;
      // localStorage.setItem('CustomFilterFormData', 'this.fields');
      localStorage.setItem('CustomFilterFormData',JSON.stringify(this.fields));    
    }

    const controls = {};

    this.fields.forEach(res => {
      if (this.screenType == 'edit') {
        // alert("this.data :"+ JSON.stringify(this.data))
        this.data.forEach(innerEle => {
          // alert("res.fieldJsonMapping :"+ res.fieldJsonMapping)
          // alert("innerEle.fieldJsonMapping :"+ innerEle.fieldJsonMapping)
          if (res.fieldJsonMapping == innerEle.fieldJsonMapping) {
            // alert("Array.isArray(innerEle.value) :"+ Array.isArray(innerEle.value))
            if (Array.isArray(innerEle.value)) { //check array over here
              res.fieldArrayNestedData.forEach(assignValConfig => {
                let valJsonCounter = 0;
                innerEle.value.forEach(assignValSavedJsonArr => { //json data which was saved- can be mutiple; 
                  // but assigning only 1 and at end using add button functionaality code more elements will be added
                  if (valJsonCounter == 0) {
                    assignValSavedJsonArr.forEach(assignValSavedJson => {
                      if (assignValConfig.fieldJsonMapping == assignValSavedJson.fieldJsonMapping) {
                        assignValConfig.value = assignValSavedJson.value;
                      }
                    });
                  }
                  valJsonCounter++;
                  // if (assignValConfig.fieldJsonMapping == assignValSavedJson.fieldJsonMapping) {
                  //   assignValConfig.value = assignValSavedJson.value;
                  // }
                });
              });
            } else {


              // alert("fullData:" + JSON.stringify(fullData))
              // fullData.forEach(fullEle => {
              //   // alert("fullEle.tableMetaData:" + JSON.stringify(fullEle.tableMetaData))
              //   for (var val of fullEle.tableMetaData) {

              //       alert("val.identifier"+val.identifier)
              //       alert("innerEle.identifier"+JSON.stringify(this.fields))
              // if (innerEle.fieldJsonMapping == res.fieldJsonMapping && res.identifier =="file") {
              // alert("val.identifier :" + val.identifier)

              // fs.writeFileSync('image1.jpeg', imageBuffer);
              // res.value = innerEle.value;
              // return false;
              // }


              //     for (var innerVal of fullEle.tableMetaDataFieldNameLang) {
              //       if (val.fieldJsonMapping == innerVal.fieldJsonMapping) {
              //         val.label = innerVal.label;
              //         val.placeholder = innerVal.placeholder;
              //         // add stuff more for single level
              //         if (val.type == "file") {
              //           alert("innerEle.value :" + innerEle.value)
              //           res.value = innerEle.value;
              //           return false;
              //         }
              //       }
              //     }
              //   }
              // })
              // alert("innerEle.value :" + innerEle.value)

              res.value = innerEle.value;

              return false;
            }
            // res.value = innerEle.value;
            // return false;
            // break;
          }
          // return false;
        });
      }
      const validationsArray = [];
      res.validations.forEach(val => {
        if (val.name === 'required') {
          validationsArray.push(
            Validators.required
          );
        }
        if (val.name === 'pattern') {
          validationsArray.push(
            Validators.pattern(val.validator)
          );
          // alert("val.validator  test   " +val.validator )

        }

        if (val.name === 'minlength') {
          validationsArray.push(
            Validators.minLength(val.validator)
            // alert("val.validator  minlength   " + val.validator)
          );
        }

        if (val.name === 'maxlength') {
          validationsArray.push(
            Validators.maxLength(val.validator)
            // alert("val.validator  maxLength   " + val.validator)
          );
        }

      });
      if (res.type != "array") {
        if (this.screenType == 'edit') {
          // controls[res.label] = new FormControl(res.value, validationsArray);
          controls[res.fieldJsonMapping] = new FormControl(res.value, validationsArray);
        } else {
          // controls[res.label] = new FormControl('', validationsArray);
          let value = null;
          value = res.value == "" ? null : res.value;
          controls[res.fieldJsonMapping] = new FormControl(value, validationsArray);
        }
      } else { // ARRAY CODE COMES HERE...
        let nestedcontrols = {};
        // if (this.screenType == 'edit') {
        // ADD EDIT FORM CONTROL CODE HERE...
        // } else {
        let nestedFormArray: FormArray = new FormArray([]);
        let nestedFormGroup: any = {};
        // nestedFormGroup['companytest'] = ['comptest1'];
        // nestedFormGroup['projecttest1'] = ['projtest1']
        // controls[res.fieldJsonMapping] = this.fb.array([]);
        // controls[res.fieldJsonMapping].push(this.fb.group(nestedFormGroup))
        // controls[res.fieldJsonMapping] = nestedFormArray;
        // controls[res.fieldJsonMapping].push(this.fb.group(nestedFormGroup));

        res.fieldArrayNestedData.forEach((nestedEle: any) => {
          const nestedValidationsArray = [];
          nestedEle.validations.forEach(nestedVal => {
            if (nestedVal.name === 'required') {
              nestedValidationsArray.push(
                Validators.required
              );
            }
            if (nestedVal.name === 'pattern') {
              nestedValidationsArray.push(
                Validators.pattern(nestedVal.validator)
                // Validators.pattern(/^[0-9]+$/)
              );
            }

            if (nestedVal.name === 'minlength') {
              nestedValidationsArray.push(
                Validators.minLength(nestedVal.validator)
                // alert("nestedVal.validator  minlength   " + nestedVal.validator)
              );
            }

            if (nestedVal.name === 'maxlength') {
              nestedValidationsArray.push(
                Validators.maxLength(nestedVal.validator)
                // alert("nestedVal.validator  maxLength   " + nestedVal.validator)
              );
            }

          });
          let value = null;
          value = nestedEle.value == "" ? null : nestedEle.value;
          nestedFormGroup[nestedEle.fieldJsonMapping] = new FormControl(value, nestedValidationsArray)
        })
        // nestedFormArray.push(nestedFormGroup);
        // controls[res.fieldJsonMapping] = nestedFormArray;
        controls[res.fieldJsonMapping] = nestedFormArray;
        controls[res.fieldJsonMapping].push(this.fb.group(nestedFormGroup));
        // }
      }
      // if(this.screenType == 'edit'){
      //   // controls[res.label] = new FormControl(res.value, validationsArray);
      //   controls[res.fieldJsonMapping] = new FormControl(res.value, validationsArray);
      // }else{
      //   // controls[res.label] = new FormControl('', validationsArray);
      //   controls[res.fieldJsonMapping] = new FormControl('', validationsArray);
      // }
    });
    this.dynamicForm = new FormGroup(
      controls
    );


    if (this.formArrayKeyNameTrackArr.length > 0) {
      // var companyDetails = [
      //   {
      //     "valueDescription": "val 1",
      //     "language": "English"
      //   },
      //   {
      //     "valueDescription": "val 2",
      //     "language": "Arabic"
      //   },
      //   {
      //     "valueDescription": "val 3",
      //     "language": "Hindi"
      //   }
      // ];
      let counter = 0;
      let formarray: FormArray = this.dynamicForm.controls[this.formArrayKeyNameTrackArr[0]] as FormArray;
      this.jsonFormArrayTrack.forEach((outerelement: any) => {
        if (counter != 0) {
          let obj: any = {};
          for (let [key, value] of Object.entries(outerelement)) {
            this.fields.forEach(element => {

              if (element.fieldJsonMapping == this.formArrayKeyNameTrackArr[0]) {
                element.fieldArrayNestedData.forEach(innerelement => {
                  if (innerelement.fieldJsonMapping == key) {
                    const nestedValidationsArray = [];
                    if (innerelement.validations.length > 0) {
                      innerelement.validations.forEach(nestedVal => {
                        if (nestedVal.name === 'required') {
                          nestedValidationsArray.push(
                            Validators.required
                          );
                        }
                        if (nestedVal.name === 'pattern') {
                          nestedValidationsArray.push(
                            Validators.pattern(nestedVal.validator)
                            // Validators.pattern(/^[0-9]+$/)
                          );
                        }

                        if (nestedVal.name === 'minlength') {
                          nestedValidationsArray.push(
                            Validators.minLength(nestedVal.validator)
                            // alert("nestedVal.validator  minlength   " + nestedVal.validator)
                          );
                        }

                        if (nestedVal.name === 'maxlength') {
                          nestedValidationsArray.push(
                            Validators.maxLength(nestedVal.validator)
                            // alert("nestedVal.validator  maxLength   " + nestedVal.validator)
                          );
                        }

                      });
                    }
                    obj[key] = new FormControl(value, nestedValidationsArray);
                  }

                })
              }
            })

          }
          formarray.push(this.fb.group(obj));
        }
        counter++;
      })
    }
  }

  addNestedParentForm(controls, formarray) {
    let formarrayVar = formarray as FormArray;
    let obj: any = {};
    controls.fieldArrayNestedData.forEach(element => {
      obj[element.fieldJsonMapping] = [''] // add validation here
    });

    controls.fieldArrayNestedData.forEach((nestedEle: any) => {
      const nestedValidationsArray = [];
      nestedEle.validations.forEach(nestedVal => {
        if (nestedVal.name === 'required') {
          nestedValidationsArray.push(
            Validators.required
          );
        }
        if (nestedVal.name === 'pattern') {
          nestedValidationsArray.push(
            // Validators.pattern(nestedVal.validator)
            Validators.pattern(/^[0-9]+$/)
          );
        }

        if (nestedVal.name === 'minlength') {
          nestedValidationsArray.push(
            Validators.minLength(nestedVal.validator)
            // alert("nestedVal.validator  minlength   " + nestedVal.validator)
          );
        }

        if (nestedVal.name === 'maxlength') {
          nestedValidationsArray.push(
            Validators.maxLength(nestedVal.validator)
            // alert("nestedVal.validator  maxLength   " + nestedVal.validator)
          );
        }

      });
      // obj[nestedEle.fieldJsonMapping]  = [''] // add validation here
      obj[nestedEle.fieldJsonMapping] = new FormControl(nestedEle.value, nestedValidationsArray)
    })

    formarrayVar.push(
      this.fb.group(obj)
    );
  }

  private createEmailFormGroup(): FormGroup {
    return new FormGroup({
      emailAddress: new FormControl('', Validators.email),
      emailLabel: new FormControl(''),
    });
  }

  ngOnInit() { }

  async ionViewWillEnter() { }


  async onSubmit() {
    this.isFormSubmitted = true;
    console.log(" data" + JSON.stringify(this.data));

    if (this.data.showDeclineComments && (this.data.comments == null || this.data.comments == "")) {
      console.log(" comments field is required");
    } else {
      await this.modalController.dismiss(this.data);
    }

  }

  //   isDuplicate(val)
  //   {
  //     // alert("this.isDuplicate"+ this.isDuplicate)
  // if(this.isDuplicate){
  //   this.utilityService.showToast("error", `key fields should be unique`);
  // }
  //   }


  onSubmitClk(newData) {
    let data = null;
    data = newData;
    // if(data.key  != undefined){
    // alert(data.key)
    // }
// custom filter

// if(this.screenType == "customFilter"){
//   let url = 'login';
//   let req = {
//     "tableName":data.tableName,
//     "columnName":data.columnName,
//     "eventType":data.eventType,
//     "newDate":data.newDate,
//     "newUsername":data.newUsername
//   };
//   this.utilityService.callPostApi(req, url).then((res: any) => {

//   });



//   this.customfilterFormData.emit(data)
//   this.fields.forEach(element => {
//     for (let [key, value] of Object.entries(data)) {
//       if(element.fieldJsonMapping == key){
//         alert(element.fieldJsonMapping)
//         alert(key)
//         alert(value)
//         // this.table.filterGlobal(value, 'contains');
//         // this.table.filter(value, element.fieldJsonMapping, 'startsWith');
//       }
//     }
    
//   });

//   // if (parentData.type == "currency") {
//   //   let newTableMetaDataField = parentData.tableMetaDataField + ".currencyValue";
//   //   this.table.filter(data, newTableMetaDataField, 'startsWith');
//   // } else {
//   //   this.table.filter(data, parentData.tableMetaDataField, 'startsWith');
//   // }
// }


    console.log(" submit clicked" + JSON.stringify(data));
    console.log(" data" + JSON.stringify(data));
    // check custom submit validation here
    if (this.submitCustomValidation != null && this.submitCustomValidation &&
      this.submitCustomValidationMetaData != null) {
      // this.submitCustomValidationMetaData.singleLevel --> add condition for single level

      // add conditions for arrayLevel
      if (this.submitCustomValidationMetaData.arrayLevel != undefined &&
        this.submitCustomValidationMetaData.arrayLevel != null &&
        this.submitCustomValidationMetaData.arrayLevel.length > 0) {
        let customValidationsDefectFound = false;
        this.submitCustomValidationMetaData.arrayLevel.forEach(element => {
          // checking duplicates
          if (element.duplicateCheck != undefined && element.duplicateCheck) {
            var valueArr = data[element.arrayFieldJsonMapping].map(function (item) { return item[element.fieldJsonMapping] });
            var isDuplicate = valueArr.some(function (item, idx) {
              return valueArr.indexOf(item) != idx
            });
            console.log("array contains duplicates while submit", isDuplicate);
            if (isDuplicate) {
              customValidationsDefectFound = true;
              console.log("in isduplicate block");
              this.utilityService.showToast("error", `${element.fieldJsonMapping} fields should be unique`);
            }
          }
        });

        if (!customValidationsDefectFound) {
          this.submitApiProcessing(data); //proper
        }
      } else {
        this.submitApiProcessing(data); //proper
      }
    } else {
      this.submitApiProcessing(data);  //proper
    }


  }

  dateFormat2(d) {
    var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var t = new Date(d);
    return t.getDate() + '/' + monthShortNames[t.getMonth()] + '/' + t.getFullYear();
  }

  submitApiProcessing(data) {
    this.show = true;
    // for submitcustomdataManupulation 
    if (this.submitCustomDataManupulation != null) {
      // this.submitCustomDataManupulation.singleLevel --> add condition for single level
      if (this.submitCustomDataManupulation.singleLevel != undefined &&
        this.submitCustomDataManupulation.singleLevel != null &&
        this.submitCustomDataManupulation.singleLevel.length > 0) {
        this.submitCustomDataManupulation.singleLevel.forEach(element => {
          if (element.fieldName != undefined) {
            // this.submitData = data;
            // const submitDataKey = Object.keys(this.submitData)
            console.log("element.fieldName : " + element.fieldName)
            // console.log("submitDataKey : " + submitDataKey);
            console.log(this.dynamicForm.controls[element.fieldName])

            if (element.fieldName == "status") {
              if (element.statusFormatConversion) {
                if (this.dynamicForm.controls[element.fieldName].value == "Active") {
                  this.dynamicForm.controls[element.fieldName].setValue("A")
                } else if (this.dynamicForm.controls[element.fieldName].value == "Inactive") {
                  this.dynamicForm.controls[element.fieldName].setValue("X")
                }
              }

            }


            if (element.dateFormatConversion == "date") {
              // alert(data[element.fieldName]);
              if (data[element.fieldName] != null) {
                data[element.fieldName] = moment(data[element.fieldName]).format('DD/MM/YYYY');
              }
              // data[element.fieldName] = moment(data[element.fieldName]).format('MM/DD/YYYY');
              // data[element.fieldName] = moment(data[element.fieldName]).format('DD/MM/YYYY');
            } else if (element.dateFormatConversion == "dateTime") {
              if (data[element.fieldName] != null) {
                const format1 = "DD-MM-yyyy HH:mm:ss";
                // const format1 = "YYYY-MM-DD HH:mm:ss";
                var date1 = new Date(data[element.fieldName]);
                data[element.fieldName] = moment(date1).format(format1);
              }
              // const format1 = "DD-MM-yyyy HH:mm:ss";
              // // const format1 = "YYYY-MM-DD HH:mm:ss";
              // var date1 = new Date(data[element.fieldName]);
              // data[element.fieldName] = moment(date1).format(format1);
              // data[element.fieldName] = moment(data[element.fieldName]).format('MM/DD/YYYY hh24:mi:ss');
              // alert(" data[element.fieldName] :" + data[element.fieldName])
              // alert("database format date : "+ this.dateFormat2(new Date(data[element.fieldName])))

            }
            // for (let key of Object.keys(this.submitData)) {
            //   if (element.fieldName == key && element.dateFormatConversion == "date") {
            //     //for start date
            //     let selectedstartDate = this.dynamicForm.controls[element.fieldName].value;
            //     this.ConvertedselectedFromDate = moment(selectedstartDate).format('MM/DD/YYYY');
            //     alert("ConvertedselectedFromDate : " + this.ConvertedselectedFromDate)
            //      this.dateFormat2(new Date(this.ConvertedselectedFromDate))
            //     alert("database format date : "+ this.dateFormat2(new Date(this.ConvertedselectedFromDate)))
            //     this.dynamicForm.controls[element.fieldName].setValue(this.ConvertedselectedFromDate)
            //     //for end date
            //     let selectedEndDate = this.dynamicForm.controls[element.fieldName].value;
            //     this.ConvertedselectedStartDate = moment(selectedEndDate).format('MM/DD/YYYY');
            //     alert("ConvertedselectedStartDate : " + this.ConvertedselectedStartDate)
            //     this.dynamicForm.controls[element.fieldName].setValue(this.ConvertedselectedStartDate)
            //   }
            //   if (element.fieldName == key && element.dateFormatConversion == "dateTime") {
            //     //for start date
            //     let selectedstartDate = this.dynamicForm.controls[element.fieldName].value;
            //     this.ConvertedselectedFromDate = moment(selectedstartDate).format('DD/MM/YYYY HH24:MM:SS');
            //     alert("ConvertedselectedFromDate : " + this.ConvertedselectedFromDate)
            //     let selectedEndDate = this.dynamicForm.controls[element.fieldName].value;
            //     //for end date
            //     this.ConvertedselectedStartDate = moment(selectedEndDate).format('DD/MM/YYYY HH24:MM:SS');
            //     alert("ConvertedselectedFromDate : " + this.ConvertedselectedStartDate)
            //     this.dynamicForm.controls[element.fieldName].setValue(this.ConvertedselectedFromDate)
            //   }
            // }

            // if (element.fieldName == submitDataKey.find(element.fieldName)) {
            //   alert(submitDataKey)
            // }
            // this.submitData.forEach(function (InnerElement) {
            //   console.log(InnerElement);
            // });
            // data.forEach((value: any, key: string) => {
            //   console.log(key, value);
            // });
            // data.forEach((value: any, key: string) => {
            //   if (element.fieldName == key) {
            //     alert("see" + key)
            //   }

            // });
            // if (element.fieldName == data.startDate) {
            //   // alert()
            // }

            // if (element.fieldName == "startingDate" && element.dateFormatConversion == "date") {
            //   let selectedstartDate = this.dynamicForm.controls[element.fieldName].value;
            //   this.ConvertedselectedFromDate = moment(selectedstartDate).format('DD/MM/YYYY');
            // }
            // if (element.fieldName == "endDate" && element.dateFormatConversion == "dateTime") {
            //   let selectedEndDate = this.dynamicForm.controls[element.fieldName].value;
            //   this.ConvertedselectedStartDate = moment(selectedEndDate).format('DD/MM/YYYY HH:mm:ss');
            // }
          }
        });
      }

    }
    // alert("apiSaveDataUrlReqData" + JSON.stringify(this.apiSaveDataUrlReqData))
    var url = "";
    var reqObj: any = {};
    if (this.screenType == "add") {
      url = this.apiSaveDataUrl;
      reqObj = {
        ...this.apiSaveDataUrlReqData
      };
    } else if(this.screenType == "customFilter"){
      url = this.apiCustomSearchDataUrl;
      reqObj = {
        ...this.apiCustomSearchDataUrlReqData
      };
    }else {
      url = this.apiUpdateDataUrl;
      reqObj = {
        ...this.apiUpdateDataUrlReqData
      };
    }

    if (url == "querydata-save-update-preparedStm") {
      for (let [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          // array stuff
          // reqObj["array"] = value;
          let newArr = [];
          value.forEach(innerEle => {
            let arrReq: any = {}
            for (let [innerkey, innervalue] of Object.entries(innerEle)) {
              // arrReq[":"+innerkey] = innervalue;
              if (innervalue == null || innervalue == "") {
                if (innerkey == "id") {
                  arrReq['createdBy'] = 1; // assign user Id here
                  arrReq['createdDate'] = `${this.appConfig.getDate()}`;
                  arrReq[innerkey] = 0;
                } else {
                  arrReq[innerkey] = "";
                }
              } else if (typeof innervalue == "string") {
                arrReq[innerkey] = `${innervalue}`;
              } else {
                if (innerkey == "id" && innervalue != null) {
                  arrReq['updatedBy'] = 1; // assign user Id here
                  arrReq['updatedDate'] = `${this.appConfig.getDate()}`;
                }
                arrReq[innerkey] = innervalue;
              }
            }
            newArr.push(arrReq);
          });
          reqObj["array"] = newArr;
        } else if (value == null || value == "") {
          reqObj[key] = "";
        } else if (typeof value == "string") {
          reqObj[key] = `${value}`;
        } else {
          reqObj[key] = value;
        }
      }
      if (this.screenType == "add") {
        reqObj['createdBy'] = 1;
        reqObj['createdDate'] = `${this.appConfig.getDate()}`;
      } else {
        reqObj['updatedBy'] = 1;
        reqObj['updatedDate'] = `${this.appConfig.getDate()}`;
      }
    }
    else {

      for (let [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          // array stuff
          // reqObj["array"] = value;
          let newArr = [];
          value.forEach(innerEle => {
            let arrReq: any = {}
            for (let [innerkey, innervalue] of Object.entries(innerEle)) {
              // arrReq[":"+innerkey] = innervalue;
              if (innervalue == null || innervalue == "") {
                if (innerkey == "id") {
                  arrReq["@" + 'createdBy'] = 1; // assign user Id here
                  arrReq["@" + 'createdDate'] = `'${this.appConfig.getDate()}'`;
                  arrReq["@" + innerkey] = 0;
                } else {
                  arrReq["@" + innerkey] = "''";
                }
              } else if (typeof innervalue == "string") {
                arrReq["@" + innerkey] = `'${innervalue}'`;
              } else {
                if (innerkey == "id" && innervalue != null) {
                  arrReq["@" + 'updatedBy'] = 1; // assign user Id here
                  arrReq["@" + 'updatedDate'] = `'${this.appConfig.getDate()}'`;
                }
                arrReq["@" + innerkey] = innervalue;
              }
            }
            newArr.push(arrReq);
          });
          reqObj["array"] = newArr;
        } else if (value == null || value == "") {
          reqObj["@" + key] = "''";
        } else if (typeof value == "string") {
          reqObj["@" + key] = `'${value}'`;
        } else {
          reqObj["@" + key] = value;
        }
      }
      if (this.screenType == "add") {
        reqObj["@" + 'createdBy'] = 1;
        reqObj["@" + 'createdDate'] = `'${this.appConfig.getDate()}'`;
      } else {
        reqObj["@" + 'updatedBy'] = 1;
        reqObj["@" + 'updatedDate'] = `'${this.appConfig.getDate()}'`;
      }
    }
    // {

    //   for (let [key, value] of Object.entries(data)) {
    //     if (Array.isArray(value)) {
    //       // array stuff
    //       // reqObj["array"] = value;
    //       let newArr = [];
    //       value.forEach(innerEle => {
    //         let arrReq: any = {}
    //         for (let [innerkey, innervalue] of Object.entries(innerEle)) {
    //           // arrReq[":"+innerkey] = innervalue;
    //           if (innervalue == null || innervalue == "") {
    //             if (innerkey == "id") {
    //               arrReq[":" + 'createdBy'] = 1; // assign user Id here
    //               arrReq[":" + 'createdDate'] = `'${this.appConfig.getDate()}'`;
    //               arrReq[":" + innerkey] = 0;
    //             } else {
    //               arrReq[":" + innerkey] = "''";
    //             }
    //           } else if (typeof innervalue == "string") {
    //             arrReq[":" + innerkey] = `'${innervalue}'`;
    //           } else {
    //             if (innerkey == "id" && innervalue != null) {
    //               arrReq[":" + 'updatedBy'] = 1; // assign user Id here
    //               arrReq[":" + 'updatedDate'] = `'${this.appConfig.getDate()}'`;
    //             }
    //             arrReq[":" + innerkey] = innervalue;
    //           }
    //         }
    //         newArr.push(arrReq);
    //       });
    //       reqObj["array"] = newArr;
    //     } else if (value == null || value == "") {
    //       reqObj[":" + key] = "''";
    //     } else if (typeof value == "string") {
    //       reqObj[":" + key] = `'${value}'`;
    //     } else {
    //       reqObj[":" + key] = value;
    //     }
    //   }
    //   if (this.screenType == "add") {
    //     reqObj[":" + 'createdBy'] = 1;
    //     reqObj[":" + 'createdDate'] = `'${this.appConfig.getDate()}'`;
    //   } else {
    //     reqObj[":" + 'updatedBy'] = 1;
    //     reqObj[":" + 'updatedDate'] = `'${this.appConfig.getDate()}'`;
    //   }
    // }
    // if (this.screenType == "add") {
    //   reqObj[":" + 'createdBy'] = 1;
    //   reqObj[":" + 'createdDate'] = `'${this.appConfig.getDate()}'`;
    // } else {
    //   reqObj[":" + 'updatedBy'] = 1;
    //   reqObj[":" + 'updatedDate'] = `'${this.appConfig.getDate()}'`;
    // }
    reqObj.randomKey = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    reqObj.transactionId = this.utilityService.getTRNTimestamp();
    reqObj.userId = this.appConfig.getUserData().userId;
    console.log("reqObj " + JSON.stringify(reqObj));
    debugger;
    let crudObj2 :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, reqObj);
      crudObj2['encryptedRequest'] = newData;
      crudObj2['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj2 = reqObj;
      crudObj2['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }

    //  let url = "querydata-save";
    // url = "querydata-save-update-preparedStm";
    this.utilityService.callPostApi(crudObj2, url).then((resp:any) => {
        // decryption logic
     if (this.appConfig.getEncryptDatabool()) {
      let decryptedData = this.appConfig.decrypt(
            this.appConfig.secretKey,
            resp.encryptedResponse
          );
          let fullResponse = JSON.parse(decryptedData);
          resp = fullResponse;
    } 
    let res = resp.result;

      this.show = false;
      console.log("res " + JSON.stringify(res));
      if (res != null) {

        let errorFound = false;
        for (let [key, value] of Object.entries(res)) {
          if (key == "error") {
            errorFound = true;
            break;
          }
          if (key == "filerror") {
            this.utilityService.showToast("error", "File type is not supported");
            return;
          }
          if (key == "idInserted" && value == "Error while saving data") {
            errorFound = true;
            break;
          }
        }
        if (!errorFound) {
          this.utilityService.showToast("Records saved successfully");
          this.closePopUpWithData(res);
        } else {
          this.utilityService.showToast("error", "Internal Server Error");
        }
      } else {
        this.utilityService.showToast("error", "Internal Server Error");
      }
    }, err => {
      console.log("err " + JSON.stringify(err));
      this.utilityService.showToast("error","Internal Server Error");
    })
  }

  onCancelClk(data) {
    this.closePopUp();
  }
  async closePopUp() {
    await this.modalController.dismiss();
  }
  async closePopUpWithData(data) {
    await this.modalController.dismiss(data);
  }
}

