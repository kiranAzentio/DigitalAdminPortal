import { Component, Output, EventEmitter, SimpleChanges,Input, OnChanges, AfterViewInit,forwardRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Component({
  selector: 'digital-cs-check-box-layout-1',
  templateUrl: 'check-box-layout-1.page.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckBoxLayout1Page),
      multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => CheckBoxLayout1Page),
        multi: true,
      }
  ],
  styleUrls: ['check-box-layout-1.page.scss'],
})
export class CheckBoxLayout1Page implements OnChanges {
  @Input() data: any;
  @Input() required:boolean=false;
  @Input() selectedItem: any;
  @Input() title: any;  
  @Input() showTitle:boolean = true;
  @Input() showInlineCss:boolean = true

  @Output() onItemClick = new EventEmitter();


  constructor() { }

  ngOnChanges(changes: { [propKey: string]: any }) {
    // this.data = changes['data'].currentValue;
  }

  private propagateChange = (_: any) => { };
  
  writeValue(obj: any): void {
    //  this.selectedItem = obj;
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
      if(this.required && (this.selectedItem == null || this.selectedItem == "") ){
          return {
              "checkbox" :{valid:false}
          }
      }else{
          return null;
      }
  }
  registerOnValidatorChange?(fn: () => void): void {
     // throw new Error("Method not implemented.");
  }

  onItemClickFunc(item): void {
    if (event) {
      event.stopPropagation();
    }

    this.selectedItem = [];

    if(this.data.length > 0){
      this.data.forEach(element => {
        if(element.isChecked){
          this.selectedItem.push(element.value);
        }
      });
    this.propagateChange(this.selectedItem);    
    this.onItemClick.emit(item);
    }

    // this.selectedItem = item.value;
    // this.propagateChange(this.selectedItem);    
    // this.onItemClick.emit(item);
  }
  setCheckBoxData(val){
    this.data = val;
  }
}
