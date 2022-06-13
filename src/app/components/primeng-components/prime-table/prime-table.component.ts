import { Component, Output, EventEmitter, SimpleChanges, Input, OnChanges, AfterViewInit, forwardRef, OnInit, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Table } from 'primeng/table';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { Plugins, CameraResultType, } from '@capacitor/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { UtilityService } from '../../../services/shared/utility/utility.service';
import { CommonPopupComponent } from '../../common-popup/common-popup.component';
import { TranslateService } from '@ngx-translate/core';
import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const { Camera } = Plugins;

export interface Country {
  name?: string;
  code?: string;
}

export interface Representative {
  name?: string;
  image?: string;
}

export interface Customer {
  id?: number;
  name?: string;
  country?: Country;
  company?: string;
  date?: string;
  status?: string;
  activity?: number;
  representative?: Representative;
}


@Component({
  selector: 'digital-p-prime-table',
  templateUrl: 'prime-table.component.html',
  styleUrls: ['prime-table.component.scss'],
  providers: [],
})

export class PrimeTable implements OnChanges {
  CustomFilterForm: FormGroup;
  @ViewChild('dt') table: Table;
  @ViewChildren('fileView') fileView: ElementRef;
  // @ViewChild('fileView') fileView :ElementRef;


  @Input() tableData: any[];
  @Input() tableMetaData: any[];
  @Input() tableGlobalFilterFields: any[]; //['name','country.name','representative.name','status']
  @Input() tableTitle: string;
  @Input() tableSelectedValue: any;

  @Input() showActions: boolean = true;
  @Input() showActionsAdd: boolean = false;
  @Input() showActionsEdit: boolean = true;
  @Input() showActionsDelete: boolean = true;
  @Input() showSearchBar: boolean = true;
  @Input() showDownLoadCsv: boolean = true;

  @Input() showSerialNumber: boolean = false;
  @Input() showcheckbox: boolean = false; // mutiple select selectbox
  @Input() showRadiobuttonCheckbox: boolean = false; // single select checkbox
  @Input() showTableName: boolean = true;
  @Input() showCustomFilter: boolean = false;
  @Input() showActionsAddLabel: string = '';

  @Input() customFilterData: any[] = [];

  @Input() rows: number = 10;
  // @Input() rowsPerPageOptions: any[] = [10, 25, 50];
  @Input() rowsPerPageOptions: any[] = [];

  // currentPageReportTemplate :any = "Showing {first} to {last} of {totalRecords} entries";
  currentPageReportTemplate: any = "";
  noRecordsFound: any = "";

  @Input() dataKey: string;

  @Input() mutipleFileUpload: boolean = false;

  @Input() radioValueSelected: any;

  // added 16-04-2021 
  @Input() showTableEmptyMessage: boolean = false;
  @Input() showTableBody: boolean = false;
  @Input() paginator: boolean = false;
  @Input() showCustomSearchFromExistingData: boolean = false;

  @Input() showSearchButton: boolean = true;
  @Input() filterLabelMsg: string = '';

  //export to csv
  @Input() downloadData: any = [];

  @Input() showSortIcon: boolean = false;

  @Input() changeModalTitle;

  @Input() searchPlaceholder: string = '';
  @Input() searchPlaceholderValue: string = '';

  @Input() apiUrlAdd: string = "";
  @Input() apiUrlCustomSearch: string = "";
  @Input() apiUrlEdit: string = "";

  @Input() apiUrlEditSavedData: string = "";
  @Input() apiSaveDataUrl: string = "";
  @Input() apiCustomSearchDataUrl: string = "";
  @Input() apiUpdateDataUrl: string = "";
  @Input() apiDeleteDataUrl: string = "";


  @Input() apiUrlAddReqMetaData: any = null;
  @Input() apiUrlCustomSearchReqMataData:any = null;
  @Input() apiUrlEditReqMetaData: any = null;
  @Input() apiUrlEditReqSavedData: any = null;
  @Input() apiUrlEditReqSavedDataMetaData: any = null;


  @Input() apiSaveDataUrlReqData: any = null;
  @Input() apiCustomSearchDataUrlReqData: any = null;
  @Input() apiUpdateDataUrlReqData: any = null;
  @Input() apiDeleteDataUrlReqData: any = null;
  

  @Input() submitCustomValidation: any = null;
  @Input() submitCustomValidationMetaData: any = null;
  @Input() submitCustomDataManupulation: any = null;
  @Input() modalTitle: any = null;

  @Output() customSearchClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() customTableDataApiCall: EventEmitter<any> = new EventEmitter<any>();


  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSelect: EventEmitter<string> = new EventEmitter<string>();
  @Output() onUnSelect: EventEmitter<string> = new EventEmitter<string>();
  @Output() onEdit: EventEmitter<string> = new EventEmitter<any>();
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAdd: EventEmitter<any> = new EventEmitter<any>();

  @Output() onFileView: EventEmitter<string> = new EventEmitter<any>();
  @Output() onFileUpload: EventEmitter<string> = new EventEmitter<any>();
  @Output() onFileDelete: EventEmitter<string> = new EventEmitter<any>();

  @Output() onMoreDetails: EventEmitter<string> = new EventEmitter<any>();
  @Output() onMoreDetailsTwo: EventEmitter<string> = new EventEmitter<any>();
  @Output() onCancelApplication: EventEmitter<string> = new EventEmitter<any>();


  @Output() viewFileEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() popupClose: EventEmitter<any> = new EventEmitter<any>();



  loading: boolean = false;
  tableRecordsFooterMsg: string = "";

  showCustomFilterSearchBtn: boolean = false;
  showCustomFilterForm: boolean = false;
  customFilterfields: any;
  @ViewChild('fields') fields;
  @Input() screenType;

  constructor(public appConfigService: AppConfigService,
    public uttility: UtilityService,
    private fileChooser: FileChooser,
    private modalController: ModalController,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private router: Router,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit() {

    this.CustomFilterForm = this.fb.group({

    })

    // alert("inside primeng");
    this.getTranslateMessages();
    let CustomeFilterCurrentMenuId = this.router.url.split('/')[7]
    if(CustomeFilterCurrentMenuId == "127"){
      this.router.navigateByUrl('custom-filter');
    }


  }

  getPrimTableDataUsingGueryId(data) {
      let url = 'custom-filter';
      let req = {
        "tableName": this.CustomFilterForm.controls["tableName"].value,
        "columnName":this.CustomFilterForm.controls["columnName"].value,
        "eventType":this.CustomFilterForm.controls["eventType"].value,
        "newDate":this.CustomFilterForm.controls["newDate"].value,
        "newUsername":this.CustomFilterForm.controls["newUsername"].value,
      };
      if (this.apiCustomSearchDataUrlReqData != null && this.screenType == 'customFilter') {
        for (let [key, value] of Object.entries(this.apiCustomSearchDataUrlReqData)) {
            req[key] = value;
        }
      } 
      this.uttility.callPostApi(req, url).then((res: any) => {
        this.tableSelectedValue = res
      });
  
  }

  // async getCustomFilterScreenData() {
  //   // this.uttility.closToast();
  //   // let col = [];
  //   // console.log(col);
  //   // console.log("JSON s" + JSON.stringify(col));
  //   // let title = '';
  //   // let apiJsonName;
  //   // let buttonName = ''
  //   // apiJsonName = this.apiCustomSearchUrl//"language-screen";
  //   // title = this.tableTitle;
  //   // buttonName = 'Search';
  //   this.screenType = 'customFilter';

  //   let url = "screenconfig";
  //   //     const FilterScreenConfigData = await this.uttility.getFilterScreenData(url);
  //   // alert("FilterScreenConfigData"+JSON.stringify(FilterScreenConfigData))
  //   let req: any = {};
  //   if (this.apiUrlAddReqMetaData != null && this.screenType == 'add') {
  //     for (let [key, value] of Object.entries(this.apiUrlAddReqMetaData)) {
  //       if (key == "langId") {
  //         req[key] = 1;// get from appconfig
  //       } else {
  //         req[key] = value;
  //       }
  //     }

  //   } else if (this.apiUrlCustomSearchReqMataData != null && this.screenType == 'customFilter') {
  //     for (let [key, value] of Object.entries(this.apiUrlCustomSearchReqMataData)) {
  //       if (key == "langId") {
  //         req[key] = 1;// get from appconfig
  //       } else {
  //         req[key] = value;
  //       }
  //     }
  //   } else {
  //     alert("no api meta data present for screen");
  //   }

  //   this.uttility.callPostApi(req, url).then((res: any) => {
  //     console.log("KASTLE response " + JSON.stringify(res));
  //     // this.showSkeleton = false;

  //     if (res.length > 0) {

  //       try {
  //         var tableMetaData = res[0].tableMetaData.replace(/\\/g, "");
  //         console.log("KASTLE ABC PARSE " + JSON.parse(tableMetaData));
  //       } catch (e) {
  //         alert("Inside KDB_SCREEN_CONFIG_MASTER's TABLEMETADATA1/2 column json is not properly formed");
  //       }
  //       try {
  //         var onSubmitMetaDataCheck = res[0].onSubmitMetaDataCheck.replace(/\\/g, "");
  //         console.log("KASTLE ABC PARSE " + JSON.parse(onSubmitMetaDataCheck));
  //       } catch (e) {
  //         alert("Inside KDB_SCREEN_CONFIG_MASTER's EXTRA1 column json is not properly formed");
  //       }
  //       try {
  //         var tableMetaDataFieldNameLang = res[0].tableMetaDataFieldNameLang.replace(/\\/g, "");
  //         console.log("KASTLE ABC PARSE " + JSON.parse(tableMetaDataFieldNameLang));
  //       } catch (e) {
  //         alert("Inside KDB_SCREEN_CONFIG_MASTER_TRNS's META_FIELD_NAME_LANG1/2/3/4 column json is not properly formed");

  //       }

  //       let newArr: any = [];
  //       res.forEach((element: any) => {
  //         let newObj: any = {};

  //         if (element.hasOwnProperty("tableMetaData")) {
  //           newObj.tableMetaData = JSON.parse(element["tableMetaData"].replace(/\\/g, ""));
  //         }
  //         if (element.hasOwnProperty("onSubmitMetaDataCheck")) {
  //           newObj.onSubmitMetaDataCheck = JSON.parse(element["onSubmitMetaDataCheck"].replace(/\\/g, ""));
  //         }
  //         if (element.hasOwnProperty("tableMetaDataFieldNameLang")) {
  //           newObj.tableMetaDataFieldNameLang = JSON.parse(element["tableMetaDataFieldNameLang"].replace(/\\/g, ""));
  //         }
  //         newArr.push(newObj);
  //       });

  //       console.log("FINAL fullData" + JSON.stringify(newArr));
  //       this.createForm(newArr);

  //     } else {
  //       this.uttility.showToast('error', 'No data present');
  //     }
  //   }, err => {
  //     console.log("error while fetching screen data");
  //   });
  //   // setTimeout(() => {
  //   //   this.uttility.getFilterScreenData(url).subscribe((data: any) => {
  //   //     this.uttility.hideLoader();
  //   //     // this.showSkeleton = false;
  //   //     // this.fields = data.body;
  //   //     let fullData = [];
  //   //     fullData = data.body;
  //   //     // this.setApiTableData(data.body);
  //   //     this.createForm(fullData);
  //   //   }, err => {
  //   //     this.uttility.hideLoader();
  //   //     // this.showSkeleton = false;
  //   //     alert("api json error" + JSON.stringify(err));
  //   //   })
  //   // }, 500);

  //   // this.openCustomFilter(col, title, apiJsonName, buttonName, screenType)
  // }

  // createForm(fullData) {

  //   fullData.forEach(fullEle => {
  //     for (var val of fullEle.tableMetaData) {
  //       for (var innerVal of fullEle.tableMetaDataFieldNameLang) {
  //         if (val.fieldJsonMapping == innerVal.fieldJsonMapping) {
  //           val.label = innerVal.label;
  //           val.placeholder = innerVal.placeholder;
  //           // add stuff more for single level

  //           // handling nested object
  //           if (val.type == "array") {
  //             if (val.fieldArrayNestedData != undefined && val.fieldArrayNestedData != null && val.fieldArrayNestedData.length > 0) {
  //               val.fieldArrayNestedData.forEach(nestedEle => {
  //                 if (innerVal.fieldArrayNestedDataNameLang != undefined && innerVal.fieldArrayNestedDataNameLang != null && innerVal.fieldArrayNestedDataNameLang.length > 0) {
  //                   innerVal.fieldArrayNestedDataNameLang.forEach(nestedEleLang => {
  //                     if (nestedEle.fieldJsonMapping == nestedEleLang.fieldJsonMapping) {
  //                       nestedEle.label = nestedEleLang.label;
  //                       nestedEle.placeholder = nestedEleLang.placeholder;
  //                       // nested valdations
  //                       // assign nested validations
  //                       if (nestedEle.validations != undefined && nestedEle.validations != null && nestedEle.validations.length > 0) {
  //                         let nestedcounter = 0;
  //                         if (nestedEleLang.validations != undefined && nestedEleLang.validations != null && nestedEleLang.validations.length > 0) {
  //                           for (var nestedvalEle of nestedEleLang.validations) {
  //                             nestedEle.validations[nestedcounter].message = nestedvalEle;
  //                             nestedcounter++;
  //                           }
  //                         }
  //                       }
  //                     }
  //                     // add stuff more for nested form array level
  //                   });


  //                 }
  //               });
  //             }
  //           }
  //           if (innerVal.fieldArrayNestedDataNameLang != undefined && innerVal.fieldArrayNestedDataNameLang != null && innerVal.fieldArrayNestedDataNameLang.length > 0) {
  //             //  not in use
  //           } else {
  //             let counter = 0;
  //             for (var valEle of innerVal.validations) {
  //               val.validations[counter].message = valEle;
  //               counter++;
  //             }
  //             break; // check this or comment it***
  //           }
  //         }
  //       }
  //     }
  //   });

  //   console.log("full formated data " + fullData);
  //   if (fullData.length > 0) {
  //     this.customFilterfields = fullData[0].tableMetaData;

  //     // alert(this.customFilterfields)

  //   }

  //   const controls = {};

  //   this.customFilterfields.forEach(res => {
  //     const validationsArray = [];
  //     res.validations.forEach(val => {
  //       if (val.name === 'required') {
  //         validationsArray.push(
  //           Validators.required
  //         );
  //       }
  //       if (val.name === 'pattern') {
  //         validationsArray.push(
  //           Validators.pattern(val.validator)
  //         );
  //         // alert("val.validator  test   " +val.validator )

  //       }

  //       if (val.name === 'minlength') {
  //         validationsArray.push(
  //           Validators.minLength(val.validator)
  //           // alert("val.validator  minlength   " + val.validator)
  //         );
  //       }

  //       if (val.name === 'maxlength') {
  //         validationsArray.push(
  //           Validators.maxLength(val.validator)
  //           // alert("val.validator  maxLength   " + val.validator)
  //         );
  //       }

  //     });
  //     if (res.type != "array") {
  //       if (this.screenType == 'edit') {
  //         controls[res.fieldJsonMapping] = new FormControl(res.value, validationsArray);
  //       } else {
  //         let value = null;
  //         value = res.value == "" ? null : res.value;
  //         controls[res.fieldJsonMapping] = new FormControl(value, validationsArray);
  //       }
  //     } else { // ARRAY CODE COMES HERE...
  //       let nestedcontrols = {};
  //       let nestedFormArray: FormArray = new FormArray([]);
  //       let nestedFormGroup: any = {};

  //       res.fieldArrayNestedData.forEach((nestedEle: any) => {
  //         const nestedValidationsArray = [];
  //         nestedEle.validations.forEach(nestedVal => {
  //           if (nestedVal.name === 'required') {
  //             nestedValidationsArray.push(
  //               Validators.required
  //             );
  //           }
  //           if (nestedVal.name === 'pattern') {
  //             nestedValidationsArray.push(
  //               Validators.pattern(nestedVal.validator)
  //               // Validators.pattern(/^[0-9]+$/)
  //             );
  //           }

  //           if (nestedVal.name === 'minlength') {
  //             nestedValidationsArray.push(
  //               Validators.minLength(nestedVal.validator)
  //               // alert("nestedVal.validator  minlength   " + nestedVal.validator)
  //             );
  //           }

  //           if (nestedVal.name === 'maxlength') {
  //             nestedValidationsArray.push(
  //               Validators.maxLength(nestedVal.validator)
  //               // alert("nestedVal.validator  maxLength   " + nestedVal.validator)
  //             );
  //           }

  //         });
  //         let value = null;
  //         value = nestedEle.value == "" ? null : nestedEle.value;
  //         nestedFormGroup[nestedEle.fieldJsonMapping] = new FormControl(value, nestedValidationsArray)
  //       })
  //       controls[res.fieldJsonMapping] = nestedFormArray;
  //       controls[res.fieldJsonMapping].push(this.fb.group(nestedFormGroup));
  //       // }
  //     }
  //   });
  //   this.CustomFilterForm = new FormGroup(
  //     controls
  //   );


  //   // if (this.formArrayKeyNameTrackArr.length > 0) {
  //   //   let counter = 0;
  //   //   let formarray: FormArray = this.CustomFilterForm.controls[this.formArrayKeyNameTrackArr[0]] as FormArray;
  //   //   this.jsonFormArrayTrack.forEach((outerelement: any) => {
  //   //     if (counter != 0) {
  //   //       let obj: any = {};
  //   //       for (let [key, value] of Object.entries(outerelement)) {
  //   //         this.fields.forEach(element => {

  //   //           if (element.fieldJsonMapping == this.formArrayKeyNameTrackArr[0]) {
  //   //             element.fieldArrayNestedData.forEach(innerelement => {
  //   //               if (innerelement.fieldJsonMapping == key) {
  //   //                 const nestedValidationsArray = [];
  //   //                 if (innerelement.validations.length > 0) {
  //   //                   innerelement.validations.forEach(nestedVal => {
  //   //                     if (nestedVal.name === 'required') {
  //   //                       nestedValidationsArray.push(
  //   //                         Validators.required
  //   //                       );
  //   //                     }
  //   //                     if (nestedVal.name === 'pattern') {
  //   //                       nestedValidationsArray.push(
  //   //                         Validators.pattern(nestedVal.validator)
  //   //                       );
  //   //                     }

  //   //                     if (nestedVal.name === 'minlength') {
  //   //                       nestedValidationsArray.push(
  //   //                         Validators.minLength(nestedVal.validator)
  //   //                       );
  //   //                     }

  //   //                     if (nestedVal.name === 'maxlength') {
  //   //                       nestedValidationsArray.push(
  //   //                         Validators.maxLength(nestedVal.validator)
  //   //                       );
  //   //                     }

  //   //                   });
  //   //                 }
  //   //                 obj[key] = new FormControl(value, nestedValidationsArray);
  //   //               }

  //   //             })
  //   //           }
  //   //         })

  //   //       }
  //   //       formarray.push(this.fb.group(obj));
  //   //     }
  //   //     counter++;
  //   //   })
  //   // }
  // }

 

  getTranslateMessages() {
    this.translateService.get([
      'TABLE_RECORDS_FOOTER_MSG',
      'NO_RECORDS_FOUND'
    ]).subscribe((value) => {
      this.currentPageReportTemplate = value.TABLE_RECORDS_FOOTER_MSG;
      this.noRecordsFound = value.NO_RECORDS_FOUND;
    });
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    // this.data = changes['data'].currentValue;
  }

  edit(col) {
    this.uttility.closToast();
    // this.openEditConfirmAlert(col)
    console.log(col);
    console.log("JSON s" + JSON.stringify(col));
    let screenDataArr = [];
    let title = '';
    let apiJsonName;
    let buttonName = ''
    apiJsonName = this.apiUrlEdit;
    title = this.tableTitle;
    buttonName = 'Submit';
    let screenType = 'edit';


    this.openImagePopoverDynamicForm(col, title, apiJsonName, buttonName, screenType);

  }

  // async openEditConfirmAlert( col) {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Please Confirm',
  //     message: 'Are you sure you want to Edit?',
  //     cssClass: 'customAlert',
  //     buttons: [

  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           console.log('Confirm Ok');
  //           this.alertCtrl.dismiss();
  //             // this.declineProcess(tabledata);

  //           }
  //         },
  //         {
  //           text: 'No',
  //           role: 'cancel',
  //           cssClass: 'secondary',
  //           handler: () => {
  //             console.log('Confirm Cancel');
  //           }
  //         }
  //     ]
  //   });

  //   await alert.present();
  // }

  editOLD(col) {
    this.uttility.closToast();
    // this.onEdit.emit(col);
    console.log(col);
    console.log("JSON s" + JSON.stringify(col));
    let title = '';
    let apiJsonName;
    let buttonName = ''
    if (this.apiUrlEdit != "language-screen-hindi") {
      apiJsonName = this.apiUrlEdit; //"language-screen";
      title = this.tableTitle;//'Language Master Description';
      buttonName = 'Submit';
    } else {
      apiJsonName = "language-screen-hindi";
      title = 'भाषा मास्टर विवरण';
      buttonName = 'प्रस्तुत';
    }
    let screenType = 'edit';

    let screenDataArr = [];

    for (let [key, value] of Object.entries(col)) {
      console.log(`${key}: ${value}`);
      let obj: any = {};
      obj.fieldJsonMapping = key;
      obj.value = value
      console.log("new obj " + JSON.stringify(obj));
      screenDataArr.push(obj);
    }
    this.openImagePopoverDynamicForm(screenDataArr, title, apiJsonName, buttonName, screenType);
  }

  async openImagePopoverDynamicForm(col, title, apiJsonName, buttonName, screenType) {

    const popover = await this.modalController.create({
      component: CommonPopupComponent,
      componentProps: {
        cssClass: 'poprepayment',
        data: col,
        title: title,
        apiJsonName: apiJsonName,
        apiUrlEditSavedData: this.apiUrlEditSavedData,
        buttonName: buttonName,
        screenType: screenType,
        apiUrlAddReqMetaData: this.apiUrlAddReqMetaData,
        apiUrlEditReqMetaData: this.apiUrlEditReqMetaData,
        apiUrlEditReqSavedData: this.apiUrlEditReqSavedData,
        apiUrlEditReqSavedDataMetaData: this.apiUrlEditReqSavedDataMetaData,
        apiSaveDataUrlReqData: this.apiSaveDataUrlReqData,
        apiUpdateDataUrlReqData: this.apiUpdateDataUrlReqData,
        apiDeleteDataUrlReqData: this.apiDeleteDataUrlReqData,
        apiSaveDataUrl: this.apiSaveDataUrl,
        apiUpdateDataUrl: this.apiUpdateDataUrl,
        submitCustomValidation: this.submitCustomValidation,
        submitCustomValidationMetaData: this.submitCustomValidationMetaData,
        submitCustomDataManupulation: this.submitCustomDataManupulation,
        modalTitle: this.modalTitle,
        changeModalTitle: this.changeModalTitle
      },
      backdropDismiss: false,
    });
    popover.onDidDismiss().then((dataReturned) => {
      if (dataReturned != null && dataReturned.role != 'backdrop' && dataReturned['data'] != undefined) {
        // this.declineApi(dataReturned['data'],tabledata);
        // this.declineshowToast(tabledata);
        this.popupClose.emit(dataReturned);

      }
    });
    await popover.present();
  }



  // async openCustomFilter(col, title, apiJsonName, buttonName, screenType) {

  //   const popover = await this.modalController.create({
  //     component: CommonPopupComponent,
  //     componentProps: {
  //       cssClass: 'poprepayment',
  //       data: col,
  //       title: title,
  //       apiJsonName: apiJsonName,
  //       apiUrlEditSavedData: this.apiUrlEditSavedData,
  //       buttonName: buttonName,
  //       screenType: screenType,
  //       apiUrlAddReqMetaData: this.apiUrlAddReqMetaData,
  //       apiUrlCustomSearchReqMataData:this.apiUrlCustomSearchReqMataData,
  //       apiUrlEditReqMetaData: this.apiUrlEditReqMetaData,
  //       apiUrlEditReqSavedData: this.apiUrlEditReqSavedData,
  //       apiUrlEditReqSavedDataMetaData: this.apiUrlEditReqSavedDataMetaData,
  //       apiSaveDataUrlReqData: this.apiSaveDataUrlReqData,
  //       apiCustomSearchDataUrlReqData: this.apiCustomSearchDataUrlReqData,
  //       apiUpdateDataUrlReqData: this.apiUpdateDataUrlReqData,
  //       apiDeleteDataUrlReqData: this.apiDeleteDataUrlReqData,
  //       apiSaveDataUrl: this.apiSaveDataUrl,
  //       apiCustomSearchDataUrl: this.apiCustomSearchDataUrl,
  //       apiUpdateDataUrl: this.apiUpdateDataUrl,
  //       submitCustomValidation: this.submitCustomValidation,
  //       submitCustomValidationMetaData: this.submitCustomValidationMetaData,
  //       submitCustomDataManupulation: this.submitCustomDataManupulation,
  //       modalTitle: this.modalTitle,
  //       changeModalTitle: this.changeModalTitle
  //     },
  //     backdropDismiss: false,
  //   });
  //   popover.onDidDismiss().then((dataReturned) => {
  //     if (dataReturned != null && dataReturned.role != 'backdrop' && dataReturned['data'] != undefined) {
  //       // this.declineApi(dataReturned['data'],tabledata);
  //       // this.declineshowToast(tabledata);
  //       this.popupClose.emit(dataReturned);

  //     }
  //   });
  //   await popover.present();
  // }

  delete(col) {
    // this.onDelete.emit(col);
    this.openAlert(col);
  }

  async openAlert(tabledata) {
    const alert = await this.alertCtrl.create({
      header: 'Please Confirm',
      message: 'Do you want to delete the record(s) ?',
      cssClass: 'customAlert',
      // buttons: ['Disagree', 'Agree']
      buttons: [

        {
          text: 'Agree',
          handler: () => {
            console.log('Confirm Ok');
            this.alertCtrl.dismiss();
            this.declineProcess(tabledata);
          }
        },
        {
          text: 'Disagree',
          role: 'cancel',

          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });

    await alert.present();
  }

  declineProcess(tabledata) {
    this.onDelete.emit(tabledata);
    // this.uttility.showToast('success','Record deleted successfully');
  }

  add() {
    this.uttility.closToast();
    // this.openAddConfirmAlert()
    let col = [];
    // this.onAdd.emit(obj);
    console.log(col);
    console.log("JSON s" + JSON.stringify(col));
    let title = '';
    let apiJsonName;
    let buttonName = ''
    apiJsonName = this.apiUrlAdd//"language-screen";
    title = this.tableTitle;
    buttonName = 'Submit';
    let screenType = 'add';

    this.openImagePopoverDynamicForm(col, title, apiJsonName, buttonName, screenType);
  }

  // async openAddConfirmAlert() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Please Confirm',
  //     message: 'Are you sure you want to ADD items?',
  //     cssClass: 'customAlert',
  //     // buttons: ['Disagree', 'Agree']
  //     buttons: [

  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           console.log('Confirm Ok');
  //           this.alertCtrl.dismiss();
  //             // this.declineProcess(tabledata);
  //           }
  //         },
  //         {
  //           text: 'No',
  //           role: 'cancel',
  //           cssClass: 'secondary',
  //           handler: () => {
  //             console.log('Confirm Cancel');
  //           }
  //         }
  //     ]
  //   });

  //   await alert.present();
  // }

  globalInput(data) {
    this.table.filterGlobal(data, 'contains');
  }
  // custom filter search - starts with aphabet
  customInputChange(data, parentData) {
    if (parentData.type == "currency") {
      let newTableMetaDataField = parentData.tableMetaDataField + ".currencyValue";
      this.table.filter(data, newTableMetaDataField, 'startsWith');
    } else {
      this.table.filter(data, parentData.tableMetaDataField, 'startsWith');
    }
  }
  // customer filter date - equals date
  formatDate(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return date.getFullYear() + '-' + month + '-' + day;
  }

  customselectedDateChange(data, parentData) {
    console.log("date changed " + data);
    if (data != null && data != "") {
      // this.table.filter(this.formatDate(data), parentData.tableMetaDataField, 'equals')
      // return;
      let newDate = null;
      let apiDateFormat = this.appConfigService.getApiDateFormat();
      console.log("apiDateFormat " + apiDateFormat);
      newDate = moment(data).format(apiDateFormat);
      console.log("NEW DATE with ApiDateFormat " + newDate);
      this.table.filter(newDate, parentData.tableMetaDataField, 'equals');
    } else {
      console.log("date is empty");
      this.table.filter('', parentData.tableMetaDataField, 'equals');
    }
  }
  customInputChange1(data, parentData) {
    // if(parentData.inputType != undefined && parentData.inputType == 'number'){
    //     if(parentData.maxlength != undefined){
    //       if (data.target.value.length > 0) {
    //         if(data.target.value.length > parentData.maxlength){
    //           parentData.value = data.target.value.slice(0,parentData.maxlength);
    //           // this.table.cd.detectChanges();
    //           // this.cd.detectChanges();
    //           // setTimeout(() => {
    //             // 
    //           // }, 0);
    //         }else{
    //           parentData.value = data.target.value;
    //         }
    //       } else {
    //         parentData.value = '';
    //       }
    //     }else{
    //       if (data.target.value.length > 0) {
    //         parentData.value = data.target.value;
    //       } else {
    //         parentData.value = '';
    //       }
    //     }
    // }else{
    //   if (data.target.value.length > 0) {
    //     parentData.value = data.target.value;
    //   } else {
    //     parentData.value = '';
    //   }
    // }

    if (data.target.value.length > 0) {
      parentData.value = data.target.value;
    } else {
      parentData.value = '';
    }

  }

  customSearch() {
    console.log("clicked search of custom");
    this.tableSelectedValue = null;
    this.customSearchClicked.emit(true);
    // add date filter logic check accordingly

    if (this.showCustomSearchFromExistingData) { // table data already present
      this.showTableEmptyMessage = true;
      console.log("inside EXSISTING TABLE DATA CUSTOM SEARCH logic");
      var filterUsedWithValues = false;
      this.customFilterData.forEach(element => {
        if (element.value != null && element.value != "") {
          console.log("filter data with -->" + element.value + "---for field---" + element.tableMetaDataField)
          filterUsedWithValues = true;
          this.table.filter(element.value, element.tableMetaDataField, 'startsWith');
        }
      });
      if (!filterUsedWithValues) {
        console.log("FILTER GLOBAL ----")
        this.table.reset();
        // clearState()
      }
      // check paginator
      console.log("check paginator---" + this.tableData.length);
      if (this.tableData.length > 0) {
        this.showTableBodyContent();
        this.showPaginator();
      } else {
        this.hideTableBodyContent();
        this.hidePaginator();
      }
    } else { // emit to parent to call api
      this.hideTableBodyContent();
      this.hidePaginator();
      this.showTableEmptyMessage = false;
      console.log("  showTableEmptyMessage$$$$$$$$$$$$$$$$$$$$$$$$  " + this.showTableEmptyMessage);

      console.log("inside API CUSTOM SEARCH logic");
      let obj: any = {};
      obj.customFilterData = this.customFilterData;
      obj.sortedCustomFilterData = [];


      this.customFilterData.forEach(element => {
        if (element.value != null && element.value != "") {
          let innerObj: any = {};
          innerObj.value = element.value;
          innerObj.tableMetaDataField = element.tableMetaDataField;

          obj.sortedCustomFilterData.push(innerObj)
        }
      });

      if (obj.sortedCustomFilterData.length > 0) {
        console.log("EMIT data to PARENT for CUSTOM API SEARCH FROM API");
        this.customTableDataApiCall.emit(obj);
      } else {
        this.showTableEmptyMessage = true;
        this.tableData = [];
        console.log("custom API search clicked but all values are empty - DONOT EMIT to PARENT");
      }
    }


  }

  customClear() {
    // this.customFilterData.forEach(element => {
    //   element.value = '';
    // });
    this.table.reset();
  }

  onLinkClick(event, data) {
    if (event) {
      console.log("stop propogation");
      event.stopPropagation();
    }
    console.log("link clicked " + JSON.stringify(data));
    this.onSelect.emit(data)
  }

  onRowSelect(data) {
    console.log("onRowSelect" + JSON.stringify(data));
    this.onSelect.emit(data);
  }

  onRowUnselect(data) {
    console.log("onRowUnselect " + JSON.stringify(data));
    this.onUnSelect.emit(data);
  }

  onFileViewClk(rowData, rowDataField) {
    // this.onFileView.emit(rowData);

    // this.viewFile(rowData,rowDataField); // showing first time file upload

    if (rowData.dmsDocRefId != null && rowData.dmsDocRefId != "") {
      let obj: any = {};
      obj.rowData = rowData;
      obj.rowDataField = rowDataField;

      this.viewFileEvent.emit(obj);
    } else {
      alert("dms uploaded file reference id not present");
    }
  }

  onInputFileUpload(files, rowData, rowDataField, index) {
    console.log("---file changed---" + files)
    console.log("---rowData changed---" + rowData)
    console.log("---rowDataField changed---" + rowDataField)
    console.log("---file content---" + files.target.files[0]);
    // lastModified: 1616396828201
    // lastModifiedDate: Mon Mar 22 2021 12:37:08 GMT+0530 (India Standard Time) {}
    // name: "111.jpg"
    // size: 39004
    // type: "image/jpeg"
    if (!rowDataField.singleSelect) {
      //pending
      // this.onFileUpload.emit();
      rowDataField.actionsView = true;
      rowDataField.actionsDelete = true;
      rowDataField.isFileSelected = true;
    } else {
      rowData.docValue = files.target.files[0];

      var file: File = files.target.files[0];
      var myReader: FileReader = new FileReader();

      var base64StringFull = null;

      myReader.onloadend = (e) => {
        base64StringFull = myReader.result;
        rowDataField.base64StringFull = myReader.result;
        console.log("base64String FULL==> " + rowDataField.base64StringFull);


        var base64StringShort = '';
        var commaPosition = null;

        commaPosition = base64StringFull.indexOf(",");
        base64StringShort = base64StringFull.substring(commaPosition + 1, base64StringFull.length);

        rowDataField.base64String = base64StringShort;

        console.log("base64 SHORT ==> " + rowDataField.base64String);


        rowDataField.mimeType = files.target.files[0].type;
        rowDataField.fileName = files.target.files[0].name;
        rowDataField.actionsView = true;
        rowDataField.actionsDelete = true;
        rowDataField.isFileSelected = true;
        console.log("mimeType ==> " + rowDataField.mimeType);
        console.log("fileName==> " + rowDataField.fileName);
        console.log("--- before emiting docValue---" + rowData.docValue);
        console.log("--- before emiting docValue---" + rowDataField);

        // console.log("fileView "+this.fileView);

        // this.fileView.nativeElement.value = '';
        // this.fileView['_results'][this.stepperIndex]
        // console.log("fileView "+this.fileView);
        // this.fileView['_results'][index].nativeElement.value = '';


        this.onFileUpload.emit(rowData);

      }
      myReader.readAsDataURL(file);


    }
  }

  onFileDeleteClk(rowData, rowDataField) {
    rowData.docValue = null;


    rowDataField.actionsView = false;
    rowDataField.actionsDelete = false;
    rowDataField.isFileSelected = false;
    rowDataField.fileName = null;
    rowDataField.base64String = null;
    rowDataField.base64StringFull = null;
    rowDataField.mimeType = null;
    this.onFileDelete.emit(rowData)
  }

  showPaginator() {
    this.paginator = true;
  }
  hidePaginator() {
    this.paginator = false;
  }

  showTableBodyContent() {
    this.showTableBody = true;
  }

  hideTableBodyContent() {
    this.showTableBody = false;
  }

  async onFileClick() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
    //   this.imagee = 'data:image/jpeg;base64,' + image.base64String;
  }

  moreDetailsClk(data) {
    console.log("data", data)
    this.onMoreDetails.emit(data);
  }
  moreDetailsClkTwo(data) {
    console.log("data", data)
    this.onMoreDetailsTwo.emit(data);
  }
  cancelApplication(data) {
    console.log("data", data)
    this.onCancelApplication.emit(data);
  }

  //eports fuctions
  exportExcel() {
    // this.uttility.showLoader();
    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.downloadData);
    //   const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    //   const excelBuffer: any = xlsx.write(workbook, {
    //     bookType: "xlsx",
    //     type: "array"
    //   });
    //   this.saveAsExcelFile(excelBuffer, "products");

    // });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // import("file-saver").then(FileSaver => {
    //   let EXCEL_TYPE =
    //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    //   let EXCEL_EXTENSION = ".xlsx";
    //   const data: Blob = new Blob([buffer], {
    //     type: EXCEL_TYPE
    //   });
    //   FileSaver.saveAs(
    //     data,
    //     fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    //   );
    // });

    // this.uttility.hideLoader();
  }

  viewFile(rowData, rowDataField) {
    this.documentViewer(rowData, rowDataField)
  }

  documentViewer(rowData, rowDataField) {
    let fileObj: any = {};
    fileObj.base64String = rowDataField.base64String;
    fileObj.base64StringFull = rowDataField.base64StringFull;
    fileObj.mimeType = rowDataField.mimeType;
    fileObj.fileName = rowDataField.fileName;

    console.log("let base64String " + fileObj.base64String);
    console.log("let mimeType " + fileObj.mimeType);

    if (this.appConfigService.getPlatformMobile()) {
      // this.forMobile();
    } else {

      this.forWeb(fileObj);
    }
  }

  forWeb(fileObj) {
    if (fileObj.mimeType == 'application/pdf') {
      fileObj.showImageViewer = false; // used in common component of popup to identify file type condition

      let byteCharacters = atob(fileObj.base64String);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: 'application/pdf;base64' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } else {
      this.openImagePopover(fileObj);
    }
  }

  async openImagePopover(fileObj) {
    fileObj.showImageViewer = true; // used in common component of popup to identify file type
    let title = 'View Image';

    const popover = await this.modalController.create({
      component: CommonPopupComponent,
      componentProps: {
        data: fileObj,
        title: title
      },
      backdropDismiss: false,
    });
    await popover.present();
  }

  // forMobile(){
  //   if(this.popoverData.mimeType=='application/pdf'){
  //   this.pdfService.openPdf(this.popoverData.base64,this.popoverData.documentName,this.popoverData.mimetype);
  //   }else{
  //   this.openImagePopover();
  //   }
  //   }

  viewFileScreen(fileBase64String) {
    // this.dynamicForm.controls[controls.fieldJsonMapping].getValue();
    // 
    let resFileFormat = "";
    resFileFormat = this.detectMimeType(fileBase64String);
    let fileFormat = "";
    if (resFileFormat == "application/pdf") {
      fileFormat = "application/pdf";
    } else {
      fileFormat = resFileFormat;
    }
    this.viewProcess(fileBase64String, fileFormat, '')
  }

  detectMimeType(b64) {
    let resFileFormat = "";
    var signatures = {
      JVBERi0: "application/pdf",
      R0lGODdh: "image/gif",
      R0lGODlh: "image/gif",
      iVBORw0KGgo: "image/png",
      "/9j/": "image/jpg"
    };

    for (var s in signatures) {
      if (b64.indexOf(s) === 0) {
        resFileFormat = signatures[s]
      }
    }
    return resFileFormat;
  }

  viewProcess(base64String, fileFormat, documentName) {

    let obj: any = {};
    obj.mimeType = fileFormat;
    obj.base64String = base64String;
    obj.base64StringFull = "data:" + obj.mimeType + ";base64," + base64String;
    obj.documentName = documentName;
    this.forWebScreen(obj);
  }

  forWebScreen(fileObj) {
    if (fileObj.mimeType == 'application/pdf') {
      fileObj.showImageViewer = false; // used in common component of popup to identify file type condition

      let byteCharacters = atob(fileObj.base64String);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: 'application/pdf;base64' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } else {
      // this.openImagePopover(fileObj);
      this.openImageInWindow(fileObj)
    }
  }


  openImageInWindow(fileObj) {
    var image = new Image();
    // image.src = "data:image/png;base64," + fileObj.base64String;
    image.src = fileObj.base64StringFull;
    var w = window.open("");
    w.document.write(image.outerHTML);
    return;
  }


}



// added pagination logic
// show hide body logic
// custom search from existing data and api calling filter data logic



//https://stackblitz.com/edit/primeng-tabledoc-demo?file=src%2Fapp%2Fapp.component.ts
