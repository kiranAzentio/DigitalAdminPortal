import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountingCategory } from './accounting-category.model';
import { AccountingCategoryService } from './accounting-category.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { StepperConfigurationService } from 'src/app/services/shared/stepper-config/stepper-configuration.service';
// import * as moment from "moment";

@Component({
    selector: 'page-accounting-category-detail',
    templateUrl: 'accounting-category-detail.html'
})
export class AccountingCategoryDetailPage implements OnInit {
  @ViewChild('wizardSlider', { static: false }) slider;
  prev = false;
  next = true;
  finish = false;
  stepperIndex: number = 0;
  username1:string = '';
  email1:string = '';


  // dates
  // startDate: moment.Moment = moment('1/1/2017')
    // endDate: moment.Moment = moment('1/10/2017')
    // currentDate: moment.Moment = moment();
    // currentTime: string = moment().format('M/D/YYYY hh:mm:ss a');
    // currentIndiaFormat: string = moment().format('DD/MM/YYYY');
    // daysFrom2017: number;
    // humanized: string;
    // humanizedNow: string;
    // weeks: number;
    // difference: any;
    // difference2Days: any;


    
        // this.difference = moment(this.startDate).diff(this.endDate)
        // this.difference2Days = this.startDate.diff(this.endDate,'days')


        // this.humanized = moment.duration(moment().diff(this.startDate)).humanize();
        // this.humanizedNow = moment.duration(moment().diff(moment())).humanize();

        // // if you need to force to number of days
        // this.daysFrom2017 = this.currentDate.diff(moment('1/1/2017'), 'days');

        // // if you need to force to number of weeks
        // this.weeks = moment().diff(this.startDate, 'week');

         // end date minus 1 day
         
        // moment start and end date


        //  let momentMinusOneDayFromEndDay = momentObjEnd.subtract(1,'days');

         // getting values of start and end day (1 day minus of end day)
        //  let momentStartValue = momentObjStart.valueOf();
        //  let momentEndValue =  momentMinusOneDayFromEndDay.valueOf();

        // this.clearCalendarDay();
        // let dateObjstart = new Date(this.calculatorData.startDate);
        // let dateObjend = new Date(this.calculatorData.endDate);

        // let momentObjStart = moment(dateObjstart);
        // let momentObjEnd = moment(dateObjend);

        // this.calculatorData.calenderDay = momentObjEnd.diff(moment(momentObjStart), 'days') + "";

  constructor(
    public stepperConfigurationService:StepperConfigurationService,
    private navController: NavController,
  ){

  }

    stepsArray:any[] = [
        {
            title: 'STEP 1',
            icon: 'home',
            validUpdatedStatus: false,
            validStatus: false,
            type: 'normal',
            showPrevious: false,
            showNext: true,
            showfinish: false,
        },
        {
            title: 'STEP 2',
            icon: 'home',
            validUpdatedStatus: false,
            validStatus: false,
            type: 'normal',
            showPrevious: true,
            showNext: true,
            showfinish: false,
        },
        {
            title: 'STEP 3',
            icon: 'home',
            validUpdatedStatus: false,
            validStatus: false,
            type: 'normal',
            showPrevious: false,
            showNext: false,
            showfinish: false,
        }
    ]

    data = {
        btnPrev: 'PREV',
        btnNext: 'NEXT',
        btnFinish: 'FINISH',
    }
    ngOnInit(): void {
        // stepper
   
    }
    prevSteps(){
      this.navController.navigateBack('/menu/tabs/entities/i-and-m/accounting')
    }

    goToNext(data,index){
        this.slider.lockSwipes(false);

        if(index == 0){

        }else{

        }
        this.slider.slideNext(300);
        this.slider.slideTo

        
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
          this.finish = false;
          this.next = true;
        }else{
            this.prev = true;
            this.finish = false;
            this.next = true;
        }
        this.slider.slidePrev(300);
    
        setTimeout(() => {
          this.slider.lockSwipes(true);
        }, 100);
      }
   

      onNextFunc(){
        this.slider.lockSwipes(false);
        this.slider.slideNext(300);
        this.stepperIndex = this.stepperIndex + 1;
    
        if (this.stepperIndex == 2) {
            this.finish = true;
            this.prev = true;
            this.next = false;
          }else{
            this.finish = false;
            this.prev = true;
            this.next = true;
          }

        setTimeout(() => {
          this.slider.lockSwipes(true);
        }, 100);

      }

}
