import { Component, OnInit, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';
import { DateComponent } from '../date/date.component';
import { RadioButtonLayout1Page } from '../radio-button-layout-1/radio-button-layout-1.page';
import { SelectLayout1Page } from '../select-layout-1/select-layout-1.page';
import * as moment from 'moment';
import { DatagridService } from '../../services/shared/data-grid/data-grid.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';

@Component({
  selector: 'digital-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {

  @ViewChildren('dropdownref') dropdownref: SelectLayout1Page;
  @ViewChildren('RadioRef') RadioRef: RadioButtonLayout1Page;

  @ViewChildren('dateRef') dateRef: DateComponent;

  @Input() dynamicForm = null;
  @Input() parentThis = null;
  @Input() JsonidentifierComponentList;

  @Input() screenType;

  @Input() fields;
  @Input() buttonName;
  @Input() buttonName2;
  @Input() isFormSubmitted: boolean = false;

  @Output() onSubmitClk = new EventEmitter();
  @Output() onFileUpload = new EventEmitter();
  @Output() onCancelClk = new EventEmitter();
  // @Output() isDuplicate = new EventEmitter();
  isDuplicate: boolean;
  uniqueKeyFromControlName: any;

  // gridId: number = null;
  @Input() subGridId;

  kbytes: any;
  ConvertedselectedFromDate: any;
  ConvertedselectedStartDate: any;
  newJsonTableData: any;

  xs: number; // xs  100%  Don't set the grid width for xs screens

  sm: number; //sm 540px Set grid width to 540px when (min-width: 576px)

  md: number; //md 720px Set grid width to 720px when (min-width: 768px)

  lg: number; //lg 960px Set grid width to 960px when (min-width: 992px)

  xl: number; //xl 1140px  Set grid width to 1140px when (min-width: 1200px)

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private utilityService: UtilityService,
    private _DatagridService: DatagridService,
    private alertCtrl: AlertController,
    private appConfig: AppConfigService
  ) {
    this.xl = 6; this.lg = 6; this.md = 6;
    this.sm = 12; this.xs = 12; // setting 2 fields in rows for small/extra small devices
  }

  ngOnInit() {
    this.utilityService.jsonTableSubject.subscribe((data) => {
      this.newJsonTableData = data[0];
    })
  }


  onSubmit(event) {

    // alert("formarray"+formarray)
    if (event) {
      event.stopPropagation();
    }
    this.isFormSubmitted = true;

    if (this.isDuplicate) {
      this.utilityService.showToast("error", `${this.uniqueKeyFromControlName} fields should be unique`);
      return;
      // this.dynamicForm.valid = false;
      // this.dynamicForm.setErrors({ 'invalid': true })
    } else {
      if (this.dynamicForm.valid) {
        this.openAddEditConfirmAlert()
        // this.onSubmitClk.emit(this.dynamicForm.value)
      }
      // this.dynamicForm.valid = true;
    }

    // if (this.dynamicForm.valid) {
    //   this.openAddEditConfirmAlert()
    //   // this.onSubmitClk.emit(this.dynamicForm.value)
    // }
  }

  async openAddEditConfirmAlert() {
    let message = 'Do you want to save the record ?';
    let header = "Confirm";
    // put cndtn here // hya form madhe tula screen type bhetla pahije -- simple lgic ahe..now cjeck
    if (this.screenType == "edit") {
      message = 'Do you want to update the record ?';
    }
    if (this.screenType == "customFilter") {
      message = 'Do you want to Search in the record ?';
    }
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      cssClass: 'customAlert',
      // buttons: ['Disagree', 'Agree']
      buttons: [

        {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Ok');
            this.alertCtrl.dismiss();
            // this.declineProcess(tabledata);
            if (!this.isDuplicate) {
              this.onSubmitClk.emit(this.dynamicForm.value)
            }
            // this.onSubmitClk.emit(this.dynamicForm.value)
          }
        },
        {
          text: 'No',
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



  CheckUniqueKey(fieldJsonMapping) {
    console.log("newJsonTableData" + this.newJsonTableData)
    const keyToInputMap = {
      key: "key",
      roleCode: "roleCode"
    };
    if (!keyToInputMap[fieldJsonMapping]) {
      return;
    }




    // let req: any = {};
    // if (fieldJsonMapping == "key") {
    //   req.menuconId = 107;
    // } else if(fieldJsonMapping == "roleCode") {
    //   req.menuconId = 115;
    // }
    // req.gridId = ""; // NOT IN USE here as we are getting data bby menuConid
    // req.langId = 1;

    // let url = "datagrid";

    let keyValue = this.dynamicForm.controls[fieldJsonMapping].value;
    if (fieldJsonMapping == "key" || fieldJsonMapping == "roleCode") {

      this.uniqueKeyFromControlName = fieldJsonMapping;

      this.isDuplicate = this.newJsonTableData.jsonTableData.filter(e => {
        const obj = keyToInputMap[fieldJsonMapping];
        return e[obj] == keyValue;

        // if(e.key){
        //   e.key === keyValue
        // }else if(e.roleCode){
        //   e.roleCode === keyValue
        // }
        // e.key == keyValue || e.roleCode == keyValue
        // console.log("this.isDuplicate" +  this.isDuplicate )
        // if(fieldJsonMapping == "key") {
        //   e.key === keyValue
        // }else if(fieldJsonMapping == "roleCode") {
        //   e.roleCode === keyValue
        // }
      }
      ).length > 0;
    }


    // this.utilityService.callPostApi(req, url).then((res: any) => {
    //   res.forEach((element: any) => {
    //     this.isDuplicate = element.jsonTableData.filter(e =>{
    //       if(e.key){
    //         e.key === keyValue
    //       }else if(e.roleCode){
    //         e.roleCode === keyValue
    //       }
    //       // e.key == keyValue || e.roleCode == keyValue
    //       // console.log("this.isDuplicate" +  this.isDuplicate )
    //       // if(fieldJsonMapping == "key") {
    //       //   e.key === keyValue
    //       // }else if(fieldJsonMapping == "roleCode") {
    //       //   e.roleCode === keyValue
    //       // }
    //     }
    //     ).length > 0;
    // console.log("this.isDuplicate" +  this.isDuplicate )
    // element.jsonTableData.forEach((InnerElement: any) => {
    //   console.log(JSON.stringify(InnerElement.key));
    //   if(InnerElement.key == this.dynamicForm.controls[fieldJsonMapping].value ){

    //     // alert("key exist")
    //     // this.isDuplicate.emit(true)
    //     this.isDuplicate = true;
    //     // this.utilityService.showToast("error", `${fieldJsonMapping} fields should be unique`);
    //     // this.dynamicForm.form.controls['key'].setErrors({'incorrect': true});
    //     // this.dynamicForm.setErrors({ 'invalid': true });

    //   }else{
    //     // alert("key not exist")
    //     this.isDuplicate = false;
    //   }
    // })
    // })
    // });


  }

  addNestedParentForm(controls, formarray) {
    let formarrayVar = formarray as FormArray;
    // alert("formarrayVar"+formarrayVar)
    // formarrayVar.push(
    //   Validators.pattern(/^[0-9]+$/)
    // );
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
            Validators.pattern(nestedVal.validator)
            // Validators.pattern(/^[0-9]+$/)
          );
        }

        if (nestedVal.name === 'minlength') {
          nestedValidationsArray.push(
            Validators.minLength(nestedVal.validator)
            // Validators.pattern(/^[0-9]+$/)
          );
        }

        if (nestedVal.name === 'maxlength') {
          nestedValidationsArray.push(
            Validators.maxLength(nestedVal.validator)
            // Validators.pattern(/^[0-9]+$/)
          );
        }

      });
      // obj[nestedEle.fieldJsonMapping]  = [''] // add validation here
      obj[nestedEle.fieldJsonMapping] = new FormControl(null, nestedValidationsArray)
    })

    formarrayVar.push(
      this.fb.group(obj)
    );
  }

  deleteNestedForm(index, controls, formarray) {
    let formarrayVar = formarray as FormArray;
    formarrayVar.removeAt(index);
  }

  // nested dropdown change
  nestedDropdownChange(val1, val2) {

  }

  dropdownChange(data, controlsData, fieldJsonMapping) {
    // alert("fieldJsonMapping" + fieldJsonMapping)
    console.log("dropdown data " + JSON.stringify(data));
    console.log("controlsData  " + JSON.stringify(controlsData));
    // data find 94
    //loop
    if (controlsData.onChangeMetaData != undefined) {
      controlsData.onChangeMetaData.forEach(element => {
        if (element.clear) {
          console.log("make null other dropdown data with formcontrolname as " + element.fieldJsonMapping);
          this.dynamicForm.controls[element.fieldJsonMapping].setValue(null);

          if (this.dropdownref['_results'].length > 0) {
            this.dropdownref['_results'].forEach(innerELeTop => {
              if (innerELeTop.formControlNameLabel == element.fieldJsonMapping) {
                innerELeTop.emptyArrayData();
              }
            });
          }

          console.log("dropdownref " + this.dropdownref);
          if (element.additionalData != undefined && element.additionalData != null &&
            element.additionalData == true) {
            data.forEach(InerElement => {
              if (this.dynamicForm.controls[fieldJsonMapping].value == InerElement.id) {
                // alert("1")
                let value = null;
                // value = InerElement[element.]
                if (this.dropdownref['_results'].length > 0) {
                  this.dropdownref['_results'].forEach(innerELe => {

                    if (innerELe.formControlNameLabel == element.fieldJsonMapping) {
                      // alert("2"+ "innerELe.formControlNameLabel :"+innerELe.formControlNameLabel + "" +"element.fieldJsonMapping"+element.fieldJsonMapping)

                      let obj = {};
                      let dataPresent = false;
                      element.additionalDataLableArr.forEach(elementOut => {
                        if (InerElement[elementOut] == null || InerElement[elementOut] == "") {
                          dataPresent = false;
                        } else {
                          obj[":" + elementOut] = InerElement[elementOut];
                          dataPresent = true;
                        }

                      });
                      if (dataPresent) {
                        innerELe.createAdditionMataData(obj);
                        return;
                      }

                    }
                  });
                }
              }
            });
            // if (this.dropdownref['_results'].length > 0) {
            //   this.dropdownref['_results'].forEach(innerELe => {
            //     if (innerELe.formControlNameLabel == element.fieldJsonMapping) {
            //       let obj = {};
            //       element.additionalDataLableArr.forEach(element => {
            //         obj[element] = null;
            //       });
            //       innerELe.createAdditionMataData(obj);
            //       return;
            //     }
            //   });
            // }
          } else {
            if (this.dropdownref['_results'].length > 0) {
              this.dropdownref['_results'].forEach(innerELe => {
                if (innerELe.formControlNameLabel == element.fieldJsonMapping) {
                  // innerELe.getApiDataFromMetaData()
                  // java api
                  // innerELe.getApiDataFromMetaDataJava();
                  // db madhe edit mode madhe pn tak - pahila add screen chck kar mg tak

                  innerELe.getApiDataFromMetaDataUsingSettingForm(this.dynamicForm.value);
                  return;
                }
              });
            }
          }

        } else {
          //set other logic here of assigning d
        }
      });
    } else {
      alert("onChangeMetaData not confired in json - make it empty array")
    }
  }
  radioActionFunc(data, controlsData) {
    console.log("radio Data: " + JSON.stringify(data))
    console.log("radio controlsData  " + JSON.stringify(controlsData));
  }

  ToggleActionFunc(data, controlsData, fields) {
    console.log("toggle Data: " + JSON.stringify(data))
    console.log("toggle controlsData  " + JSON.stringify(controlsData));
    console.log(" fields  " + JSON.stringify(fields));
    if (controlsData.ManupulateManditoryFileds) {
      fields.forEach(element => {
        controlsData.ManupulateManditoryFileds.forEach(InnerElement => {
          if (InnerElement.fieldJsonMapping == element.fieldJsonMapping) {
            if (data == "1" || data == "Y") {
              element.validations[0].name = InnerElement.name;
              element.validations[0].validator = InnerElement.validator;
              this.dynamicForm.controls[InnerElement.fieldJsonMapping].setValidators(Validators.required)
            } else {
              element.validations[0].name = "not in use";
              element.validations[0].validator = "not in use";
              this.dynamicForm.controls[InnerElement.fieldJsonMapping].clearValidators();
              this.dynamicForm.controls[InnerElement.fieldJsonMapping].updateValueAndValidity();
            }
          }
        });
      });
    }



    // if (controlsData.fieldJsonMapping == "passwordContainsUpperCaseCharacters") {
    //   if (data == "Y") {

    //     this.dynamicForm.controls['minimumUpperCaseCharacters'].setValidators(Validators.required)
    //     this.dynamicForm.controls['minimumUpperCaseCharacters'].updateValueAndValidity();
    //   } else {
    //     this.dynamicForm.controls['minimumUpperCaseCharacters'].clearValidators();
    //     this.dynamicForm.controls['minimumUpperCaseCharacters'].updateValueAndValidity();
    //   }

    // } else if (data == "1") {
    //   if (controlsData.fieldJsonMapping == "isSynchronise") {

    //   }
    // }

    // if (data == "1" && controlsData.fieldJsonMapping == "isSynchronise") {
    //   fields.forEach(element => {
    //     if (element.fieldJsonMapping == "syncParentKey") {
    //       element.validations[0].name = "required";
    //       element.validations[0].validator = "required";
    //     }
    //   });
    //   // alert("isSynchronise is true");
    //   // this.dynamicForm.controls['syncParentKey'].setValidators(Validators.required)
    //   // this.dynamicForm.controls['syncParentKey'].updateValueAndValidity();
    //   // this.dynamicForm.form.get('syncParentKey').setValidators([Validators.required])
    //   // this.dynamicForm.form.get('syncParentKey').updateValueAndValidity();
    // } else {
    //   // if (controlsData.fieldJsonMapping == "isSynchronise") {
    //   //   this.dynamicForm.controls['syncParentKey'].clearValidators();
    //   //   this.dynamicForm.controls['syncParentKey'].updateValueAndValidity();
    //   // }

    // }
  }

  // date field single level
  // customselectedDateChange(val,controlsData){
  //   console.log("dropdown data " + JSON.stringify(val));
  //   console.log("controlsData  " + JSON.stringify(controlsData));

  //   // check onChangeCondition in metadata and make other formcontrolfield as null / set min - max ***pending
  // }


  formArrayselectedDateChange(val, nestedcontrolsData) {
    console.log("dropdown data " + JSON.stringify(val));
    console.log("nestedcontrolsData  " + JSON.stringify(nestedcontrolsData));
  }


  // data change
  customselectedDateChange(val, controlsData, fields) {

    if(controlsData.fieldJsonMapping == "synchon"){

    }

    if (controlsData.onChangeMetaData != undefined) {
      controlsData.onChangeMetaData.forEach(element => {
        if (element.clear != undefined && element.clear) {
          this.dynamicForm.controls[element.fieldJsonMapping].setValue(null);
          let selectedstartDate = this.dynamicForm.controls[controlsData.fieldJsonMapping].value;
          // alert("selectedstartDate : " + selectedstartDate)
          // use moment geting value in zonal format     // 
          // this.ConvertedselectedFromDate = moment(selectedstartDate).format('DD/MM/YYYY HH:mm:ss');
          // alert("ConvertedselectedFromDate : " + this.ConvertedselectedFromDate)
          // use moment          // 

          let selectedEndDate = this.dynamicForm.controls[element.fieldJsonMapping].value;
          // alert("selectedEndDate : " + selectedEndDate)
          // if (selectedEndDate != null) {
          // use moment geting value in zonal format     // 
          // this.ConvertedselectedStartDate = moment(selectedEndDate).format('DD/MM/YYYY HH:mm:ss');
          // alert("ConvertedselectedFromDate : " + this.ConvertedselectedFromDate)
          // use moment          // 
          // }


        } if (element.maxDate != undefined && element.maxDate) {
          let selectedstartDate = this.dynamicForm.controls[controlsData.fieldJsonMapping].value;
          this.dynamicForm.controls[element.fieldJsonMapping].setValue(selectedstartDate);
          // this.dynamicForm.controls[element.fieldJsonMapping].setValue(this.ConvertedselectedFromDate);
          fields.forEach(innerEle => {
            if (innerEle.fieldJsonMapping == element.fieldJsonMapping) {
              innerEle.maxDate = selectedstartDate;
              return;
            }
          });
        } if (element.minDate != undefined && element.minDate) {
          let selectedEndDate = this.dynamicForm.controls[controlsData.fieldJsonMapping].value;
          this.dynamicForm.controls[element.fieldJsonMapping].setValue(selectedEndDate);
          fields.forEach(innerEle => {
            if (innerEle.fieldJsonMapping == element.fieldJsonMapping) {
              innerEle.minDate = selectedEndDate;
              return;
            }
          });
        }

        else {
          //set other logic here of assigning d
        }
      });
    } else {
      alert("onChangeMetaData not confired in json - make it empty array")
    }

    // if (controlsData.onChangeMetaData != undefined) {
    //   controlsData.onChangeMetaData.forEach(element => {
    //     if (element.clear != undefined && element.clear) {
    //       this.dynamicForm.controls[element.fieldJsonMapping].setValue(null);
    //       let selectedFromDate = this.dynamicForm.controls[controlsData.fieldJsonMapping].value;
    //       // use moment geting value in zonal format     // 
    //       this.ConvertedselectedFromDate = moment(selectedFromDate).format('DD/MM/YYYY');
    //       // use moment          // 

    //       let selectedStartDate = this.dynamicForm.controls[element.fieldJsonMapping].value;
    //       // use moment geting value in zonal format     // 
    //       this.ConvertedselectedStartDate = moment(selectedStartDate).format('DD/MM/YYYY');
    //       // use moment          // 

    //     } if (element.maxDate != undefined && element.maxDate) {
    //       let selectedFromDate = this.dynamicForm.controls[controlsData.fieldJsonMapping].value;
    //       this.dynamicForm.controls[element.fieldJsonMapping].setValue(selectedFromDate);
    //       fields.forEach(innerEle => {
    //         if (innerEle.fieldJsonMapping == element.fieldJsonMapping) {
    //           innerEle.maxDate = selectedFromDate;
    //           return;
    //         }
    //       });
    //     } if (element.minDate != undefined && element.minDate) {
    //       let selectedStartDate = this.dynamicForm.controls[controlsData.fieldJsonMapping].value;
    //       this.dynamicForm.controls[element.fieldJsonMapping].setValue(selectedStartDate);
    //       fields.forEach(innerEle => {
    //         if (innerEle.fieldJsonMapping == element.fieldJsonMapping) {
    //           innerEle.minDate = selectedStartDate;
    //           return;
    //         }
    //       });
    //     }

    //     else {
    //       //set other logic here of assigning d
    //     }
    //   });
    // } else {
    //   alert("onChangeMetaData not confired in json - make it empty array")
    // }

  }

  // file upload

  onInputFileUploadNew(val, controls, fields, index, parentControl) {
    console.log("file data " + JSON.stringify(val));
    console.log("file control data  " + JSON.stringify(controls));
    console.log("fields data " + JSON.stringify(fields));

    controls.docValue = val.target.files[0];

    var file: File = val.target.files[0];
    var myReader: FileReader = new FileReader();

    //check file type
    let fileTypeArr :any[] = controls.accetpFileType.split(",");
    if(fileTypeArr.length > 0 && fileTypeArr.includes(file.type)){
      console.log("everyhting is ok");
    }else{
      let decider = fileTypeArr.length < 2 ? "is" : "are"
      this.utilityService.showToast("error",`File type ${controls.accetpFileType} ${decider} supported` );
      return;
    }

    //check file size
    if(file.size){
     let fileSize = +(file.size / (1024 * 1024)).toFixed(2);
     if(fileSize > this.appConfig.getMaxFileSize()){
      this.utilityService.showToast("error",`Maximum file limit is ${this.appConfig.getMaxFileSize()} MB and you have uploaded ${fileSize} MB` );
      return; 
    }
     
    }

    var base64StringFull = null;

    myReader.onloadend = (e) => {
      base64StringFull = myReader.result;
      // alert("base64StringFull : " + base64StringFull);
      // rowDataField.base64StringFull = myReader.result;
      // console.log("base64String FULL==> " + rowDataField.base64StringFull);
      this.calculateImageSize(base64StringFull)

      var base64StringShort = '';
      var commaPosition = null;

      commaPosition = base64StringFull.indexOf(",");
      base64StringShort = base64StringFull.substring(commaPosition + 1, base64StringFull.length);
      // alert("base64StringShort : " + base64StringShort);

      // rowDataField.base64String = base64StringShort;

      // console.log("base64 SHORT ==> " + rowDataField.base64String);

      var mimeType = "";
      mimeType = val.target.files[0].type;
      // alert("mimeType : " + mimeType);
      var fileName = "";
      fileName = val.target.files[0].name;
      // alert("fileName : " + fileName);


      let obj = {
        "base64full": base64StringFull,
        "base64shortString": base64StringShort,
        "mimeType": mimeType,
        "fileName": fileName,
        "fileSize": this.kbytes
      }

      console.log("obj" + JSON.stringify(obj))
      controls.value = obj;

      // let file = JSON.stringify(obj) // <--- File Object for future use.
      // this.dynamicForm.controls[controls.fieldJsonMapping].setValue(file ? fileName : 'kajal'); // <-- Set Value for Validation

      // this.dynamicForm.controls['document'].setValue(file ? fileName : '');
      // this.dynamicForm.controls['image1'].setValue("kajal");
      // this.dynamicForm.controls[controls.fieldJsonMapping].value = JSON.stringify(obj);
      // alert("alert1 : "+ this.dynamicForm.controls[controls.fieldJsonMapping].value)
      // this.dynamicForm.controls[controls.fieldJsonMapping].setValue(JSON.stringify(obj))
      // fields.forEach(element => {
      //   // for array
      //   if (element.identifier == "array") {
      //     alert("hi kajal its array" )
      //     element.fieldArrayNestedData.forEach(innerEle => {
      //       if(innerEle.identifier == "file"){
      //         if(innerEle.fieldJsonMapping == controls.fieldJsonMapping ){
      //           alert("hi kajal its file"+controls.fieldJsonMapping )
      //           this.dynamicForm.controls[innerEle.fieldJsonMapping].setValue(base64StringShort);
      //         }
      //       }
      //     })

      //   }else{
      //     // for normal form
      //     // this.dynamicForm.controls[controls.fieldJsonMapping].setValue(base64StringShort);
      //   }
      //   this.dynamicForm.controls[controls.fieldJsonMapping].setValue(base64StringShort);
      // })
      // var index 
      if (index != null) {
        // debugger;
        let a = this.dynamicForm.controls[parentControl.fieldJsonMapping] as FormArray;
        let b = a.controls[index].get(controls.fieldJsonMapping).setValue(base64StringShort);
      } else {
        this.dynamicForm.controls[controls.fieldJsonMapping].setValue(base64StringShort);
      }
      // this.dynamicForm.controls[controls.fieldJsonMapping].setValue(base64StringShort);



      // alert("alert 2 :" + this.dynamicForm.controls[controls.fieldJsonMapping].value)
      // this.dynamicForm.get(controls.fieldJsonMapping).clearValidators();
      // this.dynamicForm.get(controls.fieldJsonMapping).updateValueAndValidity();

      // this.dynamicForm.controls[controls.fieldJsonMapping].setValue(controls.value);

      // alert("controls.fieldJsonMapping : "+ controls.fieldJsonMapping)
      // console.log("controls to check value" + JSON.stringify(controls))
      // rowDataField.actionsView = true;
      // rowDataField.actionsDelete = true;
      // rowDataField.isFileSelected = true;
      // console.log("mimeType ==> " + rowDataField.mimeType);
      // console.log("fileName==> " + rowDataField.fileName);
      // console.log("--- before emiting docValue---" + rowData.docValue);
      // console.log("--- before emiting docValue---" + rowDataField);

      // console.log("fileView "+this.fileView);

      // this.fileView.nativeElement.value = '';
      // this.fileView['_results'][this.stepperIndex]
      // console.log("fileView "+this.fileView);
      // this.fileView['_results'][index].nativeElement.value = '';


      // if(this.screenType == "edit"){
      //   this.dynamicForm.controls['image1'].setValue("kajal");
      // }

      this.onFileUpload.emit(controls);

    }

    // this.dynamicForm.controls["document"].setValue("kajal");
    myReader.readAsDataURL(file);
  }

  calculateImageSize(base64String) {
    let padding;
    let inBytes;
    let base64StringLength;
    if (base64String.endsWith('==')) { padding = 2; }
    else if (base64String.endsWith('=')) { padding = 1; }
    else { padding = 0; }

    base64StringLength = base64String.length;
    console.log(base64StringLength);
    inBytes = (base64StringLength / 4) * 3 - padding;
    console.log(inBytes);
    this.kbytes = inBytes / 1000;
    // alert("file size: " + this.kbytes)

    return this.kbytes;
  }

  onCancel() {
    this.onCancelClk.emit(true);
  }

  viewFile(fileBase64String) {
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
    this.forWeb(obj);
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

  async openImagePopover(fileObj) {
    fileObj.showImageViewer = true; // used in common component of popup to identify file type
    let title = 'View Image';
    alert("show image in popup");
    // const popover = await this.modalController.create({
    // component:CommonPopupComponent,
    // componentProps:{
    // data:fileObj,
    // title:title
    // },
    // backdropDismiss:false,
    // });
    // await popover.present();
  }

}








// https://stackblitz.com/edit/dynamic-form-generate-from-json-angular-2-reactive-form

// form arrray
// https://stackblitz.com/edit/angular6-dynamic-form-array
// https://medium.com/aubergine-solutions/add-push-and-remove-form-fields-dynamically-to-formarray-with-reactive-forms-in-angular-acf61b4a2afe

// <form [formGroup]="demoForm">
//    <div formArrayName="demoArray" 
//       *ngFor="let arrayItem of arrayItems; let i=index">

//       <input [id]="arrayItem.id" type="checkbox"
//          [formControl]="demoArray[i]">
//       <label [for]="arrayItem.id" class="array-item-title">
//          {{arrayItem.title}}</label>

//    </div>
// </form>

// this.demoForm = this._formBuilder.group({
//   demoArray: this._formBuilder.array(
//                 [],this.minSelectedCheckboxes()
//              )
//   });


// get demoArray() {
//   return this.demoForm.get('demoArray') as FormArray;
// }
// addItem(item) {
//   this.arrayItems.push(item);
//   this.demoArray.push(this._formBuilder.control(false));
// }
// removeItem() {
//   this.arrayItems.pop();
//   this.demoArray.removeAt(this.demoArray.length - 1);
// }

// minSelectedCheckboxes(): ValidatorFn {
//   const validator: ValidatorFn = (formArray: FormArray) => {

//      const selectedCount = formArray.controls
//         .map(control => control.value)
//         .reduce((prev, next) => next ? prev + next : prev, 0);

//      return selectedCount >= 1 ? null : { notSelected: true };
//   };

//   return validator;
// }