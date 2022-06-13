import { Component, OnInit,Output, EventEmitter, Input  } from '@angular/core';

@Component({
  selector: 'digital-stepper-buttons',
  templateUrl: './stepper-buttons.component.html',
  styleUrls: ['./stepper-buttons.component.scss'],
})
export class StepperButtonsComponent implements OnInit {

  @Input() showColLeft:boolean = true;
  @Input() showColMiddle:boolean = true;
  @Input() showColRight:boolean = true;

  @Input() showPreviousBtn:boolean = false;
  @Input() showNextBtn:boolean = false;

  @Input() showCustomBtn:boolean = false;
  @Input() showFinishBtn:boolean = false;

  @Input() showAcceptBtn:boolean = false;
  @Input() showRejectBtn:boolean = false;

  @Input() btnTextCustom:string = 'SUBMIT';
  @Input() btnTextNext:string = 'SAVE & NEXT';


  
  @Output() onPreviousBtnClick = new EventEmitter();
  @Output() onNextBtnClick = new EventEmitter();
  @Output() onCustomBtnClick = new EventEmitter();
  @Output() onFinishBtnClick = new EventEmitter();
  @Output() onRejectBtnClick = new EventEmitter();
  @Output() onAcceptBtnClick = new EventEmitter();

  

  constructor() { 
   
  }

  ngOnInit() {}

  onPrevious(event){
    if (event) {
      event.stopPropagation();
    }
    this.onPreviousBtnClick.emit(true);
  }
  onCustom(event){
    if (event) {
      event.stopPropagation();
    }
    this.onCustomBtnClick.emit(true);
  }
  onNext(event){
    if (event) {
      event.stopPropagation();
    }
    this.onNextBtnClick.emit(true);
  
  }
  onFinish(event){
    if (event) {
      event.stopPropagation();
    }
    this.onFinishBtnClick.emit(true);
  
  }
  onReject(event){
    if (event) {
      event.stopPropagation();
    }
    this.onRejectBtnClick.emit(true);

  }
  onAccept(event){
    if (event) {
      event.stopPropagation();
    }
    this.onAcceptBtnClick.emit(true);

  }
}
