import { Component, Output,OnInit, EventEmitter, ViewChild,SimpleChanges,Input, OnChanges, AfterViewInit,forwardRef, ChangeDetectorRef } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { CustomCurrencyPipe } from '../pipes/CustomCurrencyPipe';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'digital-app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
       useExisting: forwardRef(() => NumberInputComponent),
      multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => NumberInputComponent),
        multi: true,
    },
    CustomCurrencyPipe,
    CurrencyPipe]
})
export class NumberInputComponent implements OnInit {

  @Input() currencyType: string;
  @Input() required:boolean = false;
  @Input() placeholder:string;
  @Input() label:string ;  
  @Input() readonly: boolean = false;
  @Input() show: boolean = true;
  @Input() isNegativeValueAllowed: boolean = false;
  @Input() disabled: boolean = false;
  @Input() field: any;
  @Input() currCode = this.appConfig.getDomesticCurrencyLabel(); 
  @Input() doCurrencyFormatting:boolean = true; 
  @Input() showInlineCurrencySymbol:boolean = true; 

  @Input()  currencyInputWidth:any =null
  @Input()  currencyWidth:any =null

  @Output() amountEntered = new EventEmitter<number>();
  @Output() amountcontinousEntered = new EventEmitter<number>();
  @Output() amountcontinousEnteredOnBlur = new EventEmitter<number>();



  currField: any;
  regbool:boolean = false;

  @Input() control:FormControl;

  

  constructor(private currencyPipe: CurrencyPipe,
              public appConfig:AppConfigService,
              private cd:ChangeDetectorRef,
              private customCurrencyPipe:CustomCurrencyPipe) { }

  ngOnInit() {
  
    // try{
    //   if(typeof this.control.validator == 'function'){
    //     this.required = true;
    //   }
    // }catch(e){
    //   alert("errpr "+JSON.stringify(e));
    // }
    
    }
 

  private propagateChange = (_: any) => {};

  writeValue(obj: any): void { console.log("write"); // this.field = obj;
  }
  registerOnChange(fn: any): void { this.propagateChange = fn;}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  validate(c: AbstractControl): { [key: string]: any; } {
    this.regbool = false;
    if (this.required && (this.field == null || this.field == "" || this.field == undefined)) {
      this.regbool = false;      
      return {
        "curr" :{valid:false}
      }
    }
    else if(this.field != undefined && !this.appConfig.customNumericWithDecimal.test(this.field)){
      this.regbool = true;      
      console.log("not a valid numberor -- max length condition is not satisfied");
        return {
        "pattern" : true
      }
    }else{
      this.regbool = false;  
      return null;
    }
  }

  //use this on input change or from parent on EDIT MODE to format 
  formatCurrency(val,currCode?,type?){    

    if(type == undefined){ //programatically
      this.currCode = currCode ? currCode : this.currCode;
    }
    if(this.currCode == "" || this.currCode == null || this.currCode == undefined){
      this.currCode = this.appConfig.getDomesticCurrencyLabel();
    }
   
      this.currField = null;

      if(type == undefined && this.doCurrencyFormatting){ //programatically && CURRENCY FORMATTING
        var localVal = null;
        localVal = this.appConfig.valueToFixedOnCurrency(val,this.currCode);
        this.field = this.removeNonDigit(localVal);        
      }else{ // MANUAL(checked and done on BLUR ) or NUMBER
        this.field = this.removeNonDigit(val);
      }
      this.cd.detectChanges();   
      this.propagateChange(this.field);
      if(this.doCurrencyFormatting){ // CURRENCY FORMATTING
        if(this.showInlineCurrencySymbol){
          this.currField = this.customCurrencyPipe.transform(this.field, this.currCode,'symbol', this.appConfig.getCurrencyPipeLimit());        
        }else{
          this.currField = this.customCurrencyPipe.transform(this.field, this.currCode,'', this.appConfig.getCurrencyPipeLimit());        
        }
      }else{ // NUMBER
        if(this.field != null && this.field != ""){
          var dotDigit = null;
          var extractedDotDigit = null;
          var currencyFormat = null;
          var decimaldigReg =  /\d+\.\d+/;


          dotDigit = this.field.toString().search(/\d./);

          if(decimaldigReg.test(this.field)){ 
              // alert("number with dot and after number"+value);
              var currFormat = '';
              currFormat = this.currencyPipe.transform(this.field,this.currCode,'',this.appConfig.getCurrencyPipeLimit());

              var splited:any = '';
              splited = this.field.split(".");
              console.log("splited"+splited);

              const extractSymbolDigit = currFormat.search(/\d/);
              
              var formattedBeforeDecimal:any = '';
              formattedBeforeDecimal = currFormat.split(".");  

              currencyFormat = currFormat.substring(0, extractSymbolDigit) + '' +formattedBeforeDecimal[0].substring(extractSymbolDigit) +"."+ splited[1];
              console.log("currencyFormat to return "+currencyFormat);                
              this.currField = currencyFormat;

              
          }else if(this.field.includes(".")){
              // alert("number with dot"+value);                
              currencyFormat = this.currencyPipe.transform(this.field.slice(0,this.field.length - 1),this.currCode,'',this.appConfig.getCurrencyPipeLimit());
              extractedDotDigit = this.field.substring(dotDigit);                
          }else{
              currencyFormat = this.currencyPipe.transform(this.field,this.currCode,'',this.appConfig.getCurrencyPipeLimit());                
          }
          if(currencyFormat != undefined && currencyFormat != "" && currencyFormat != null){
              const firstDigit = currencyFormat.search(/\d/);               
              if(extractedDotDigit != null){
                this.currField = currencyFormat.substring(0, firstDigit) + '' + currencyFormat.substring(firstDigit) +".";
              }else{
                this.currField =  currencyFormat.substring(0, firstDigit) + '' + currencyFormat.substring(firstDigit);
              }
          }
      }else{
        this.currField = null;
      }
      }
      this.amountcontinousEntered.emit(+this.field);
  }


  detectChangesExtNull(){
    this.currField = null;
    // this.cd.detectChanges();   
  }
  
  emitValue(){ // on BLUR - MANUALLY DO FORMATTING on BLUR
    if(this.doCurrencyFormatting){
      var val = null;
      val = this.appConfig.valueToFixedOnCurrency(this.field,this.currCode);
      this.formatCurrency(val,this.currCode);
    }
    console.log("----------------BLUR emitting value to parent ---"+this.field);  
    this.amountcontinousEnteredOnBlur.emit(+this.field);
    this.amountEntered.emit(+this.field);
  }

  removeNonDigit(value){
    if (value != null && value != undefined && value != "") {
      if (this.isNegativeValueAllowed) {
        value = value.toString().replace(/[^0-9.-]/g, "");
      } else {
        value = value.toString().replace(/[^0-9.]/g, "");
      }
      if(isNaN(value)){
        return value.slice(0,value.length - 1) //improper number
      }else{
        return value; // proper valid number
      }
    }
    return value;
  }

  changeCurrencyType(currCode){
    if(this.currCode == "" || this.currCode == null){
      currCode = this.appConfig.getDomesticCurrencyLabel;
    }
    this.currCode = currCode;
    
    if(this.showInlineCurrencySymbol){
      this.currField = this.customCurrencyPipe.transform(this.field, currCode,'symbol', this.appConfig.getCurrencyPipeLimit());       
    }
    else{
      this.currField = this.customCurrencyPipe.transform(this.field, currCode,'', this.appConfig.getCurrencyPipeLimit());       
    }
  }

  
}
