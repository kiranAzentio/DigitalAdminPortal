import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../app-configuration/app-config.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({ providedIn: 'root' })
export class StepperConfigurationService {
  private stepsArray:any[] = [];
  private title:string = '';

  constructor(
    private appConfigService: AppConfigService,
    private apiService: ApiService,
    private utilityService: UtilityService
    ) { }


    emptyStepsArray(){
      this.stepsArray = [];
    }
    setStepsArray(dataArray,title?){
      this.emptyStepsArray();
      this.stepsArray = dataArray;

      if(title != undefined){
        this.title = title;
      }
    }

    addToStepsArray(data){
      let recordPresent  = false;
      let recordPResentName = '';
      this.stepsArray.forEach(element => {
        if(data.id == element.id){
          recordPresent = true;
          recordPResentName = element.title
          return;
        }
      });
      if(!recordPresent){
        this.stepsArray.push(data);
      }else{
        // alert(recordPResentName+" already present in stepper array");
      }
    }

    setColorForStepsArray(idArray){
      this.stepsArray.forEach(element => {
        idArray.forEach(innerEle => {
         if(innerEle.id == element.id){
          element.showColor = true;
          return;
         }
       });
      });
    }
    setTickForStepsArray(idArray){
      this.stepsArray.forEach(element => {
        idArray.forEach(innerEle => {
         if(innerEle.id == element.id){
          element.showTick = true;
          return;
         }
       });
      });
    }
    setCurrentPageStepsArray(id){
      this.stepsArray.forEach(element => {
         if( id == element.id){
          element.showCurrentPage = true;
         }else{
          element.showCurrentPage = false;
         }
      });
    }

    getStepsArray(){
      return  this.stepsArray;
    }

    getTitle(){
      return this.title;
    }

    createApplicationSteps(){
    return  [
      {
        id:1,
        title:'Search Customers',
        icon:'demo',
        showColor:true,
        showTick:false
      },
      {
        id:2,
        title:'Select Product',
        icon:'demo',
        showColor:false,
        showTick:false
      },
      {
        id:3,
        title:'Loan Data',
        icon:'demo',
        showColor:false,
        showTick:false
      },
      {
        id:4,
        title:'Additional Data',
        icon:'demo',
        showColor:false,
        showTick:false
      },
      // {
      //   id:5,
      //   title:'Document Upload',
      //   icon:'demo',
      //   showColor:false,
      //   showTick:false
      // },
      // {
      //   id:6,
      //   title:'Final Offer',
      //   icon:'demo',
      //   showColor:false,
      //   showTick:false
      // },
    ];
    }

    inboxSteps(){
      return  [
        // {
        //   id:2,
        //   title:'Select Product',
        //   icon:'demo',
        //   showColor:false,
        //   showTick:false
        // },
        {
          id:3,
          title:'Loan Data',
          icon:'demo',
          showColor:false,
          showTick:false
        },
        {
          id:4,
          title:'Additional Data',
          icon:'demo',
          showColor:false,
          showTick:false
        },
        // {
        //   id:5,
        //   title:'Document Upload',
        //   icon:'demo',
        //   showColor:false,
        //   showTick:false
        // },
        // {
        //   id:6,
        //   title:'Final Offer',
        //   icon:'demo',
        //   showColor:false,
        //   showTick:false
        // },
      ];
      }

      

      inboxStepsAddLoanPage(showColor?,showTick?){
        return {id:3,title:'Loan Data',icon:'demo',showColor:showColor == undefined ? false : showColor,showTick:showTick == undefined ? false : showTick}

        }

        inboxStepsAddAdditionalPage(showColor?,showTick?){
          return  {id:4,title:'Additional Data',icon:'demo',showColor:showColor == undefined ? false : showColor,showTick:showTick == undefined ? false : showTick}
        }

        inboxStepsAddDocumentsPage(showColor?,showTick?){
          return {id:5,title:'Document Data',icon:'demo',showColor:showColor == undefined ? false : showColor,showTick:showTick == undefined ? false : showTick}
        }
      
        inboxStepsAddFinalOfferPage(showColor?,showTick?){
          return {id:6,title:'Final Offer',icon:'demo',showColor:showColor == undefined ? false : showColor,showTick:showTick == undefined ? false : showTick}
        }

        // branch manager
        inboxStepsAddBranchManagerConfirmationPage(showColor?,showTick?){
          return {id:7,title:'Branch Manager Confirmation',icon:'demo',showColor:showColor == undefined ? false : showColor,showTick:showTick == undefined ? false : showTick}
        }
}
