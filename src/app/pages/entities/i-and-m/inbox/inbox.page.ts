import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { CommonPopupComponent } from 'src/app/components/common-popup/common-popup.component';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { MenuConfigurationService } from 'src/app/services/shared/menu-config/menu-configuration.service';
import { StepperConfigurationService } from 'src/app/services/shared/stepper-config/stepper-configuration.service';
import { UtilityService } from '../../../../services/shared/utility/utility.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  showTable: boolean = false;

  tableMetaData: any[] = [];
  tableData: any[] = [];
  tableGlobalFilterFields: any[] = [];
  tableTitle: string = 'Applications pending for processing';
  customFilterData: any[] = [];

  downloadData: any = [];
  showActionsAdd: boolean = false;

  stepsArray: any[] = [];
  landingUrl: any = '';

  applicationStatus: any = '';

  showSkeleton: boolean = true;

  constructor(
    private navController: NavController,
    public appService: AppConfigService,
    public utilityService: UtilityService,
    public appConfig: AppConfigService,
    private stepperConfigurationService: StepperConfigurationService,
    private menuConfig: MenuConfigurationService,
    public modalController: ModalController,
    public alertCtrl: AlertController,
    private popoverController: PopoverController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.appConfig.reloadSetAppConfig();
    this.setRoleReload();
  }

  OnNextCallApi(data) {
    let url = "branch-inbox"

    this.utilityService.callPostApi(data, url).then((res: any) => {
      // alert("Success" + JSON.stringify(res))
      console.log("Success" + JSON.stringify(res))
      console.log("Success body userInbox" + JSON.stringify(res.userInbox))
      //I&M Pending
      this.showSkeleton = false;
      this.OnNextSuccess(res.userInbox)
    }, err => {
      // alert("error" + JSON.stringify(err))
      console.log("error" + JSON.stringify(err));
      this.showSkeleton = false;
      //I&M Pending
      this.OnNextSuccess(data)

    })
  }

  OnNextSuccess(data) {
    this.setAll(data);
  }



  ionViewWillEnter() {

    if (this.appConfig.getIsSalesUser()) {
      this.showActionsAdd = true;
    } else {
      this.showActionsAdd = false;
    }
    var sessionData = this.appService.getUserData()
    console.log("getUserData", sessionData, new Date())
    // this.loadAll();
    // this.setAll();
    this.showTable = false;
    this.showSkeleton = true;
    let data: any = {
      "transactionId": this.appConfig.getTRNTimestamp(),
      "channel": this.appConfig.getChannel(),
      "requestedOn": this.appConfig.getDateTime(),
      "loginUserId": sessionData.loginUserId
      // "loginUserId": "SALES1"
    }

    console.log("OnNextCallApi data", data)
    this.OnNextCallApi(data)

  }

  // setAll
  setAll(data) {
    this.setTableData(data);
    this.setTableMetaData();
    this.setTableGlobalFilterFields();


    // this.setCustomFilterData() // custom filter
    this.showTable = true; // table gets inside DOM because of this.

  }


  setDownloadedData(data) {
    let filterData: any = []
    // data.forEach(element => {
    //   let obj: any = {}
    //   if (element.hasOwnProperty('appNo')) {
    //     obj['App No'] = element.appNo;
    //   }
    //   if (element.hasOwnProperty('customerName')) {
    //     obj['Customer Name'] = element.customerName;
    //   }
    //   if (element.hasOwnProperty('productName')) {
    //     obj['Product Name'] = element.productName;
    //   }
    //   if (element.hasOwnProperty('requestedAmount')) {
    //     obj['Requested Amount'] = element.requestedAmount.currencyLabel +
    //       " " + element.requestedAmount.currencyValue;
    //   }
    //   if (element.hasOwnProperty('tenure')) {
    //     obj['Tenure'] = element.tenure
    //   }
    //   filterData.push(obj);
    // });
    // this.downloadData = filterData
    console.log("downloadData", this.downloadData)
  }

  // TABLE META DATA
  setTableMetaData() {
    // header means name(en.json orar.json name)
    this.tableMetaData = [
      { field: 'applRefId', header: 'App.No', headerType: 'text', bodyType: 'textLink' },
      { field: 'customerName', header: 'Customer Name', headerType: 'text', bodyType: 'text' },
      { field: 'productName', header: 'Product Name', headerType: 'text', bodyType: 'text' },
      { field: 'requestedAmt', header: 'Requested Amount', headerType: 'text', bodyType: 'currencyText' },
      { field: 'tenure', header: 'Tenure', headerType: 'text', bodyType: 'text' },
      { field: 'stage', header: 'Stage', headerType: 'text', bodyType: 'text' },
      { field: 'applDate', header: 'Application Date', headerType: 'text', bodyType: 'text' },
      { field: 'lastUpdated', header: 'Last Updated', headerType: 'text', bodyType: 'text' },
      { field: 'applBranch', header: 'Application Branch', headerType: 'text', bodyType: 'text' },
      { field: 'cancelApplication', header: 'Cancel Application', headerType: 'text', bodyType: 'cancelApplication' },
      // { field: 'status', header: 'STATUS', headerType: 'dropdown', bodyType: 'statusText'  },
    ];

  }

  // TABLE GLOBAL SEARCH
  setTableGlobalFilterFields() {
    this.tableGlobalFilterFields = [];
    this.tableGlobalFilterFields = [
      'applRefId', 'customerName', 'productName',
      'requestedAmt.currencyValue', 'requestedAmt.currencyLabel',
      'tenure', 'stage', 'applDate', 'lastUpdated', 'applBranch'
    ];
  }

  // Customer filter
  setCustomFilterData() {
    this.customFilterData = [];
    this.customFilterData = [
      {
        title: 'User Name',
        type: 'text',
        value: null,
        tableMetaDataField: 'userName'
      },
      {
        title: 'User Id',
        type: 'text',
        value: null,
        tableMetaDataField: 'userId'
      },
      // {
      //   title:'Customer Name',
      //   type:'text',
      //   value:null,
      // }
    ]
  }

  // TABLE DUMMYDATA

  setTableData(data) {
    this.tableData = [];
    let counter = 0;
    data.forEach(element => {
      // if (element.requestedAmt) {
        var obj = {
          "currencyValue": element.requestedAmt,
          "currencyLabel": "KES" //element.currency
        }
        element.requestedAmt = obj
      // };
      element['id'] = counter;
      element['cancelApplication'] = true;
      counter++;
    });
    console.log("after for loop logg >>>>>>>>>>>", JSON.stringify(data))
    this.tableData = data

    console.log("tableData", JSON.stringify(this.tableData))

    // this.tableData = [
    //   // {"srNo":"1","applRefId":"9536",
    //   // "customerName":"SMITH Leena J","productName":"Home Extension Finance",
    //   // "requestedAmt":"400000","tenure":"65","stage":"App Data Entry CBS",
    //   // "applDate":"31-08-20","lastUpdated":"01/04/2021 12:04:32","applBranch":"ABRANCH2"},
    //   {
    //     "id": 1,
    //     "appNo": "534443",
    //     "customerName": "John Doe",
    //     "productName": "Personal Loan",
    //     "requestedAmount": {
    //       "currencyValue": "100000",
    //       "currencyLabel": "KES"
    //     },
    //     "tenure": "36",
    //     "stage": "Create Lead",
    //     "applicationDate": "05-07-2021",
    //     "lastUpdated": '05-09-2021',
    //     "applicationBranch": '14 Riverside',
    //     // "status": "active",
    //   },
    //   {
    //     "id": 2,
    //     "appNo": "34344",
    //     "customerName": "Tony Stark",
    //     "productName": "Car Loan",
    //     "requestedAmount": {
    //       "currencyValue": "50000",
    //       "currencyLabel": "KES"
    //     },
    //     "tenure": "60",
    //     "stage": 'Offering',
    //     "applicationDate": "05-07-2021",
    //     "lastUpdated": '05-09-2021',
    //     "applicationBranch": 'Yaya Centre',
    //     // "status": "active",
    //   },
    //   {
    //     "id": 3,
    //     "appNo": "453445",
    //     "customerName": "James Peterson",
    //     "productName": "Personal Loan",
    //     "requestedAmount": {
    //       "currencyValue": "100000",
    //       "currencyLabel": "KES"
    //     },
    //     "tenure": "12",
    //     "stage": 'Offering',
    //     "applicationDate": "05-07-2021",
    //     "lastUpdated": '05-09-2021',
    //     "applicationBranch": "14 Riverside",
    //     // "status": "active",
    //   },
    //   {
    //     "id": 4,
    //     "appNo": "45545",
    //     "customerName": "Tom Brady",
    //     "productName": "Car Loan",
    //     "requestedAmount": {
    //       "currencyValue": "50000",
    //       "currencyLabel": "KES"
    //     },
    //     "tenure": "60",
    //     "stage": "Create Lead",
    //     "applicationDate": "05-07-2021",
    //     "lastUpdated": '05-09-2021',
    //     "applicationBranch": '14 Riverside',
    //     // "status": "active",
    //   },
    //   {
    //     "id": 5,
    //     "appNo": "23233",
    //     "customerName": "John Doe",
    //     "productName": "Personal Loan",
    //     "requestedAmount": {
    //       "currencyValue": "100000",
    //       "currencyLabel": "KES"
    //     },
    //     "tenure": "36",
    //     "stage": 'Offering',
    //     "applicationDate": "05-07-2021",
    //     "lastUpdated": '05-09-2021',
    //     "applicationBranch": 'Yaya Centre',
    //     // "status": "active",
    //   },





    // ]

    this.setDownloadedData(this.tableData);

  }
  onSelect(data) {

    this.utilityService.closToast();
    // clear journey data
    this.appConfig.clearJourneyData();
    this.appConfig.setInitialJourneyData();

    this.stepsArray = [];
    this.landingUrl = '';
    this.applicationStatus = "";

    //CALL API
    console.log("on select data", data)

    let errorHandlingObj = {
      returnToParent:true
    };

    let url = 'application-details';

    var reqObj =
    {
      "transactionId": this.appConfig.getTRNTimestamp(),
      "channel": this.appConfig.getChannel(),
      "requestedOn": this.appConfig.getDateTime(),
      "language": this.appConfig.getLanguage(),
      // "customerId": data.customerId == undefined ? null :  data.customerId,
      "appRefId": data.applRefId,
      // "initiatedBy": "0",
      // "employeeId": this.appConfig.getUserData().employeeId,
      // "stage": null,
      // "comments": null
    }



    this.utilityService
      .callPostApi(reqObj, url, errorHandlingObj)
      .then(
        (res) => {
          // alert("Success" + JSON.stringify(res))
          console.log('application-details Success' + JSON.stringify(res));
          //I&M Pending
          //I&M Pending
          if (res != null) {
            this.onSelectExecution(data, res)
          } 
        },
        (err) => {
          console.log('error' + JSON.stringify(err));
          if(err.error != undefined && err.error.kastleApiErrors != undefined &&
            err.error.kastleApiErrors != null && err.error.kastleApiErrors.length > 0 ){
         console.log("inside decline flow journey");
              let errObj :any = {};
              errObj.message = "FAIL";
              errObj.errorArray = err.error.kastleApiErrors;
              errObj.customerId = data.customerId == undefined ? null :  data.customerId;
              errObj.customerName = data.customerName == undefined ? null :  data.customerName;
             this.showMessagePopup(errObj);
         }else{
           this.utilityService.showToast('error','Internal server error');
         }
        }
      );

  }

  async showMessagePopup(resData) {
    let declineCodeArray :any [] = [];

    resData.errorArray.forEach(element => {
      let innerObj :any = {};
      innerObj.declineCode = element.errorKey;
      innerObj.description = element.errorMessage;
      innerObj.errorParameters = element.errorParameters;
      declineCodeArray.push(innerObj);
    });
    var data: any = {};

    // data.title = 'Duplicate Application Found'
    data.title = 'DECLINE REASON';
    data.customerId = resData.customerId
    data.customerName = resData.customerName;
    // data.declineCodeArray = [
    //   {
    //     declineCode: 'DA001',
    //     description: 'A similar application for personal loan already exists'
    //   }
    // ]
    data.declineCodeArray = declineCodeArray;
    data.failedMsgBool = true;
    data.buttonText = 'OK',
      data.buttonRoute = 'give route';

    const popover = await this.popoverController.create({
      component: 'MessageModalPage',
      cssClass: 'popcustom',
      backdropDismiss: false,
      componentProps: {
        data: data,
      }
    });

    popover.onDidDismiss().then((dataReturned) => {
      if (dataReturned != null && dataReturned.role != 'backdrop' && dataReturned['data'] != undefined) {
      }
      // this.routeToInboxPage();

    })
    return await popover.present();
  }

  onSelectExecution(data, res) {
    console.log("INBOX SCREEN link clicked " + JSON.stringify(data));

    let showLoanScreen = false;
    let showAdditionalDataScreen = false;
    let showDocumentScreen = false;
    let showFinalOfferScreen = false;

    // ADD Conditon and set above one variable (screen) as true;
    showLoanScreen = true;



    // decide journeydata on basis of res and form data below
    // -----------------------------------------------------------------------
    // pages to be shown
    let journeyData: any = {};
    journeyData.selectLoanPage = true;
    journeyData.selectLoanPageUrl = false;

    journeyData.additionalDataPage = true;
    journeyData.additionalDataPageUrl = false;

    journeyData.documentPage = false;
    journeyData.documentPageUrl = false;

    journeyData.finalOfferPage = false;
    journeyData.finalOfferPageUrl = false;

// loandata screen         -  PRELIMCHK
// additional data screen   -  ELIGCHK
// document screen           - DOCCHK
// final offer screen         - SLSACLNO 

    if(res.currentStage == "PRELIMCHK"){
      journeyData.selectLoanPageUrl = true;
    }else if(res.currentStage == "ELIGCHK"){
      journeyData.additionalDataPageUrl = true;
    }else if(res.currentStage == "DOCCHK"){
    journeyData.documentPage = true;
      journeyData.documentPageUrl = true; // not in use , as application status is usef for landing path
    }else if(res.currentStage == "SLSACLNO" ||
    res.currentStage == "L1APPRV" || 
    res.currentStage == "L2APPRV" ||
    res.currentStage == "L3APPRV" ||
    res.currentStage == "L4APPRV" ||
    res.currentStage == "L5APPRV" ||
    res.currentStage == "L6APPRV" ||
    res.currentStage == "L7APPRV" ||
    res.currentStage == "L8APPRV" ||
    res.currentStage == "L9APPRV" ||
    res.currentStage == "L10APPRV" ||
    res.currentStage == "BRVERI" ||
    res.currentStage == "OFFERAPR" ||
    res.currentStage == "VERIDOC"){

      if(res.appDecision == this.appConfig.getReferMatch()){
        journeyData.documentPage = true;
      }
      
    journeyData.finalOfferPage = true;
      journeyData.finalOfferPageUrl = true; //  IGNORE BESIDE statement  ->  not in use -as application status is used for deciding landing path
    }
    else if(this.appConfig.getIsBranchManager()){
     
      if(res.appDecision == this.appConfig.getReferMatch()){
        journeyData.documentPage = true;
        journeyData.finalOfferPage = true;
        journeyData.finalOfferPageUrl = true; //  IGNORE BESIDE statement  ->  not in use -as application status is used for deciding landing path
      }else if(res.appDecision == this.appConfig.getApproveMatch()){

        journeyData.finalOfferPage = true;
        journeyData.finalOfferPageUrl = true; //  IGNORE BESIDE statement  ->  not in use -as application status is used for deciding landing path
      }else{
        // alert("No stage found");
      this.utilityService.showToast('error','No stage found',{});
        return;
      }
    }
    else{
      // alert("No stage found");
      this.utilityService.showToast('error','No stage found',{});
      return;
    }

      // branch manager
      if (this.appConfig.getIsBranchManager()) {
        journeyData.branchManagerConfirmationPage = true;
        journeyData.branchManagerConfirmationPageUrl = false;

       
      }

      // branch manager
      // if (this.appConfig.getIsBranchManager() && element.stage == "branchManagerConfirmationPage") {
      //   journeyData.branchManagerConfirmationPage = true;
      //   if (element.status == "completed") {
      //     journeyData.branchManagerConfirmationPageUrl = true;
      //   }
      // }


      // not in use
    // if (res.workflow != null && res.workflow.length > 0) {
    //   res.workflow.forEach(element => {
    //     if (element.stage == "selectLoanPage") {
    //       journeyData.selectLoanPage = true;
    //       if (element.status == "completed") {
    //         journeyData.selectLoanPageUrl = true;
    //       }
    //     } if (element.stage == "additionalDataPage") {
    //       journeyData.additionalDataPage = true;
    //       if (element.status == "completed") {
    //         journeyData.additionalDataPageUrl = true;
    //       }
    //     } if (element.stage == "documentPage") {
    //       journeyData.documentPage = true; // it will change depending on application status
    //       if (element.status == "completed") {
    //         journeyData.documentPageUrl = true; // IGNORE BESIDE statement  -> not in use -as application status is used for deciding landing path
    //       }
    //     } if (element.stage == "finalOfferPage") { //it will change depending on application status
    //       journeyData.finalOfferPage = true;
    //       if (element.status == "pending") {
    //         journeyData.finalOfferPageUrl = true; //  IGNORE BESIDE statement  ->  not in use -as application status is used for deciding landing path
    //       }
    //     }
    //     // branch manager
    //     if (this.appConfig.getIsBranchManager() && element.stage == "branchManagerConfirmationPage") {
    //       journeyData.branchManagerConfirmationPage = true;
    //       if (element.status == "completed") {
    //         journeyData.branchManagerConfirmationPageUrl = true;
    //       }
    //     }
    //   });

    // } else {
    //   alert("no workflow stage found");
    //   return;
    // }
    // ---------------------CUSTOMER DETAILS save in createApplication and selectProduct data appconfig-----------------------------------------------------

    this.customerDetailsSelectProductProcessing(journeyData, data, res);

    // ------------------------------------------------------------------------
    if (journeyData.selectLoanPage) {
      this.selectLoanPageProcessing(journeyData, data, res);
    }
    if (journeyData.additionalDataPage) {
      this.additionalDataPageProcessing(journeyData, data, res);
    }
    if (journeyData.documentPage) {
      this.documentsDataPageProcessing(journeyData, data, res);
    }
    if (journeyData.finalOfferPage) {
      this.finalOfferPageProcessing(journeyData, data, res);
    }
    if (journeyData.branchManagerConfirmationPage) {
      this.branchManagerConfirmationPageProcessing(journeyData, data, res);
    }

    if (this.appConfig.getIsSalesUser()) { //SALES USER
      console.log("---------------");
      console.log("---------------");
      console.log("---------------");
      console.log("---------------------SET FOR SALES USER----------------");
      console.log("---------------");
      console.log("---------------");
      console.log("---------------");
    let title = 'EDIT APPLICATION';

      // routing stuff
      this.routeProcessing(journeyData, data, res,title);

    } 
    else if (this.appConfig.getIsBranchManager()) { // BRANCH MANAGER
      console.log("---------------");
      console.log("---------------");
      console.log("---------------");
      console.log("---------------------SET FOR BRANCH MANAGER----------------");
      console.log("---------------");
      console.log("---------------");
      console.log("---------------");
      let title = 'CONFIRM APPLICATION';

      // routing stuff
      this.routeProcessing(journeyData, data, res,title);


    }
     else {
      alert("no role found");
    }


  }

  customerDetailsSelectProductProcessing(journeyData, data, res) {
    // if(res.custDtl.length > 0){
    if (data != null) {
      // create apllication data
      // applRefId (we get from click of inbox)
      // limitCurrency and limitAmount should also go here
      // NOTE 18-02-2021 - only customerId and this.createApplicationData.customerLimit.currencyLabel are used

      // for create applciation setting data
      let custData: any = {};
      custData.customerId = data.customerId == undefined ? null : data.customerId; //not present in response (used in loan data and additional data page)
      custData.customerName = data.customerName;
      custData.customerType = res.customerDtls == undefined ? null : res.customerDtls.customerType; //not present in response
      custData.customerLimit = {};
      custData.customerLimit.currencyValue =  data.customerLimit == undefined ? null : data.customerLimit; //not present in response
      custData.customerLimit.currencyLabel = data.currency == undefined ? null : "KES";//not present in response (used in loan data and additional data page)
      custData.productName = data.productName;
      custData.maxEMI = res.additionalData.maxEMI == undefined ? null : res.additionalData.maxEMI; 

      // for selectproduct setting data
      let selectProductData: any = {};
      selectProductData.customerLimit = data.customerLimit == undefined ? null : data.customerLimit; //not present in response
      selectProductData.currencyLabel = data.currency == undefined ? null : "KES"; //not present in response (used in loan data and additional data page)
      selectProductData.customerType = res.customerDtls == undefined ? null : res.customerDtls.customerType; //not present in response
      selectProductData.customerName = data.customerName;
      selectProductData.customerId = data.customerId == undefined ? null : data.customerId; //not present in response (used in loan data and additional data page)
      selectProductData.selectedProduct = [];
      let innerObj: any = {};
      if(res.loanProducts != undefined && res.loanProducts != null){
        innerObj.productCode = res.loanProducts.productCode  == undefined ? null :res.loanProducts.productCode ; // not present in response (used in loan product api)
      }else{
        innerObj.productCode = null;
      }
      innerObj.product = data.productName;
      selectProductData.selectedProduct.push(innerObj);

      // create app data
      this.appConfig.setInnerJourneyData('createApplicationPage', 'createApplicationData', custData);
      let backUrl = '/menu/tabs/entities/i-and-m/inbox';
      this.appConfig.setInnerJourneyData('createApplicationPage', 'previousPageRoute', backUrl);
      this.appConfig.setInnerJourneyData('createApplicationPage', 'appRefId', data.applRefId); //both are diff  variables, but are proper

      //select product data
      this.appConfig.setInnerJourneyData('selectProductPage', 'selectProductData', selectProductData);
      this.appConfig.setInnerJourneyData('selectProductPage', 'isFormSubmitted', true);
      this.appConfig.setInnerJourneyData('selectProductPage', 'previousPageRoute', backUrl);
      this.appConfig.setInnerJourneyData('selectProductPage', 'initStratergyChecked', true);

      let backUrlLoan = '/menu/tabs/entities/i-and-m/inbox';
      this.appConfig.setInnerJourneyData('selectProductPage', 'previousPageRoute', backUrlLoan);

    } else {
      alert("no customer id present");
    }
    // else{
    //   let obj = {
    //     createApplicationData:null,
    //     previousPageRoute:null,
    //   };
    //   this.appConfig.setJourneyData('createApplicationPage',null);
    //   this.appConfig.setJourneyData('createApplicationPage',obj);

    //   let obj2  ={
    //       selectProductData:null,
    //       isFormSubmitted:false,
    //       previousPageRoute:null,
    //       initStratergyChecked:false,
    //     };
    //     this.appConfig.setJourneyData('selectProductPage',null);
    //     this.appConfig.setJourneyData('selectProductPage',obj2);

    //   this.utilityService.showToast('error',"Customer details data not present");
    // }
  }

  selectLoanPageProcessing(journeyData, data, res) {
    
    // DECIDE FIRST TIME or SECOND TIME MODE HERE
    if (res.loanProducts != undefined && res.loanProducts != null) {

      let loanProductsObj :any = {};
      loanProductsObj.tenure = res.tenure; // I&M pending - check this ***;
      loanProductsObj.productCode = res.loanProducts.productCode;
      loanProductsObj.productName = res.loanProducts.productName;
      loanProductsObj.minApprovedAmount = res.loanProducts.minProductLimit;
      loanProductsObj.maxApprovedAmount = res.loanProducts.maxProductLimit;
      loanProductsObj.minTenure = res.loanProducts.minTenure;
      loanProductsObj.maxTenure = res.loanProducts.maxTenure;
      loanProductsObj.interestRateType = res.loanProducts.interestRateType;
      loanProductsObj.interestRate = res.loanProducts.interestRate;
      loanProductsObj.currencyLabel = res.loanProducts.currency;
      loanProductsObj.monthlyPayable = res.loanProducts.monthlyPayable;
      loanProductsObj.requestedAmount = res.requestedAmount == undefined ? null : res.requestedAmount; // I&M pending - check this ***;
      loanProductsObj.totalProfit = null; 
      loanProductsObj.payableAmount = null;
      loanProductsObj.loanPurpose = res.additionalData == null ? null : res.additionalData.purposeOfLoan;
      loanProductsObj.otherPurposeReason = res.additionalData == null ? null : ( res.additionalData.otherPurposeReason == undefined ? null : res.additionalData.otherPurposeReason );
      // loanProductsObj.loanPurpose = res.loanProducts.loanPurpose == undefined ? null : res.loanProducts.loanPurpose;
      // loanProductsObj.otherPurposeReason = res.loanProducts.otherPurposeReason == undefined ? null : res.loanProducts.otherPurposeReason;

      this.appConfig.setInnerJourneyData('loanDataPage', 'loanData', loanProductsObj);

      if(journeyData.selectLoanPageUrl){
        this.appConfig.setInnerJourneyData('loanDataPage', 'isFormSubmitted', false);
        this.appConfig.setInnerJourneyData('loanDataPage', 'isFormSubmittedLoanProcess', false);
        this.appConfig.setInnerJourneyData('loanDataPage', 'isEmiCalculated', false);
        this.appConfig.setJourneyData('inboxFlowFirstTime', true);
        this.appConfig.setInnerJourneyData('loanDataPage', 'makeBackJourneyApiCall', false);
      }else{
        this.appConfig.setInnerJourneyData('loanDataPage', 'isFormSubmitted', true);
        this.appConfig.setInnerJourneyData('loanDataPage', 'isFormSubmittedLoanProcess', true);
        this.appConfig.setInnerJourneyData('loanDataPage', 'isEmiCalculated', true);
        this.appConfig.setJourneyData('inboxFlowFirstTime', false);
        this.appConfig.setInnerJourneyData('loanDataPage', 'makeBackJourneyApiCall', true);

      }
      // this.appConfig.setInnerJourneyData('loanDataPage', 'isFormSubmitted', true);
      this.appConfig.setInnerJourneyData('loanDataPage', 'firsTimeEmiCalculated', false); // kept false for manual calculation on edit mode - as ionviewinit uses this flag to decide for the calculation logic
      // this.appConfig.setInnerJourneyData('loanDataPage', 'isFormSubmittedLoanProcess', true);
      // this.appConfig.setInnerJourneyData('loanDataPage', 'isEmiCalculated', true);
      // WE give back screen previousPageRoute V.V.V IMP
      let backUrl = '/menu/tabs/entities/i-and-m/inbox';
      this.appConfig.setInnerJourneyData('selectProductPage', 'previousPageRoute', backUrl);

      this.stepsArray.push(this.stepperConfigurationService.inboxStepsAddLoanPage(true, true));

      // this.appConfig.setJourneyData('inboxFlowFirstTime', false);
      
    } else {
      this.appConfig.setJourneyData('inboxFlowFirstTime', true);

      let obj = {
        loanData: null,
        isFormSubmitted: false,
        previousPageRoute: null,
        firsTimeEmiCalculated: false,
        isFormSubmittedLoanProcess: false,
        isEmiCalculated: false,
        backJourneyApiCall:false
      }
      this.appConfig.setJourneyData('loanDataPage', null);
      this.appConfig.setJourneyData('loanDataPage', obj);

      //case - only product is selected and logged out 
      this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/loan-data';

      this.stepsArray.push(this.stepperConfigurationService.inboxStepsAddLoanPage());
    }



    // landing page url based on conditon
    if (journeyData.selectLoanPageUrl) {
      this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/loan-data';
    }
  }

  additionalDataPageProcessing(journeyData, data, res) {
    // set data in ap config



    // "additionalData": [
    // {
    //   "applicationType": "TYPE A",
    //   "salutation": "1",
    //   "gender": "1",
    //   "maritalStatus": "1",
    //   "typeOfResidence": "1",
    //   "address1": "Mumbai A-10",
    //   "address2": "Resonance Tower",
    //   "mobile1": "8877667788",
    //   "mobile2": "9988998899",
    //   "supplementryCard": "1",
    //   "account number":"1223454", // tell bakend team to add field
    //   "supplementaryCardData":[ // tell bakend team to add field
    //    {
    //     "nameOnCard":"Rohit K",
    //     "minimumtoPay":"5000",
    //     "phoneNumber":"7766554444",
    //     "email":"test@test.com"
    //   }
    //   ]
    // }
    // ]



    //if supplementary array present , then loop and set _id 
    if (res.additionalData != null) {

      this.appConfig.setInnerJourneyData('additionalDataPage', 'showSupplemnetaryBool', false);
      this.appConfig.setInnerJourneyData('additionalDataPage', 'productIsCreditCard', false);

      // if (res.additionalData[0].supplementaryCardData.length > 0) {
      //   this.appConfig.setInnerJourneyData('additionalDataPage', 'showSupplemnetaryBool', true);
      //   this.appConfig.setInnerJourneyData('additionalDataPage', 'productIsCreditCard', true);

      //   // let counter = 0;
      //   // res.additionalData[0].supplementaryCardData.forEach((element: any) => {
      //   //   element['_id'] = counter;
      //   //   element.minimumToPay = +element.minimumToPay;
      //   //   counter++;
      //   // });
      // } else {
      //   this.appConfig.setInnerJourneyData('additionalDataPage', 'showSupplemnetaryBool', false);
      //   this.appConfig.setInnerJourneyData('additionalDataPage', 'productIsCreditCard', false);
      // }


      this.appConfig.setInnerJourneyData('additionalDataPage', 'additionalData', res.additionalData);
      this.appConfig.setInnerJourneyData('additionalDataPage', 'isFormSubmitted', true);

      // check application created condition so make fields readonly on loanData and AdditionalData page;
      this.appConfig.setInnerJourneyData('additionalDataPage', 'applicationSubmitted', true);
      this.appConfig.setInnerJourneyData('additionalDataPage', 'isFormSubmitted', true);

      //  based on conditions; any one will be aactive at a time
      // APPROVE , REFER , DECLINE , 
      // let status =  "APPROVE";
      // let status = "REFER";
      // let status =  'DECLINE";

      let status = res.appDecision;

      if (status == this.appConfig.getApproveMatch()) {
        this.appConfig.setInnerJourneyData('additionalDataPage', 'applicationStatus', this.appConfig.getApproveMatch());
        this.applicationStatus = this.appConfig.getApproveMatch();
        // this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/final-offer';
      } else if (status == this.appConfig.getReferMatch()) {
        this.appConfig.setInnerJourneyData('additionalDataPage', 'applicationStatus', this.appConfig.getReferMatch());
        this.applicationStatus = this.appConfig.getReferMatch();
        // this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/document-upload';
      } else if (status == this.appConfig.getDeclineMatch()) {
        this.appConfig.setInnerJourneyData('additionalDataPage', 'applicationStatus', this.appConfig.getDeclineMatch());
        this.applicationStatus = this.appConfig.getDeclineMatch();
        // I&M pending - confirm about this point *****
        //  this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/additional-data';
      } else {
      this.appConfig.setInnerJourneyData('additionalDataPage', 'applicationSubmitted', false);
      this.appConfig.setInnerJourneyData('additionalDataPage', 'isFormSubmitted', false);
        this.applicationStatus = "";
        console.log("no status found")
        // alert("no status found");
      }
      // this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/additional-data';
      this.stepsArray.push(this.stepperConfigurationService.inboxStepsAddAdditionalPage(true, true));

    } else {
      let obj = {
        additionalData: null,
        isFormSubmitted: false,
        previousPageRoute: null,
        showSupplemnetaryBool: false,
        productIsCreditCard: false,
        applicationSubmitted: false,
        applicationStatus: null
      };
      this.appConfig.setJourneyData('additionalDataPage', null);
      this.appConfig.setJourneyData('additionalDataPage', obj);


      this.stepsArray.push(this.stepperConfigurationService.inboxStepsAddAdditionalPage());



    }


    // WE give back screen previousPageRoute V.V.V IMP
    let backUrl = '/menu/tabs/entities/i-and-m/create-application/loan-data';
    this.appConfig.setInnerJourneyData('loanDataPage', 'previousPageRoute', backUrl);

    // landing page url based on conditon
    // (IGNORE BESIDE STATEMENT -> NOT IN USE - as we decide the route on application status at top)
    if (journeyData.additionalDataPageUrl) {
      this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/additional-data';
    }

  }

  documentsDataPageProcessing(journeyData, data, res) {

    // {
    //   "doxtxnid": "957",
    //   "received": "string",
    //   "generatedDate": "string",
    //   "docName": "Pan card",
    //   "dmsDocRefId": "string",
    //   "docUploadDate": "string",
    //   "binaryData":"",
    //    "fileName":""
    // }
    let actionsUpload = true;
    if (this.appConfig.getIsBranchManager()) {
      actionsUpload = false;
    }

    let obj = {
      documentsData: null,
      isFormSubmitted: false,
      previousPageRoute: null,
      documentSubmitted:false
    };
    this.appConfig.setJourneyData('documentsDataPage', null);
    this.appConfig.setJourneyData('documentsDataPage', obj);

    // if (res.documentDtl != null && res.documentDtl.length > 0) {
    //   let tableFormationArray = [];
    //   let counter = 0;
    //   res.documentDtl.forEach(element => {
    //     let obj: any = {};
    //     obj.id = counter;
    //     obj.doxtxnid = element.doxtxnid;
    //     obj.nameOfDocument = element.docName;
    //     obj.uploadFlag = 'N';
    //     obj.uploadedOn = null;
    //     obj.docValue = element.binaryData; //v.v.v imp - as next btn click condition is based on this
    //     obj.fileActions = {};
    //     obj.fileActions.actionsView = true;
    //     obj.fileActions.actionsUpload = actionsUpload;
    //     obj.fileActions.actionsDelete = false;
    //     obj.fileActions.isFileSelected = true;
    //     obj.fileActions.singleSelect = true;
    //     obj.fileActions.metaData = "";
    //     obj.fileActions.fileName = element.fileName;
    //     obj.fileActions.base64String = element.binaryData; //confirm this with parent page 
    //     obj.fileActions.base64StringFull = "";
    //     obj.fileActions.mimeType = element.mimeType;

    //     tableFormationArray.push(obj);
    //     counter++;
    //   });

    //   this.appConfig.setInnerJourneyData('documentsDataPage', 'documentsData', tableFormationArray);
    //   this.appConfig.setInnerJourneyData('loanDataPage', 'isFormSubmitted', true);

    //   // this.stepsArray.push(this.stepperConfigurationService.inboxStepsAddDocumentsPage(true,true));

    // } else {
    //   let obj = {
    //     documentsData: null,
    //     isFormSubmitted: false,
    //     previousPageRoute: null
    //   };
    //   this.appConfig.setJourneyData('documentsDataPage', null);
    //   this.appConfig.setJourneyData('documentsDataPage', obj);
    // }


    // I&M pending check this
    // if (this.applicationStatus == this.appConfig.getReferMatch()) {
    //   this.stepsArray.push(this.stepperConfigurationService.inboxStepsAddDocumentsPage(true, true));
    // }

      this.stepsArray.push(this.stepperConfigurationService.inboxStepsAddDocumentsPage(true, true));
    // WE give back screen previousPageRoute V.V.V IMP
    let backUrl = '/menu/tabs/entities/i-and-m/create-application/additional-data';
    this.appConfig.setInnerJourneyData('additionalDataPage', 'previousPageRoute', backUrl);

    // landing page url based on conditon 
    // IGNORE STATEMENT ->  (NOT IN USE - as we decide the route on application status at top)
    // IGNORE STATEMENT -> not in use -as application status is used for deciding landing path
    if (journeyData.documentPageUrl) {
      this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/document-upload';
    }

  }

  finalOfferPageProcessing(journeyData, data, res) {
    // if (this.applicationStatus == this.appConfig.getApproveMatch()) {
    //   this.stepsArray.push(this.stepperConfigurationService.inboxStepsAddFinalOfferPage());
    // }
      this.stepsArray.push(this.stepperConfigurationService.inboxStepsAddFinalOfferPage(true,true));
    // landing page url based on conditon
    // not in use -as application status is used for deciding landing path
    if(journeyData.finalOfferPageUrl){
      this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/final-offer';
    }

  }

  branchManagerConfirmationPageProcessing(journeyData, data, res) {
    this.stepsArray.push(this.stepperConfigurationService.inboxStepsAddBranchManagerConfirmationPage());
    // landing page url based on conditon
    this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/loan-data'; // show loan data
    // if (journeyData.branchManagerConfirmationPageUrl) {
      // this.landingUrl = '/menu/tabs/entities/i-and-m/create-application/branch-manager-confirmation';
    // }

  }
  routeProcessing(journeyData, data, res,title) {

    this.stepperConfigurationService.setStepsArray(this.stepsArray, title);

    this.appConfig.setJourneyData('inboxFlow', true);
    this.appConfig.setJourneyData('createApplicationFlow', false);
    // add remaining flow conditions below

    this.navController.navigateForward(this.landingUrl);
  }

  onEdit(data) {
    var url = "/menu/tabs/entities/i-and-m/accounting/5/edit";
    this.navController.navigateRoot(url);
    // var url = "/menu/tabs/entities/i-and-m/accounting/new";

  }
  onAdd() {
    this.menuConfig.assignMenuSelectedByIdentifier('createApplication');

    var url = "/menu/tabs/entities/i-and-m/create-application";
    let stepsArray = [];
    stepsArray = this.stepperConfigurationService.createApplicationSteps();
    let title = 'CREATE APPLICATION';
    this.stepperConfigurationService.setStepsArray(stepsArray, title);
    this.appConfig.setJourneyData('createApplicationFlow', true);
    this.appConfig.setJourneyData('inboxFlow', false);
    // add remaining flow conditions below

    this.navController.navigateRoot(url);
  }

  onCancelApplication(tabledata){
    console.log("cancel data "+JSON.stringify(tabledata));
    this.openAlert(tabledata);
  }

  async openAlert(tabledata) {
    const alert = await this.alertCtrl.create({
      header: 'Please Confirm',
      message: 'Are you sure you want to cancel?',
      // buttons: ['Disagree', 'Agree']
      buttons: [
        
        {
          text: 'Agree',
          handler: () => {
            console.log('Confirm Ok');
            this.alertCtrl.dismiss();
              this.declineProcess(tabledata);
            }
          },
          {
            text: 'Disagree',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }
      ]
    });

    await alert.present();
  }

  declineProcess(tabledata) {
    let data: any = {};
    data.showDeclineComments = true;
    data.comments = null;
    data.actionButtonText = 'SUBMIT';
    let title = 'Cancel Application';

    this.openPopup(data, title,tabledata);
  }

  async openPopup(data, title,tabledata) {


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
          this.declineApi(dataReturned['data'],tabledata);
          // this.declineshowToast(tabledata);
      }
    });
    await popover.present();
  }

  declineApi(data,tabledata) {
    let url = 'cancel-application';
    let reqObj :any = 
    {
      "transactionId": this.appConfig.getTRNTimestamp(),
      "channel":  this.appConfig.getChannel(),
      "requestedOn":  this.appConfig.getDateTime(),
      // "customerId": tabledata.customerId == undefined ? null :  tabledata.customerId,
      "applRefId": tabledata.applRefId,
      "language":this.appConfig.getLanguage()
      // "comments":data.comments
    }
    this.utilityService
      .callPostApi(
        reqObj,
        url
      )
      .then(
        (res :any) => {
          console.log('Success' + JSON.stringify(res));
          //I&M Pending
          this.declineshowToast(tabledata);
        },
        (err) => {
          // alert("error" + JSON.stringify(err))
          console.log('error' + JSON.stringify(err));
        }
      );
  }

  declineshowToast(tabledata){
    this.utilityService.showToast('success','Application cancelled successfully',{});
    let index = null;
    let counter = 0;
    this.tableData.forEach((element:any) => {
        if(element.id == tabledata.id){
          index = counter;
          return;
        }
        counter++;
    });
    if(index != null){
      this.tableData.splice(index,1);
    }
  }

  setRoleReload(){
      if(this.appConfig.getUserData().role == "enquiry"){
        this.utilityService.showToast('error', this.appConfig.getUserNotAuthMsg());
        this.appConfig.logout();
        this.appConfig.storagelogout().subscribe();
        this.router.navigateByUrl('login');
      }
  }

}

