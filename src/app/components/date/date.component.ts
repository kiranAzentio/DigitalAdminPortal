import { Component, OnInit, forwardRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Input, Output, EventEmitter, OnChanges, DoCheck, SimpleChanges } from "@angular/core";
// import * as moment from 'moment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';


@Component({
  selector: 'digital-app-date',
  templateUrl: './date.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateComponent),
      multi: true,
    }
  ],
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit, ControlValueAccessor, Validator, OnChanges, AfterViewInit {
  // npm install moment --save
  //optionalfor below -ref
  // https://stackoverflow.com/questions/39765338/add-moment-to-angular-2-angular-cli
  //  npm install @types/moment --save
  //   "scripts": [
  //     "../node_modules/moment/min/moment.min.js"
  //  ]
  dateFormat: string;
  @Input() title: any = '';
  @Input() placeholder: any = 'SELECT_DATE_PLACEHOLDER'
  @Input() formControlNameLabel: string = '';

  // @Input('selectedDate') selectedDate: Moment;
  @Input('selectedDate') selectedDate;
  @Input('name') name;
  @Input() isDisabled: Boolean = false;
  @Input() readonly: Boolean = false;
  @Input() required: Boolean = false;
  // @Input('maxDate')maxDate = "2022-12-09";
  // @Input('maxDate') maxDate = "2040-12-09";  
  // @Input('minDate') minDate = new Date().toISOString().split('T')[0];
  // @Input('minDate') minDate = "2000-01-01"; 
  // @Input('minDate') minDate = new Date('2000-01-01');   
  // @Input('maxDate') maxDate = new Date('2040-01-01'); 
  @Input('minDate') minDate: any;
  @Input('maxDate') maxDate: any;
  @Input() dynamicForm: any;
@Input() showTime :boolean = false;
  @Input() defaultDate: Date;
  @Input() disabled: boolean = false;
  @Input() isShow: Boolean = true;
  // @Input()displayFormat = "DD/MM/YYYY"; //not in use;appconfig comman variable is used
  @Input() displayFormat: string;
  @Input() onPageLoadGetData: boolean = false;


  maxDateObj: Date;
  minDateObj: Date;
  @Output() selectedDateChange = new EventEmitter();
  displayContent: boolean = false;

  customPickerOptions;
  yearRange = "1947:2040"
  @Input() boot: boolean = false;

  constructor(
    private ref: ChangeDetectorRef,
    public appconfig: AppConfigService
    // this.defaultDate= new Date(this.appConfig.sparam_businessDate)
  ) {
    // if(this.appconfig.getPlatformMobile()){
    // this.displayFormat = this.appconfig.getDateDisplayFormat();
    // this.minDate = "1900-01-01";
    // this.maxDate = "2040-01-01"; 
    // }else{
    this.displayFormat = this.appconfig.getDateDisplaySmallFormat();
    this.minDate = new Date('1900-01-01');
    this.maxDate = new Date('2040-01-01');
    // }

    this.customPickerOptions = {
      buttons: [
        {
          text: 'SAVE',
          handler: (event) => {
            // alert("handler save")
            console.log("event" + JSON.stringify(event));
            console.log("save clicked" + this.selectedDate);
            var newDate = new Date();
            var hours = newDate.getHours();
            var minutes = newDate.getMinutes();
            var seconds = newDate.getSeconds();
            var ms = newDate.getMilliseconds();
            // console.log("save clicked date changed"+ new Date(this.selectedDate)); 
            // console.log(new Date(event.year.value, event.month.value -1, event.day.value))
            if (this.displayFormat == "MM/YYYY") {
              this.selectedDate = new Date(event.year.value, event.month.value - 1);
            } else {
              this.selectedDate = new Date(event.year.value, event.month.value - 1, event.day.value, hours, minutes, seconds, ms);
            }
          }
        },
        {
          text: 'CANCEL',
          handler: () => {
            console.log("cancel clicked" + this.selectedDate);
            this.selectedDate = null;
          }
        }
      ]
    }
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    console.log(changes);
    // this.selectedDateChange = changes.selectedDate.currentValue;

    // if(this.selectedDate == undefined ){
    //   this.selectedDateChange = changes['data'].currentValue;
    // }else{
    //   this.selectedDateChange = changes.selectedDate.currentValue;
    // }
  }

  ngOnInit() {
    // this.bindDatabaseDate()
    console.log("placeholder" + this.placeholder)
    if (this.selectedDate == undefined) {
      // this.selectedDate = new Date().toISOString().split('T')[0]







      // uncomment below 01-09-2020*******
      // this.selectedDate = new Date().toLocaleDateString().split('T')[0] // gives MM/dd/yyyy hh:mm:ss .if you need ISO 8601, use below







      //mydate:string = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000 )).toISOstring.slice(0, -1);

      // or npm install moment --S
      // import moment from 'moment';
      // this.mydate = moment.format()
    }
    // if(this.maxDate!= undefined){
    //     this.maxDateObj = this.maxDate.toDate();
    //   }else{
    //     this.maxDateObj =  new Date("2100-12-31");
    // }
    // if(this.minDate!= undefined){
    //     this.minDateObj =  this.minDate.toDate();
    //   }else{
    //     this.minDateObj =  new Date("1970-12-31");
    // }
    // this.dateFormat=this.calendarService.dateFormat;
  }

  ngAfterViewInit() {
    // this.displayContent = true;
    this.ref.detectChanges();
    // alert(this.onPageLoadGetData)
    // this.bindDatabaseDate()
    // this.selectedDate = new Date();
    // alert("this.selectedDate :"+ this.selectedDate);
    // this.dynamicForm.controls[this.formControlNameLabel].setValue(this.selectedDate);
    if (this.onPageLoadGetData) {
    
      this.bindDatabaseDate()
    }
   
    // if (this.dynamicForm != undefined) {
    //   let storeValue = null;
    //   // this.selectedDate = new Date();
    //   // this.dynamicForm.controls[this.formControlNameLabel].setValue(this.selectedDate);

    //   storeValue = this.dynamicForm.controls[this.formControlNameLabel].value;
    //   if (storeValue != null) {
    //     this.selectedDate = new Date(storeValue);
    //     this.dynamicForm.controls[this.formControlNameLabel].setValue(this.selectedDate);
    //   }
    // }

  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  bindDatabaseDate(){
    if (this.dynamicForm != undefined) {
      let storeValue = null;
      // this.selectedDate = new Date();
      // this.dynamicForm.controls[this.formControlNameLabel].setValue(this.selectedDate);

      storeValue = this.dynamicForm.controls[this.formControlNameLabel].value;
      // alert("storeValue :"+ storeValue);
      if (storeValue != null) {
        this.selectedDate = new Date(storeValue);
        this.dynamicForm.controls[this.formControlNameLabel].setValue(this.selectedDate);
      }
    }
  }



  private propagateChange = (_: any) => { };

  writeValue(obj: any): void {
    // this.selectedDate = obj;
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
    // alert("validte")
    if (this.required && this.selectedDate === null) {
      return {
        "date": { valid: false }
      }
    } else {
      return null;
    }
    // throw new Error("Method not implemented.");
  }
  registerOnValidatorChange?(fn: () => void): void {
    // throw new Error("Method not implemented.");
  }
  onChange(obj) {
    // alert("on change"+this.selectedDate);
    this.propagateChange(this.selectedDate);
    this.selectedDateChange.emit(this.selectedDate);
  }

  onCancel(obj) {
    // alert("cancel");
    this.selectedDate = null;
    this.propagateChange(this.selectedDate);
    this.selectedDateChange.emit(this.selectedDate);
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.ref.detectChanges();
  // }
  // ngDoCheck(): void {
  //   this.ref.detectChanges();
  // }
}
