import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { NavController } from '@ionic/angular';
import { UtilityService } from '../../../../services/shared/utility/utility.service';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-i-and-m-dashboard',
  templateUrl: './i-and-m-dashboard.page.html',
  styleUrls: ['./i-and-m-dashboard.page.scss'],
})
export class IAndMDashboardPage implements OnInit {

  @ViewChild('contractAmt') contractAmt;
  @ViewChild('pending') pending;
  lines: any;
  bars: any;

  showTable: boolean = false;

  tableMetaData: any[] = [];
  tableData: any[] = [];
  tableGlobalFilterFields: any[] = [];
  tableTitle: string = 'List of cases with new users';
  customFilterData: any[] = [];

  private fieldArray: Array<any> = [];
  private newAttribute: any = {};

  showSkeleton = true

  responseFromApi: any = {
    "newCases": 0,
    "wipCases": 0,
    "pendingWithUW": 0,
    "offerAcceptance": 0,
    "declinedByPolicy": 0,
    "declinedByCust": 0,
    "totDisbAmtThisMonth": 0,
    "loanAcctThisMonth": 0
  }

  constructor(
    private navController: NavController,
    public utilityservice: UtilityService,
    public appConfig:AppConfigService,
    private router : Router
  ) { }

  ngOnInit() {
    this.appConfig.reloadSetAppConfig();
    this.setRoleReload();
  }

  AddRow(){
    alert("hi")
    this.fieldArray.push(this.newAttribute)
        this.newAttribute = {};
  }

  ionViewDidEnter() {
    let data: any = {}
    let url = "branch-dashboard"
    let returnObj:any = {};
    this.utilityservice.callPostApi(
      {
        "transactionId":this.appConfig.getTRNTimestamp(),
        "channel":this.appConfig.getChannel(),
        "requestedOn":this.appConfig.getDateTime(),
        "language":this.appConfig.getLanguage(),
        "customerId":null,
        "employeeId":  this.appConfig.getUserData().employeeId
       },
      url,returnObj).then((res: any) => {
        console.log("branch-dashboard Success" + JSON.stringify(res))
        if (res != null) {
          this.responseFromApi = res.applStatus[0]
          console.log("responseFromApi", this.responseFromApi)
          console.log("responseFromApi stringify", JSON.stringify(this.responseFromApi))
          this.createBarChart(res)
          this.showSkeleton =false
        }
      }, err => {
        console.log("error" + JSON.stringify(err))
        this.showSkeleton =false;
      })
  }

  splitObj(data:any) {
    var keys = [];
     var vals = [];
     for (var x in data) {
      keys.push(x);
      vals.push(data[x]);
   }
    return { keys: keys, vals: vals };
  }
  

  createBarChart(res) {
    console.log("chart Data", res)
    var labelForApplComplProcess = [];
    var dataForApplComplProcess = [];
    console.log("splitted data",res.applComplProcess);
    if(res.applComplProcess != undefined && res.applComplProcess != null && res.applComplProcess.length > 0){
    console.log("splitted data keys ",Object.keys(res.applComplProcess[0]))
    console.log("splitted data values",Object.values(res.applComplProcess[0]))
    labelForApplComplProcess = Object.keys(res.applComplProcess[0])
    dataForApplComplProcess = Object.values(res.applComplProcess[0])
    }

    this.bars = new Chart(this.contractAmt.nativeElement, {
      type: 'bar',
      data: {
        labels: labelForApplComplProcess,
        datasets: [{
          label: 'Days',
          data:dataForApplComplProcess,
          backgroundColor: '#0099A8', // array should have same number of elements as number of dataset
          // borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 0.5
        },
        ]
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            // barThickness: 8,  // number (pixels) or 'flex'
            maxBarThickness: 10 // number (pixels)
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    });

    var labelForpendingAppStatusProcess =[];
    var dataForpendingAppStatusProcess =[];
    console.log("splitted data",res.pendingAppStatus);
    // res.pendingAppStatus[0] = {'convlead':23,'dupapp':50,'duapdesc':25,'fb':'23','prelimchk':2,'eligchk':5,'docchk':20,'l1APPRV':'50','l9APPRV':'50','disbend':200};

    if(res.pendingAppStatus != undefined && res.pendingAppStatus != null && res.pendingAppStatus.length > 0){
      console.log("splitted data keys ",Object.keys(res.pendingAppStatus[0]))
      console.log("splitted data values",Object.values(res.pendingAppStatus[0]))
   
    if(res.pendingAppStatus[0].hasOwnProperty('convlead')){
      labelForpendingAppStatusProcess.push("Lead");
      dataForpendingAppStatusProcess.push(res.pendingAppStatus[0].convlead);
    }
      if(res.pendingAppStatus[0].hasOwnProperty('dupapp') ){
        labelForpendingAppStatusProcess.push("Duplicate Check");
        let dupapp = res.pendingAppStatus[0].dupapp == null ? 0 : +res.pendingAppStatus[0].dupapp;
        let duapdesc = (res.pendingAppStatus[0].duapdesc == undefined || res.pendingAppStatus[0].duapdesc == null) ? 0 : +res.pendingAppStatus[0].duapdesc;
        let descFinal = dupapp + duapdesc;
        dataForpendingAppStatusProcess.push(descFinal);
      }
        if(res.pendingAppStatus[0].hasOwnProperty('fb')){
        labelForpendingAppStatusProcess.push("Data Entry");
        dataForpendingAppStatusProcess.push(res.pendingAppStatus[0].fb);
      }
      if(res.pendingAppStatus[0].hasOwnProperty('prelimchk')){
        labelForpendingAppStatusProcess.push("Preliminary Check");
        dataForpendingAppStatusProcess.push(res.pendingAppStatus[0].prelimchk);
      }
      if(res.pendingAppStatus[0].hasOwnProperty('eligchk')){
        labelForpendingAppStatusProcess.push("Eligibility Check");
        dataForpendingAppStatusProcess.push(res.pendingAppStatus[0].eligchk);
      }
      if(res.pendingAppStatus[0].hasOwnProperty('docchk')){ 
        labelForpendingAppStatusProcess.push("Document Check");
        dataForpendingAppStatusProcess.push(res.pendingAppStatus[0].docchk);
      }
      if(res.pendingAppStatus[0].hasOwnProperty('l1APPRV')){
        labelForpendingAppStatusProcess.push("Underwriter Approval");
         let l1 = (res.pendingAppStatus[0].l1APPRV == undefined || res.pendingAppStatus[0].l1APPRV == null) ? 0 : +res.pendingAppStatus[0].l1APPRV;
         let l2 = (res.pendingAppStatus[0].l2APPRV == undefined || res.pendingAppStatus[0].l2APPRV == null ) ? 0 : +res.pendingAppStatus[0].l2APPRV;
         let l3 = (res.pendingAppStatus[0].l3APPRV == undefined || res.pendingAppStatus[0].l3APPRV == null ) ? 0 : +res.pendingAppStatus[0].l3APPRV;
         let l4 = (res.pendingAppStatus[0].l4APPRV == undefined || res.pendingAppStatus[0].l4APPRV == null ) ? 0 : +res.pendingAppStatus[0].l4APPRV;
         let l5 = (res.pendingAppStatus[0].l5APPRV == undefined || res.pendingAppStatus[0].l5APPRV == null ) ? 0 : +res.pendingAppStatus[0].l5APPRV;
         let l6 = (res.pendingAppStatus[0].l6APPRV == undefined || res.pendingAppStatus[0].l6APPRV == null ) ? 0 : +res.pendingAppStatus[0].l6APPRV;
         let l7 = (res.pendingAppStatus[0].l7APPRV == undefined || res.pendingAppStatus[0].l7APPRV == null ) ? 0 : +res.pendingAppStatus[0].l7APPRV;
         let l8 = (res.pendingAppStatus[0].l8APPRV == undefined || res.pendingAppStatus[0].l8APPRV == null ) ? 0 : +res.pendingAppStatus[0].l8APPRV;
         let l9 = (res.pendingAppStatus[0].l9APPRV == undefined || res.pendingAppStatus[0].l9APPRV == null ) ? 0 : +res.pendingAppStatus[0].l9APPRV;
         let l10 = (res.pendingAppStatus[0].l10APPRV == undefined || res.pendingAppStatus[0].l10APPRV == null ) ? 0 : +res.pendingAppStatus[0].l10APPRV;

         let finalLevel = l1+l2+l3+l4+l5+l6+l7+l8+l9+l10;
        dataForpendingAppStatusProcess.push(finalLevel);
      }
      if(res.pendingAppStatus[0].hasOwnProperty('disbend')){
        labelForpendingAppStatusProcess.push("Disbursement");
        dataForpendingAppStatusProcess.push(res.pendingAppStatus[0].disbend);
      }
  }
    //////////////////////////////////////////////////pending grapgh
    this.bars = new Chart(this.pending.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: labelForpendingAppStatusProcess,
        datasets: [{
          label: 'No of Applications',
          data: dataForpendingAppStatusProcess,
          backgroundColor: '#0033A1', // array should have same number of elements as number of dataset
          // borderColo0.: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 0.5
        },
        ]

      },
      options: {
        // indexAxis: 'y',
        scales: {
          xAxes: [{
            stacked: true

          }],
          yAxes: [{
            stacked: true,
            // barThickness: 8,  // number (pixels) or 'flex'
            maxBarThickness: 10, // number (pixels),
            min:0
          }]
        }
      }
    });
  }

  ionViewWillEnter() {
    this.setAll();
  }

  // setAll
  setAll() {
    this.setTableData();
    this.setTableMetaData();
    this.setTableGlobalFilterFields();
    this.setCustomFilterData() // custom filter
    this.showTable = true; // table gets inside DOM because of this.
  }

  // TABLE META DATA
  setTableMetaData() {
    // header means name(en.json orar.json name)
    this.tableMetaData = [
      // { field: 'srno', header: 'Sr.No', headerType: 'text', bodyType: 'text' },
      { field: 'userId', header: 'User Id', headerType: 'text', bodyType: 'text' },
      { field: 'userName', header: 'User Name', headerType: 'text', bodyType: 'text' },
      { field: 'poDate', header: 'PO Date', headerType: 'date', bodyType: 'dateText' },
      { field: 'poAmount', header: 'PO Amount', headerType: 'text', bodyType: 'currencyText' },
      // { field: 'lastShipmentdate', header: 'LAST SHIPMENTDATE', headerType: 'date', bodyType: 'dateText'  },
      { field: 'status', header: 'STATUS', headerType: 'dropdown', bodyType: 'statusText' },
    ];
  }

  // TABLE GLOBAL SEARCH
  setTableGlobalFilterFields() {
    this.tableGlobalFilterFields = [];
    this.tableGlobalFilterFields = ['userName', 'userId', 'poDate', 'poAmount.currencyValue', 'poAmount.currencyLabel', 'lastShipmentdate', 'status'];
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
      }
    ]
  }

  // TABLE DUMMYDATA

  setTableData() {
    this.tableData = [];
    this.tableData = [
      {
        "id": 1000,
        "srno": "1",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
        "userId": "12345",
        "userName": "Rohit Koli"
      },
      {
        "id": 1001,
        "srno": "2",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
        "userId": "45454",
        "userName": "Rohit Koli"

      },
      {
        "id": 1002,
        "srno": "PO 102",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
        "userId": "4545",
        "userName": "Rohit Koli"
      },
      {
        "id": 1003,
        "srno": "PO 103",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
        "userId": "15454",
        "userName": "Rohit Koli"
      },
      {
        "id": 1004,
        "srno": "PO 104",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
        "userId": "4545",
        "userName": "Rohit Koli"
      },
      {
        "id": 1005,
        "srno": "PO 105",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
        "userId": "15445",
        "userName": "Rohit Koli"
      },
      {
        "id": 1006,
        "srno": "PO 106",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
        "userId": "565656",
        "userName": "Rohit Koli"
      },
      {
        "id": 1007,
        "srno": "PO 107",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
        "userId": "15665",
        "userName": "Rohit Koli"
      },
      {
        "id": 1008,
        "srno": "PO 108",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
        "userId": "14342",
        "userName": "Rohit Koli"
      },
      {
        "id": 1009,
        "srno": "PO 109",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
        "userId": "145545",
        "userName": "Rohit Koli"
      },
      {
        "id": 10010,
        "srno": "PO 110",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
        "userId": "134435",
        "userName": "Rohit Koli"
      },
      {
        "id": 10011,
        "srno": "PO 111",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
        "userId": "232323",
        "userName": "Rohit Koli"
      },
    ]
  }

  onEdit(data) {
    var url = "/menu/tabs/entities/i-and-m/accounting/5/edit";
    this.navController.navigateRoot(url);
    // var url = "/menu/tabs/entities/i-and-m/accounting/new";

  }
  onAdd() {
    var url = "/menu/tabs/entities/i-and-m/accounting/new";
    // var url = "/menu/tabs/entities/i-and-m/accounting/new";
    this.navController.navigateRoot(url);
  }

  setRoleReload(){
    if(this.appConfig.getUserData().role == "enquiry"){
      this.utilityservice.showToast('error', this.appConfig.getUserNotAuthMsg());
      this.appConfig.logout();
      this.appConfig.storagelogout().subscribe();
      this.router.navigateByUrl('login');
    }
}

}
