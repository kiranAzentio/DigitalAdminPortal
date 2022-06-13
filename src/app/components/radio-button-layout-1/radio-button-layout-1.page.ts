import { Component, Output, EventEmitter, SimpleChanges, Input, OnChanges, AfterViewInit, forwardRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';

@Component({
  selector: 'digital-cs-radio-button-layout-1',
  templateUrl: 'radio-button-layout-1.page.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonLayout1Page),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RadioButtonLayout1Page),
      multi: true,
    }
  ],
  styleUrls: ['radio-button-layout-1.page.scss'],
})
export class RadioButtonLayout1Page implements OnChanges, AfterViewInit {
  @Input() data: any = [];
  @Input() required: boolean = false;
  @Output() onItemClick = new EventEmitter();
  @Input() selectedItem: any;
  @Input() title: any;
  @Input() showTitle: boolean = true;
  @Input() bluelabelbool: boolean = false;
  @Input() readonly: boolean = false;
  @Input() readOnlyHeight: any;


  @Input() control: FormControl;
  @Input() metaData: any;
  @Input() parentFormData: any;
  @Input() onPageLoadGetData: boolean = false;
  @Input() apiUrl: any;
  @Input() ToggleApiUrl: any;
  @Input() valueId: string;
  @Input() valueDesc: string;
  @Input() toggle: boolean = false;;

  // @Input() toggleMetaData: any;
  @Input() dataToggle: any = [];
  @Input() selectedToggleItem: any;
  @Input() valueVaraible: any;
  @Input() checkedToogleId: any;
  @Input() uncheckedToogleId: any;
  @Input() formControlNameLabel: any;

  @Output() onToggleItemClick = new EventEmitter();

  @Output() radioActionArr = new EventEmitter<any>();

  isOnline: boolean = false;


  constructor(private utilityService: UtilityService) { }

  ngAfterViewInit() {
    console.log("radio metaData " + this.metaData);
    console.log("radio apiUrl " + this.apiUrl);
    console.log("Radio parentFormData " + JSON.stringify(this.parentFormData));
    console.log("required : " + this.required);
    console.log("title : " + this.title);
    console.log("data : " + this.data);
    console.log("onPageLoadGetData : " + this.onPageLoadGetData);
    if (this.onPageLoadGetData) {
      // alert(this.apiUrl)
      if (this.formControlNameLabel == "status" || this.formControlNameLabel == "isSynchronise" || this.formControlNameLabel == "active" || this.formControlNameLabel == "passwordContainsUpperCaseCharacters" || this.formControlNameLabel == "passwordContainsLowerCaseCharacters" || this.formControlNameLabel == "passwordContainsSpecialCharacters" || this.formControlNameLabel == "passwordContainsDigits" || this.formControlNameLabel == "passwordShouldNotBeSameAsUsername" || this.formControlNameLabel == "passwordShouldNotBeDirectoryName" || this.formControlNameLabel == "AutoSyncYesOrNoFlag" || this.formControlNameLabel == "jobStatus" || this.formControlNameLabel == "flag" || this.formControlNameLabel == "registeredAdd" || this.formControlNameLabel == "conIslFalg" || this.formControlNameLabel == "comDefFalg" || this.formControlNameLabel == "extraFlag1" || this.formControlNameLabel == "extraFlag2" || this.formControlNameLabel == "branchType" ||this.formControlNameLabel == "langDir" || this.formControlNameLabel == "langDefault" || this.formControlNameLabel == "pwdValExtra" || this.formControlNameLabel == "pwdValRegExp" || this.formControlNameLabel == "polDefault" || this.formControlNameLabel == "channels" || this.formControlNameLabel == "menuPosition" || this.formControlNameLabel == "menuLevel" || this.formControlNameLabel == "type") {
        let dummyData: any = [];
        if (this.formControlNameLabel == "status" || this.formControlNameLabel == "extraFlag1" || this.formControlNameLabel == "extraFlag2") {
          dummyData = [
            {
              "id": "A",
              "label": "Active"
            },
            {
              "id": "X",
              "label": "Inactive"
            }
          ]
          
          if (dummyData.id == "I"){
            dummyData = [
              {
                "id": "A",
                "label": "Active"
              },
              {
                "id": "I",
                "label": "Inactive"
              }
            ]
          }

        } else if (this.formControlNameLabel == "isSynchronise" || this.formControlNameLabel == "active") {
          dummyData = [
            {
              "id": 1,
              "label": "Yes"
            },
            {
              "id": 2,
              "label": "No"
            }
          ]
        }
        else if (this.formControlNameLabel == "channels" ) {
          dummyData = [
            {
              "value": 1,
              "label": "All Channels"
            },
            {
              "value": 2,
              "label": "Web"
            },
            {
              "value": 3,
              "label": "Mobile"
            }
          ]
        }
        else if (this.formControlNameLabel == "passwordContainsUpperCaseCharacters" || this.formControlNameLabel == "passwordContainsLowerCaseCharacters" || this.formControlNameLabel == "passwordContainsSpecialCharacters" || this.formControlNameLabel == "passwordContainsDigits" || this.formControlNameLabel == "passwordShouldNotBeSameAsUsername" || this.formControlNameLabel == "passwordShouldNotBeDirectoryName" || this.formControlNameLabel == "AutoSyncYesOrNoFlag" || this.formControlNameLabel == "registeredAdd" || this.formControlNameLabel == "comDefFalg" || this.formControlNameLabel == "langDefault" || this.formControlNameLabel == "pwdValExtra" || this.formControlNameLabel == "pwdValRegExp" || this.formControlNameLabel == "polDefault"){
          dummyData = [
            {
              "id": "Y",
              "label": "Yes"
            },
            {
              "id": "N",
              "label": "No"
            }
          ]
        }else if(this.formControlNameLabel == "flag"){
          dummyData = [
            {
              "value": "C",
              "label": "Company"
            },
            {
              "value": "A",
              "label": "Agency"
            },
            {
              "value": "B",
              "label": "Both Company and Agency"
            }
          ]
        }else if(this.formControlNameLabel == "menuPosition"){
          dummyData = [
            {
              "value": "L",
              "label": "Left Hand Side"
            },
            {
              "value": "T",
              "label": "Top Menus"
            },
            {
              "value": "B",
              "label": "Bottom"
            },
            {
              "value": "R",
              "label": "Right Hand Side"
            }
          ]
        }else if(this.formControlNameLabel == "menuLevel"){
          dummyData = [
            {
              "value": 1,
              "label": "First Level"
            },
            {
              "value": 2,
              "label": "Second Level"
            },
            {
              "value": 3,
              "label": "Third Level"
            }
          ]
        }else if(this.formControlNameLabel == "branchType"){
          dummyData = [
            {
              "value": "H",
              "label": "Head office"
            },
            {
              "value": "R",
              "label": "Regional Office"
            },
            {
              "value": "B",
              "label": "Branch"
            }
          ]
        }else if (this.formControlNameLabel == "conIslFalg"){
          dummyData = [
            {
              "id": "C",
              "label": "Conventional"
            },
            {
              "id": "I",
              "label": "Islamic"
            }
          ]
        }else if (this.formControlNameLabel == "langDir"){
          dummyData = [
            {
              "id": "LTR",
              "label": "Left to Right"
            },
            {
              "id": "RTL",
              "label": "Right to Left"
            }
          ]
        }else if (this.formControlNameLabel == "type")
        {
          dummyData = [
            {
              "id": "P",
              "label": "Promotion"
            },
            {
              "id": "O",
              "label": "Offer"
            }
          ]
        }else if (this.formControlNameLabel == "jobStatus"){
          dummyData = [
            {
              "value": "C",
              "label": "Complete"
            },
            {
              "value": "P",
              "label": "Pending"
            },
            {
              "value": "B",
              "label": "Failed"
            }
          ]
        }

        this.data = dummyData;
        console.log("valueVaraible : " + this.valueVaraible)
        if (this.valueVaraible != undefined && this.valueVaraible != null && this.valueVaraible != "") {
          this.selectedItem = this.valueVaraible;
          console.log("selectedItem  : " + this.selectedItem)
          this.propagateChange(this.selectedItem);
          if (this.valueVaraible == this.checkedToogleId) {
            this.isOnline = true;
          } else {
            this.isOnline = false;
          }
        }
      } else {
        this.getApiDataFromRadioMetaData();
      }
    }


  }

  getApiDataFromRadioMetaData() {
    // console.log("Radio parentFormData onchange " + JSON.stringify(this.parentFormData));
    // console.log("RadioMetaData " + this.RadioMetaData);

    this.metaData.forEach(element => {
      let obj: any = {};
      obj[element] = this.parentFormData[element];
      console.log("radio obj : " + obj)
    });
    let objForPost = null;
    console.log("obj to be pass  " + JSON.stringify(objForPost));
    console.log("apiUrl :  " + this.apiUrl);
    // let url = "MetaDataJson/" + this.apiUrl + "";
    let url = this.apiUrl;
    console.log("radio  url : " + url);

    this.utilityService.getJsonData(url).subscribe((data: any) => {
      this.utilityService.hideLoader();
      // this.data = data.body;
      var getDatafromJson = data.body;

      console.log("Radio data : " + JSON.stringify(getDatafromJson))
      getDatafromJson.forEach(element => {
        let obj: any = {};
        obj.value = element[this.valueId]
        obj.label = element[this.valueDesc]
        this.data.push(obj);
      });
      console.log("new data : " + JSON.stringify(data));

      console.log("valueVaraible : " + this.valueVaraible)
      if (this.valueVaraible != undefined && this.valueVaraible != null && this.valueVaraible != "") {
        this.selectedItem = this.valueVaraible;
        console.log("selectedItem  : " + this.selectedItem)
        this.propagateChange(this.selectedItem);
        if (this.valueVaraible == this.checkedToogleId) {
          this.isOnline = true;
        } else {
          this.isOnline = false;
        }
      }

    }, err => {
      alert("getting radio data json error" + JSON.stringify(err));
    })

  }

  ionChangeTest(data) {
    console.log("toogle change " + data);
    console.log("toogle change " + JSON.stringify(data));
    // alert("test "+data);
    this.isOnline = !this.isOnline;
    if (this.isOnline) {
      // this.selectedItem = "100"; // checkedToogleId chi value assign kar
      this.selectedItem = this.checkedToogleId;
  
    } else {
      // this.selectedItem = "200"; //8nchecked chi value
      this.selectedItem = this.uncheckedToogleId;
    
    }
    console.log("toogle selectedItem " + this.selectedItem);
    this.propagateChange(this.selectedItem);
    this.onItemClick.emit(this.selectedItem); //check this and hange***pending
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    // if(changes['data'] == undefined){
    //   this.selectedItem = changes.selectedItem.currentValue;
    // }else{
    //   this.data = changes['data'].currentValue;
    // }
  }

  private propagateChange = (_: any) => { };

  writeValue(obj: any): void {
    this.selectedItem = obj;
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
    // alert("inside radio");    
    if (this.required && (this.selectedItem == null || this.selectedItem == "")) {
      // alert("radio error");
      return {
        "radio": { valid: false }
      }
    } else {
      // alert("radio clearr");        
      return null;
    }
  }
  registerOnValidatorChange?(fn: () => void): void {
    // throw new Error("Method not implemented.");
  }

  onItemClickFunc(item, event): void {
    console.log("child radio selectedItem---------" + this.selectedItem);
    this.selectedItem = item.value;
    this.propagateChange(this.selectedItem);
    console.log("child radio data before emiting---------" + JSON.stringify(item));
    this.onItemClick.emit(item);
  }

  setSelectedItem(val) {
    this.selectedItem = val;
  }
}
