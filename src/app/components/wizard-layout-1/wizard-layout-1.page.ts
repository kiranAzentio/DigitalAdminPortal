import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  AfterViewInit,
  DoCheck,
  ViewChildren,
  OnDestroy,
  HostBinding,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'digital-cs-wizard-layout-1',
  templateUrl: 'wizard-layout-1.page.html',
  styleUrls: ['wizard-layout-1.page.scss'],
})
export class WizardLayout1Page implements OnChanges, OnInit, AfterViewInit, DoCheck, OnDestroy {
  @ViewChildren('editForm') editForm;
  @ViewChild(IonSlides) slides: IonSlides;

  @Input() data: any;
  @Output() onFinish = new EventEmitter();
  @Output() onNext = new EventEmitter();
  @Output() onPrevious = new EventEmitter();
  @Output() addDriverEmitter = new EventEmitter();

  stepperIndex: number = 0;
  // @ViewChild('editForm',{static:true}) editForm :NgForm;
  // @ViewChild('editForm',{static:false}) editForm :NgForm;

  @ViewChild('wizardSlider', { static: false }) slider;

  sliderOptions = {
    // pager: true,
    pagination: {
      el: 'swiper-pagination',
      clickable: true,
      renderBulltet: function (index, className) {
        return '<span class=" ' + className + ' ">' + (index + 1) + '</span>';
      },
    },
  };
  viewEntered = false;
  prev = false;
  next = true;
  finish = false;
  ignoreDidChange = false;
  showInputfield: boolean = false;

  constructor(private cd: ChangeDetectorRef) {
    console.log('cons');

    this.prev = false;
    this.next = true;
    this.finish = false;
    this.ignoreDidChange = true;

    // alert("wizard cons");
    // if(this.editForm){
    //   this.editForm.form.valueChanges.subscribe(data =>{
    //     alert("form change"+data);
    //   })
    // }
  }

  ngOnInit() {
    // console.log(this.data.items[0].title === 'string');
    console.log('wizard init');
    // console.log("wizard init"+JSON.stringify(this.data));
    if (this.data != null && this.data.items.length > 0) {
      if (this.data.items[0].title === 'string') {
        this.enableNext = true;
      }
    }
  }

  ionViewWillEnter() {
    // alert("wizard did enter");
    // this.slides.lockSwipes(true);
  }

  ngAfterViewInit() {
    this.viewEntered = true;
    console.log('wizard after view init');
    // console.log('wizard after view init'+JSON.stringify(this.data));

    this.checkInitialValidStatus();

    setTimeout(() => {
      // this.slides.lockSwipes(true);
      this.slider.lockSwipes(true);
    }, 500);

    // this.editForm.statusChanges.subscribe(data=>{
    //   console.log("form status changed"+data);
    // });

    // this.editForm.valueChanges.subscribe(result=>{
    //   console.log("form value changed"+result);
    // })
  }

  private propagateChange = (_: any) => {};

  checkInitialValidStatus() {
    console.log('check initial preassigned valid status' + this.data.stepsArray[0].validStatus);
    // alert("wizard initkal"+ this.data.stepsArray[0].validStatus);
    if (this.data.stepsArray[0].validStatus) {
      // alert("initialcheck TRUE "+this.data.stepsArray[0].validStatus);
      this.enableNext = true;
    } else {
      // alert("initialcheck FALSE "+this.data.stepsArray[0].validStatus);
      this.enableNext = false;
    }
    this.cd.detectChanges();
    // this.propagateChange(this.enableNext);
  }

  ngOnChanges(changes: { [propKey: string]: any }) {
    console.log("===========================");    
    console.log("inside ng on changes")
    // this.data = changes['data'].currentValue;
    // this.ionSlideReachStart();
  }

  ngDoCheck() {
    // console.log("do check");
    // console.log(this.editForm['_results']);
    // if (this.data) {
    //   if (this.editForm && this.editForm['_results'] != undefined) {
    //     if (this.editForm['_results'] != undefined && this.editForm['_results'].length > 0) {
    //       console.log(this.editForm['_results']);
    //       this.editForm['_results'][this.stepperIndex].statusChanges.subscribe((data) => {
    //         console.log('form status changed for index--->' + this.stepperIndex + '+ and it is ' + data);
    //         if (data == 'VALID') {
    //           this.data.stepsArray[this.stepperIndex].validStatus = true;
    //           this.enableNext = true;
    //           console.log('do check - ENABLE NEXT TRUE');
    //         } else {
    //           this.data.stepsArray[this.stepperIndex].validStatus = false;
    //           this.enableNext = false;
    //           console.log('do check - ENABLE NEXT FALSE');
    //         }
    //       });
    //     } else {
    //       // alert("eee")
    //       // this.data.stepsArray[this.stepperIndex].validStatus = true;
    //     }
    //     if (this.editForm['_results'][this.stepperIndex] != undefined) {
    //       this.editForm['_results'][this.stepperIndex].valueChanges.subscribe((result) => {
    //         console.log('form value changed' + result);
    //       });
    //     }
    //   }
    //   this.disbaleFinalButton();
    // }
  }

  onFinishFunc() {
    if (event) {
      event.stopPropagation();
    }
    // ADD SWIPES LOCK
    this.onFinish.emit(true);
  }

  enableNext: boolean = false;
  onNextFunc() {
    if (event) {
      event.stopPropagation();
    }

    // EMIt data to parent and dts it..in parent call api of updation and on success use viewchild and call below code (put below code in function)
    // ADD SWIPES LOCK

    if (this.data.stepsArray[this.stepperIndex].validStatus) {
      var obj = {
        index: this.stepperIndex,
        data: this.data.items[this.stepperIndex].noFormData,
      };
      this.onNext.emit(obj);

      // this.slider.lockSwipes(false);

      // this.slider.slideNext(300);

      // this.stepperIndex = this.stepperIndex + 1;

      // if (this.data.stepsArray[this.stepperIndex].type == 'token') {
      //   this.data.stepsArray[this.stepperIndex].validStatus = true;

      //   // this.disbaleFinalButton();
      // }

      // // otp
      // if (this.data.stepsArray[this.stepperIndex].type == 'otp') {
      //   //
      //   this.data.items.forEach((element) => {
      //     if (element.title == 'OTP' && element.noFormData[0].showScreen != undefined && !element.noFormData[0].showScreen) {
      //       element.noFormData[0].showScreen = true;
      //     }
      //   });

      //   // this.disbaleFinalButton();
      // }

      // if (this.data.stepsArray[this.stepperIndex].validStatus) {
      //   this.enableNext = true;
      // } else {
      //   this.enableNext = false;
      // }

      // this.prev = this.data.stepsArray[this.stepperIndex].showPrevious;
      // this.next = this.data.stepsArray[this.stepperIndex].showNext;
      // this.finish = this.data.stepsArray[this.stepperIndex].showfinish;

      // setTimeout(() => {
      //   this.slider.lockSwipes(true);
      // }, 100);
    } else {
      alert('invalid form');
      this.slider.slidePrev(300);
    }
  }

  // CALL THIS METHOD FROM PARENT ON SUCCESS OF UPDATE API

  parentEnableDisbaleNextButton(index, bool) {
    this.data.stepsArray[index].validStatus = bool;
  }

  parentNextFunction() {
    this.slider.lockSwipes(false);

    this.slider.slideNext(300);

    
    if (this.data.stepsArray[this.stepperIndex].validStatus) {
      // alert("inside valid   " + this.stepperIndex);
      // 15-02-2021 *** stepper checkbox enable on updated value in database
      this.data.stepsArray[this.stepperIndex].validUpdatedStatus = true;
    } else {
      // alert("inside invalid   "+ this.stepperIndex);      
      // 15-02-2021 *** stepper checkbox enable on updated value in database      
      this.data.stepsArray[this.stepperIndex].validUpdatedStatus = false;      
    }

    this.stepperIndex = this.stepperIndex + 1;

    if (this.data.stepsArray[this.stepperIndex].type == 'token') {
      this.data.stepsArray[this.stepperIndex].validStatus = true;

      // this.disbaleFinalButton();
    }

    // otp
    if (this.data.stepsArray[this.stepperIndex].type == 'otp') {
      //
      this.data.items.forEach((element) => {
        if (element.title == 'OTP' && element.noFormData[0].showScreen != undefined && !element.noFormData[0].showScreen) {
          element.noFormData[0].showScreen = true;
        }
      });

      // this.disbaleFinalButton();
    }

    if (this.data.stepsArray[this.stepperIndex].validStatus) {
      this.enableNext = true;
    } else {
      this.enableNext = false;
    }

    this.prev = this.data.stepsArray[this.stepperIndex].showPrevious;
    this.next = this.data.stepsArray[this.stepperIndex].showNext;
    this.finish = this.data.stepsArray[this.stepperIndex].showfinish;

    setTimeout(() => {
      this.slider.lockSwipes(true);
    }, 100);
  }

  onPreviousFunc() {
    // ADD SWIPES LOCK
    this.slider.lockSwipes(false);
    this.stepperIndex = this.stepperIndex - 1;

    if (this.stepperIndex == 0) {
      this.prev = false;
    }

    if (this.data.stepsArray[this.stepperIndex].validStatus) {
      this.enableNext = true;
    } else {
      this.enableNext = false;
    }
    // this.onPrevious.emit();
    this.slider.slidePrev(300);

    setTimeout(() => {
      this.slider.lockSwipes(true);
    }, 100);
  }

  ionSlideReachStart() {
    console.log('ion slide started* ');
    // this.prev = false;
    // this.next = true;
    // this.finish = false;
    // this.ignoreDidChange = true;
  }

  ionSlideReachEnd() {
    console.log('ion slide reached end *****');
    // this.prev = true;
    // this.next = false;
    // this.finish = false;
    // this.ignoreDidChange = true;
  }

  ionSlideDidChange() {
    console.log('ion slide did change');
    // if (this.ignoreDidChange) {
    //   this.ignoreDidChange = false;
    // } else {
    //   this.prev = true;
    //   this.next = true;
    // }
    // this.checkBetweenSlides();
  }

  checkBetweenSlides() {
    console.log(this.stepperIndex);
    console.log('ARAY length' + this.data.stepsArray.length);
    if (this.stepperIndex == 0) {
      // first
      console.log('first stepper');
      this.prev = false;
      this.next = true;
      this.finish = false;
    } else if (this.stepperIndex == this.data.stepsArray.length - 1) {
      //last
      console.log('last stepper');
      this.prev = true;
      this.next = false;
      this.finish = true;
    } else {
      //between
      console.log('between stepper');
      this.prev = true;
      this.next = true;
      this.finish = false;
    }
  }
  onStepClick(index) {
    // ADD SWIPES LOCK
    // console.log("steps clicked"+index);
    // this.stepperIndex = index;
    // this.checkBetweenSlides();
    // this.slider.slideTo(index);
    // this.ignoreDidChange = true;
  }

  // slideNext
  onChangeOfDropdown(data) {
    if (data.selectedItem != null) {
      this.data.stepsArray[this.stepperIndex].validStatus = true;
      console.log(data.selectedItem);
      this.enableNext = true;
    } else {
      this.data.stepsArray[this.stepperIndex].validStatus = false;
      this.enableNext = false;
    }
  }

  onChangeOfDropdownArray(data, index, dropdownArray) {
    console.log(data.selectedItem);

    if (data.selectedItem != null) {
      var isInvalid = false;
      dropdownArray.forEach((element) => {
        if (element.value == null) {
          console.log(element);
          isInvalid = true;
        }
        if (isInvalid) {
          this.data.stepsArray[this.stepperIndex].validStatus = false;
          this.enableNext = false;
        } else {
          this.data.stepsArray[this.stepperIndex].validStatus = true;
          this.enableNext = true;
        }
      });
    } else {
      this.data.stepsArray[this.stepperIndex].validStatus = false;
      this.enableNext = false;
    }

    // if (data.selectedItem != null) {
    //   // this.data.stepsArray[this.stepperIndex].validStatus = true;
    //   // console.log(data.selectedItem);
    //   // this.enableNext = true;
    //   this.data.items.forEach((element) => {
    //     if (element.title == 'MULTIPLE DROPDOWN') {
    //       if (element.noFormData.length > 0) {
    //         var isInvalid = false;
    //         element.noFormData[0].dropDownArray.forEach((innerElement) => {
    //           if (innerElement.value == null) {
    //             isInvalid = true;
    //           }
    //         });
    //         if (isInvalid) {
    //           // form is Invalid
    //           // alert('304 Invalid');
    //           this.data.stepsArray[this.stepperIndex].validStatus = false;
    //           console.log(data.selectedItem);
    //           this.enableNext = false;
    //         } else {
    //           //form is valid
    //           // alert('320 Valid');
    //           this.data.stepsArray[this.stepperIndex].validStatus = true;
    //           console.log(data.selectedItem);
    //           this.enableNext = true;
    //         }
    //       }
    //     }
    //   });
    // } else {
    //   // alert('329 Invalid clear');
    //   this.data.stepsArray[this.stepperIndex].validStatus = false;
    //   console.log(data.selectedItem);
    //   this.enableNext = false;
    // }
  }
  onChangeOfMultipleRadio(data) {
    // this.data.radioButton.valueSelected = data.value;
    console.log(data);

    // this.data.stepsArray[this.stepperIndex].validStatus = true;
    // console.log(data.selectedItem);
    // this.enableNext = true;
    this.data.items.forEach((element) => {
      if (element.title == 'RADIO INPUT') {
        if (element.noFormData.length > 0) {
          var isInvalid = false;
          element.noFormData[0].radioButtonSelectedValue = data.value;
        }
      }
    });
  }
  // radioActionFunc(data) {
  //   if (data != undefined) {
  //     this.showInputfield = !this.showInputfield;
  //   }
  // }
  inputCheck(data, index, inputArray) {
    console.log(data.target.value + ' & ' + index + ' & ' + inputArray);
    console.log('INPUT Onchange ' + data.target.value);

    // if (data.value != '' && data.value != null && index > 0) {
    //   this.data.stepsArray[this.stepperIndex].validStatus = true;
    //   this.enableNext = true;
    // }
    // alert('Inputchange ' + data.target.value);
    // alert('Inputchange ' + data);
    // console.log('Model ' + this.data.inputdata.value);

    // if (data != null && data != '') {
    // if (1!=1) {
    // this.data.stepsArray[this.stepperIndex].validStatus = true;
    // console.log(data.selectedItem);
    // this.enableNext = true;

    // console.log('INPUT CHECK  FROM RADIOINPUT BLOCK CULPRIT');
    // console.log('INPUT CHECK  FROM RADIOINPUT BLOCK CULPRIT');

    // console.log('INPUT CHECK  FROM RADIOINPUT BLOCK CULPRIT INDEX'+this.stepperIndex);

    if (this.data.items[this.stepperIndex].title == 'RADIO INPUT') {
      console.log('inside RADIO INPUT BLOCK');

      if (data.target.value != null && data.target.value != '') {
        var isInvalid = false;
        inputArray.forEach((element) => {
          if (element.value == null || element.value == '') {
            console.log(element);
            isInvalid = true;
          }
          // if (element.title == 'RADIO INPUT') {
          // if (element.noFormData.length > 0) {
          // element.forEach((innerElement) => {
          // if (innerElement.value == null || innerElement.value == '') {
          //   isInvalid = true;
          //   console.log(innerElement.value);

          //   return;
          // }
          // });
          if (isInvalid) {
            // form is Invalid
            // alert('*** 381 Invalid');
            this.data.stepsArray[this.stepperIndex].validStatus = false;
            this.enableNext = false;
          } else {
            // form is valid
            // alert('***** 387 Valid');
            this.data.stepsArray[this.stepperIndex].validStatus = true;
            this.enableNext = true;
          }
          // }
          // }
        });
      } else {
        // alert('395   Invalid clear');
        this.data.stepsArray[this.stepperIndex].validStatus = false;
        // console.log(data.selectedItem);
        this.enableNext = false;

        // ___________testing****
        // this.data.stepsArray[this.stepperIndex].validStatus = true;
        // console.log(data.selectedItem);
        // this.enableNext = true;
      }
    }
  }

  addDriver(data) {
    this.addDriverEmitter.emit(data);
  }

  driverData(data) {
    console.log('wizard scrren--driver data ---' + JSON.stringify(data));
    console.log(data.selectedItem);
    // console.log(data.selectedItem = null);

    if (data.selectedItem != null) {
      this.data.stepsArray[this.stepperIndex].validStatus = true;
      this.enableNext = true;
    } else {
      this.data.stepsArray[this.stepperIndex].validStatus = false;
      this.enableNext = false;
    }
  }

  public disbaleFinalButton() {
    var formValid = true;

    var counter = 0;
    if (this.data != undefined && this.data != null) {
      this.data.stepsArray.forEach((element) => {
        if (!element.validStatus) {
          formValid = false;
        }
        counter++;
      });
    }

    if (formValid) {
      return false; // [disabled]="false"  in html
    } else {
      return true; // [disabled]="true"  in html
    }
  }

  feescheckBox(data) {
    console.log('fees chk' + data);

    // console.log('FEES CULPRIT');
    // console.log('FEES CULPRIT');

    // console.log('FEES CULPRIT INDEX'+this.stepperIndex);

    if (this.data.items[this.stepperIndex].title == 'FEE APPROVAL') {
      console.log('inside fees wizard making form valid / invalid');
      this.data.stepsArray[this.stepperIndex].validStatus = data;
      this.enableNext = data;
    }
    // this.data.stepsArray[this.stepperIndex].validStatus = data;
    // this.enableNext = data;
  }
  understandingcheckBox(data) {
    console.log('understandingcheckBox chk' + data);
    // console.log('UNDERT CULPRIT');
    // console.log('UNDERT CULPRIT');

    // console.log(' UNDERTCULPRIT INDEX'+this.stepperIndex);

    if (this.data.items[this.stepperIndex].title == 'UNDERTAKING FORM') {
      console.log('inside understanding wizard making form valid / invalid');
      this.data.stepsArray[this.stepperIndex].validStatus = data;
      this.enableNext = data;
    }

    // this.data.stepsArray[this.stepperIndex].validStatus = data;
    // this.enableNext = data;
  }

  confirmDriver(data) {
    this.data.stepsArray[this.stepperIndex].validStatus = true;
    this.enableNext = true;
  }
  tokenData(data) {
    console.log('token chk' + data);
    this.data.stepsArray[this.stepperIndex].validStatus = data;
    this.enableNext = data;
  }

  onDaysSelect(data) {
    console.log('wizard scrren--days selection ---' + data);
    // console.log(data.selectedItem);
    // console.log(data.selectedItem = null);

    if (data != null) {
      this.data.stepsArray[this.stepperIndex].validStatus = true;
      // this.data.items.forEach((element) => {
      //   if (element.title == 'FEE APPROVAL') {
      //     element.noFormData[0].feeAmount = data.fees;
      //   }
      // });
      // above is not in used currently as we are calling FEES API
      this.enableNext = true;
      console.log(typeof data);
    } else {
      this.data.stepsArray[this.stepperIndex].validStatus = false;
      // this.data.items.forEach((element) => {
      //   if (element.title == 'Days') {
      //     element.noFormData[0].fees = null;
      //   }
      // });
      // above is not in used currently as we are calling FEES API      
      this.enableNext = false;
    }
  }

  onFileSelect(selectedFile, objectData, index, fileArray) {
    // console.log(selectedFile);
    // alert("INSIDE FILE SELECT")
    console.log('Inside wizard printing selected file ---' + selectedFile);
    // console.log('wizard scrren--file selectionobjectData ---' + objectData);
    // console.log('wizard scrren--file selection index---' + index);
    objectData.value = selectedFile;

    // console.log('&&& -- ' + objectData.value?.file);
    console.log(selectedFile);

    if (selectedFile != null) {
      var isInvalid = false;
      // alert("INSIDE IF CONDITION")
      console.log('PROPER FILE INSIDE IF CONDITION');

      fileArray.forEach((element) => {
        if (element.value == null) {
          // alert('forEach IF CONDITION');
          console.log(element);
          console.log('INSIDE FOR EACH PRINTING VALUE ' + element.value);

          isInvalid = true;
        }
        if (isInvalid) {
          // alert('INVALID NOT FILE SELECTED');

          this.data.stepsArray[this.stepperIndex].validStatus = false;
          this.enableNext = false;
        } else {
          // alert('VALID  FILE SELECTED');

          this.data.stepsArray[this.stepperIndex].validStatus = true;
          this.enableNext = true;
        }
      });
    } else {
      alert('NO FILE SELECTED');
      console.log('IMPROPER FILE INSIDE ELSE CONDITION');

      this.data.stepsArray[this.stepperIndex].validStatus = false;
      this.enableNext = false;
    }

    // if (selectedFile != null) {
    //   this.data.stepsArray[this.stepperIndex].validStatus = true;
    //   this.enableNext = true;
    // } else {
    //   this.data.stepsArray[this.stepperIndex].validStatus = false;
    //   this.enableNext = false;
    // }

    // ----- Validator for enabling next button -----
    // if (selectedFile != null) {
    //   // this.data.stepsArray[this.stepperIndex].validStatus = true;
    //   // console.log(data.selectedItem);
    //   // this.enableNext = true;
    //   this.data.items.forEach((element) => {
    //     if (element.title == 'File Upload') {
    //       if (element.noFormData.length > 0) {
    //         var isInvalid = false;
    //         element.noFormData[0].fileArray[index].value = selectedFile;
    //         element.noFormData[0].fileArray.forEach((innerElement) => {
    //           if (innerElement.value == null) {
    //             isInvalid = true;
    //           }
    //         });
    //         if (isInvalid) {
    //           // form is Invalid
    //           // alert('304 Invalid');
    //           this.data.stepsArray[this.stepperIndex].validStatus = false;
    //           console.log(selectedFile);
    //           this.enableNext = false;
    //         } else {
    //           //form is valid
    //           // alert('320 Valid');
    //           this.data.stepsArray[this.stepperIndex].validStatus = true;
    //           this.enableNext = true;

    //         }
    //       }
    //     }
    //   });
    // } else {
    //   // alert('329 Invalid clear');
    //   this.data.stepsArray[this.stepperIndex].validStatus = false;
    //   console.log(selectedFile);
    //   this.enableNext = false;
    // }
  }

  onOtp(data) {
    console.log('otp' + data);
    if (data.status) {
      this.data.stepsArray[this.stepperIndex].validStatus = true;
      this.enableNext = true;
    } else {
      this.data.stepsArray[this.stepperIndex].validStatus = false;
      this.enableNext = false;
    }
  }

  submit() {
    this.enableNext = true;
  }
  ngOnDestroy() {
    // alert("destroy")
    this.data = null;
    this.viewEntered = false;
    this.prev = false;
    this.next = true;
    this.finish = false;
    this.ignoreDidChange = false;
  }

  // complaints
  complaintsResponse(data) {
    // console.log("complaintsResponse "+data);
    // console.log("complaintsResponse "+JSON.stringify(data));

    if (data.formStatusValid) {
      this.data.stepsArray[this.stepperIndex].validStatus = true;
      this.enableNext = true;
    } else {
      this.data.stepsArray[this.stepperIndex].validStatus = false;
      this.enableNext = false;
    }
  }
}
