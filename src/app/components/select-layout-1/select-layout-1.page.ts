import { Component, Output, EventEmitter, SimpleChanges, Input, OnChanges, AfterViewInit, forwardRef, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';

@Component({
  selector: 'digital-cs-select-layout-1',
  templateUrl: 'select-layout-1.page.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectLayout1Page),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectLayout1Page),
      multi: true,
    }
  ],
  styleUrls: ['select-layout-1.page.scss'],
})
export class SelectLayout1Page implements OnChanges, ControlValueAccessor, Validator, OnInit, AfterViewInit {
  @Input() data: any = [];
  @Input() selectedItem: any;
  @Input() valueId: any;
  @Input() valueDesc: any;
  @Input() title: any;
  @Input() placeholder: any = 'SELECT';
  @Input() parentForm: FormGroup;
  @Input() fcName: string;
  @Output() onChange = new EventEmitter();
  @Input() isDisabled: Boolean = false;
  @Input() readonly: Boolean = false;
  @Input() required: Boolean = false;
  @Input() whitelabelbool: boolean = false;
  @Input() show: boolean = true;
  @Input() isDarkBg: boolean = false;
  // searchable dropdown
  @Input() canSearch: boolean = true;
  @Input() canClear: boolean = true;
  @Input() isMultiple: boolean = false;
  @Input() disableItemsArr: any[] = [];
  @Input() modalCssClass: any;
  @ViewChild('abc') abc: IonicSelectableComponent;

  @Input() control: FormControl;
  @Input() metaData: any;
  @Input() parentFormData: any;
  @Input() onPageLoadGetData: boolean = false;
  @Input() apiUrl: any;
  @Input() formControlNameLabel: any;

  @Input() value: any;

  @Input() metdaDataReq: any;

  @Input() createMataDataReqOnCondition: any;

  @Input() ConvertStringToInteger : true;

  NewParrentFormData: any;

  SEARCH_PLACEHOLDER: 'SEARCH'
  constructor(
    public appConfig: AppConfigService,
    private utilityService: UtilityService
  ) {
  }

  ngOnInit() {

    // try{
    //   if(typeof this.control.validator == 'function'){
    //     this.required = true;
    //   }
    // }catch(e){
    //   alert("errpr "+JSON.stringify(e));
    // }

  }

  ngAfterViewInit() {
    // alert("after view iit")
    console.log("metaData " + this.metaData);
    console.log("parentFormData " + JSON.stringify(this.parentFormData));
    console.log("onPageLoadGetData " + JSON.stringify(this.onPageLoadGetData));
    if (this.onPageLoadGetData) {
      // dummy
      // this.getApiDataFromMetaData();
      // java api
      this.getApiDataFromMetaDataJava();
    }
  }

  createAdditionMataData(objRes) {
    let obj: any = {};
    if (this.createMataDataReqOnCondition !== undefined) {
      // alert("ok");
      this.getApiDataFromMetaDataJava(objRes)
      // this.createMataDataReqOnCondition.forEach(element => {
      //   obj[element] = objRes[element];
      //   console.log("obj : " + obj)
      // });
    }
  }

  
  getApiDataFromMetaDataUsingSettingForm(formData){
    this.parentFormData = formData;
    this.getApiDataFromMetaDataJava();
  }

  
  getApiDataFromMetaDataJava(objRes?) {
    console.log("parentFormData onchange " + JSON.stringify(this.parentFormData));
    console.log("metaData " + this.metaData);
    let obj: any = {};
    this.metaData.forEach(element => {
      // debugger;
      // select query madhe varibale anava lagel : paraentid 
      console.log("element to check inside parent form  " +element);
      
      console.log("parentFormData  " + this.parentFormData);
      // obj[element] = this.parentFormData[element];
      obj[":"+element] = this.parentFormData[element];
      // if(obj[":"+element] == obj["::"+element]){
      //   alert(obj[":"+element].replace('::', ':'))
      // }
      console.log("obj : " + obj)
    });
    if (objRes !== undefined) {
      obj={...objRes};
    }
    // let url = "querydata-by-queryid-metadata";
    let url = this.apiUrl;
    let objForPost: any = {};
    let metdaDataReqDup: any = {};
    for (let [key, value] of Object.entries(this.metdaDataReq)) {
      if (key == ":langId" || key == "langId") {
        metdaDataReqDup[key] = 1; // get from appconfig
      } else {
        metdaDataReqDup[key] = value;
      }

      // if (key == ":days" || key == "days") {
      //   metdaDataReqDup[key] = 30; // get from appconfig
      // } else {
      //   metdaDataReqDup[key] = value;
      // }
    }
    if (this.metaData != null && this.metaData.length > 0) {
      // debugger;
      objForPost = {
        ...obj,
        ...metdaDataReqDup
      };
    }else if(objRes !== undefined){
      // debugger;      
      objForPost = {
        ...obj,
        ...metdaDataReqDup
      };
    }
    else {
      // debugger;      
      objForPost = {
        ...metdaDataReqDup
      };
    }

    console.log("obj to be pass  " + JSON.stringify(objForPost));
    // debugger;    
    console.log("drop down url : " + url)
    objForPost.randomKey = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    objForPost.transactionId = this.utilityService.getTRNTimestamp();
    objForPost.userId = this.appConfig.getUserData().userId;

    let crudObj2 :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, objForPost);
      crudObj2['encryptedRequest'] = newData;
      crudObj2['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj2 = objForPost;
      crudObj2['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }

    this.utilityService.callPostApi(crudObj2, url).then((data: any) => {
        // decryption logic
     if (this.appConfig.getEncryptDatabool()) {
      let decryptedData = this.appConfig.decrypt(
            this.appConfig.secretKey,
            data.encryptedResponse
          );
          let fullResponse = JSON.parse(decryptedData);
          data = fullResponse;
    } 

      this.data = data.result;
    }, err => {
      alert("gettinf dropdown data json error" + JSON.stringify(err));
    })
  }

  emptyArrayData(){
    this.data = [];
  }

  getApiDataFromMetaData() {
    console.log("parentFormData onchange " + JSON.stringify(this.parentFormData));
    console.log("metaData " + this.metaData);
    // this.metaData = ["appConfig_date"]; //meta data value will never be set
    this.metaData.forEach(element => {
      let obj: any = {};
      obj[element] = this.parentFormData[element];
      console.log("obj : " + obj)
    });
    let demourl = "querydata-by-queryid-metadata";
    let objForPost = null;
    console.log("obj to be pass  " + JSON.stringify(objForPost));
    let url = "MetaDataJson/" + this.apiUrl + "";
    console.log("drop down url : " + url)
    // this.utilityService.showLoader();
    this.utilityService.getJsonData(url).subscribe((data: any) => {
      this.utilityService.hideLoader();
      this.data = data.body;

      // alert(this.value)
      // if(this.value != undefined && this.value != null && this.value != ""){
      //   this.selectedItem = this.value;
      //   this.propagateChange(this.selectedItem);
      // }
    }, err => {
      alert("gettinf dropdown data json error" + JSON.stringify(err));
    })
  }

  open() {
    this.abc.open();
  }
  // scf
  //   ngOnChanges(changes: SimpleChanges): void {
  //     alert("ngonchanges")
  // }

  // demla
  ngOnChanges(changes: { [propKey: string]: any }) {
    // if(this.selectedItem == undefined ){
    //   this.data = changes['data'].currentValue;
    // }else{
    //   this.data.selectedItem = changes.selectedItem.currentValue;
    // }
  }

  private propagateChange = (_: any) => { };

  writeValue(obj: any): void {
    // this.selectedDate = obj;

    if(this.ConvertStringToInteger)
    {
      if (typeof obj === "string") {
        obj = +obj;
      }
  
      this.selectedItem = obj;
      
    }else{
      this.selectedItem = obj;
    }
    // if (typeof obj === "string") {
    //   obj = +obj;
    // }

    // this.selectedItem = obj;

  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    //throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error("Method not implemented.");
  }
  validate(c: AbstractControl): { [key: string]: any; } {
    // alert("inside");    
    if (this.required && (this.selectedItem == null || this.selectedItem == "")) {
      // alert("drp error");
      return {
        "lov": { valid: false }
      }
    } else {
      // alert("clearr");        
      return null;
    }
  }
  registerOnValidatorChange?(fn: () => void): void {
    // throw new Error("Method not implemented.");
  }

  onChangeFunc(event) {
    this.propagateChange(this.selectedItem);

    this.setSelectedData();
  }

  onCancelFunc() {
    // this.selectedItem = "";
    this.selectedItem = null;
    this.propagateChange(this.selectedItem);

    this.setSelectedData();
  }

  setSelectedData() {
    this.data.selectedRecord = [];
    this.data.selectedItem = this.selectedItem;
    console.log("dropdown data--- " + JSON.stringify(this.data));
    console.log("dropdown selectedItem----- " + this.selectedItem);

    if (this.selectedItem != null && this.selectedItem != "") {
      this.data.forEach(element => {
        // parent components's valueId passed to this component always needs to be unique
        if (element[this.valueId] == this.selectedItem) {
          this.data.selectedRecord.push(element);
          console.log("dropdown data with SELECTED-RECORD check---" + JSON.stringify(this.data.selectedRecord));
          return;
        }
      });
    }
    console.log("dropdown data after assigning SELECTED-RECORD -----" + JSON.stringify(this.data));
    this.onChange.emit(this.data);
  }
}
