import { Component, Output, EventEmitter, SimpleChanges,Input, OnChanges, AfterViewInit,forwardRef, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';

@Component({
  selector: 'digital-text-box',
  templateUrl: 'text-box.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextBoxComponent),
      multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TextBoxComponent),
        multi: true,
      }
  ],
  styleUrls: ['text-box.component.scss'],
})
export class TextBoxComponent implements OnChanges,ControlValueAccessor,Validator,OnInit {
  @Input() data: any;

  @Input() enteredText:any;
  @Input() title: any;  
  @Input() placeholder:any = 'ENTER_TEXT_PLACEHOLDER';

  @Input() disabled:boolean=false;
  @Input() readonly:boolean=false;
  @Input() required:boolean=false;
  @Input() inputmode:string;
  @Input() maxlength:string;
  @Input() minlength:string;
  @Input() inputType:string = 'text';
  @Input() blockCopyPasteProcessFlag:boolean = false;

  @Input() customValidation:boolean = false;
  @Input() emailValidation: boolean = false;
  
// @Input() parentTableData:any;

  @Output() onBlur = new EventEmitter();
  @Output() onInput = new EventEmitter();

  
  @Input() showTitle:boolean = true;



  constructor(
    public appConfig: AppConfigService
  ) { 
  }

  ngOnInit() {
    }

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
    //  added for reactive form testing 08-20-2021
     this.enteredText = obj;
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
      if(this.required && (this.enteredText == null || this.enteredText == "") ){
          return {
              "inp" :{valid:false}
          }
      }else if(this.customValidation){
        if(this.emailValidation){
          if(!this.required && (this.enteredText == "" || this.enteredText == null )){
            return null;
          }else if(!this.appConfig.emailRegex.test(this.enteredText)){
            return {
              "pattern" :{valid:false}
          }
          }else{
            return null;
          }
        }else{
          return null;
        }
      }else{
          return null;
      }
  }
  registerOnValidatorChange?(fn: () => void): void {
     // throw new Error("Method not implemented.");
  }

  onInputVal(val){
    // console.log("on input "+val);
    this.enteredText = val;
    this.propagateChange(this.enteredText);
    // console.log("on input  before emitting "+this.enteredText);
    this.onInput.emit(this.enteredText);
  }

  emitBlurValue(){
    // alert("this.enteredText " + this.parentTableData)
    
    this.onBlur.emit(this.enteredText);
  } 
}
