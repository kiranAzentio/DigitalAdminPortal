import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { MenuConfigurationService } from 'src/app/services/shared/menu-config/menu-configuration.service';
import { StepperConfigurationService } from 'src/app/services/shared/stepper-config/stepper-configuration.service';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';
import { CommonPopupComponent } from '../common-popup/common-popup.component';

@Component({
  selector: 'digital-stepper-header',
  templateUrl: './stepper-header.component.html',
  styleUrls: ['./stepper-header.component.scss'],
})
export class StepperHeaderComponent implements OnInit {
  @Input() data: any;
  @Input() showDeclineButton: boolean = true;
  @Input() showExitButton: boolean = true;
  @Input() showCustomerDetails :boolean = true;
  @Input() showBelowTitle :boolean = false;





  @Output() stepsOutput = new EventEmitter();
  @Output() declineButtonEvent = new EventEmitter();



  constructor(
    public stepperConfigurationService: StepperConfigurationService,
    public alertCtrl: AlertController,
    private modalController: ModalController,
    private utilityservice:UtilityService,
    public appConfig:AppConfigService,
    private menuConfig : MenuConfigurationService,
    private navController: NavController
  ) {

  }

  ngOnInit() { 
  }

  declineClick() {
    this.openAlert(1);
  }

  exitClick() {
    this.openAlert(2);
  }

  async openAlert(type) {
    let message = '';
    if (type == 1) {
      message = 'Are you sure you want to cancel?'
    } else if (type == 2) {
      message = 'Are you sure you want to exit?'
    }
    const alert = await this.alertCtrl.create({
      header: 'Please Confirm',
      message: message,
      // buttons: ['Disagree', 'Agree']
      buttons: [
        {
          text: 'Agree',
          handler: () => {
            console.log('Confirm Ok');
            this.alertCtrl.dismiss();
            if (type == 1) {
              this.declineProcess(type);
            } else if (type == 2) {
              // this.exitProcess(type);
              this.exitToast();
            }
          }
        },
        {
          text: 'Disagree',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, 
      ]
    });

    await alert.present();
  }

  declineProcess(type) {
    let data: any = {};
    data.showDeclineComments = true;
    data.comments = null;
    data.actionButtonText = 'SUBMIT';
    let title = 'Cancel Application';

    this.openPopup(data, title, type);
  }

  exitProcess(type) {
    let data: any = {};
    data.showExit = true;
    data.actionButtonText = 'SUBMIT';
    let title = 'Exit Application';

    this.openPopup(data, title, type);
  }

  async openPopup(data, title, type) {


    const popover = await this.modalController.create({
      component: CommonPopupComponent,
      cssClass: 'popdeclineComments',
      componentProps: {
        data: data,
        title: title
      },
      backdropDismiss: false,
    });

    popover.onDidDismiss().then((dataReturned) => {
      if (dataReturned != null && dataReturned.role != 'backdrop' && dataReturned['data'] != undefined) {
        if (type == 1) {
          //  decline
          this.declineButtonEvent.emit(dataReturned['data']);
          this.declineApi(dataReturned['data']);
        } else if (type == 2) {
          // exit
        }
      }
    });
    await popover.present();
  }


  declineApi(data) {
    let url = 'cancel-application';
    let reqObj :any = 
    {
      "transactionId": this.appConfig.getTRNTimestamp(),
      "channel":  this.appConfig.getChannel(),
      "requestedOn":  this.appConfig.getDateTime(),
      // "customerId": this.appConfig.getInnerJourneyData('createApplicationPage', 'createApplicationData').customerId,
      "applRefId": this.appConfig.getInnerJourneyData('createApplicationPage', 'appRefId'),
      "language":this.appConfig.getLanguage()
      // "comments":data.comments
    }
    this.utilityservice
      .callPostApi(
        reqObj,
        url
      )
      .then(
        (res :any) => {
          console.log('Success' + JSON.stringify(res));
          //I&M Pending
          this.declineshowToast();
        },
        (err) => {
          // alert("error" + JSON.stringify(err))
          console.log('error' + JSON.stringify(err));
          //I&M Pending
          this.declineshowToast();
        }
      );
  }

  declineshowToast(){
    this.utilityservice.showToast('success','Application cancelled successfully');
    this.routeToInboxPage();
  }
  exitToast(){
    this.utilityservice.showToast('success','Application exited successfully');
    this.routeToInboxPage();
  }

  routeToInboxPage() {
    this.menuConfig.assignMenuSelectedByIdentifier('inbox');
    this.navController.navigateBack('/menu/tabs/entities/i-and-m/inbox');
  }
}
