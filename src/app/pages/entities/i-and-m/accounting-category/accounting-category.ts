import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AccountingCategory } from './accounting-category.model';
import { AccountingCategoryService } from './accounting-category.service';
import { StepperConfigurationService } from 'src/app/services/shared/stepper-config/stepper-configuration.service';

@Component({
    selector: 'page-accounting-category',
    templateUrl: 'accounting-category.html'
})
export class AccountingCategoryPage {
    accountingCategories: AccountingCategory[];

    showTable:boolean = false;

    tableMetaData:any[] = [];
    tableData:any[] = [];
    tableGlobalFilterFields:any[] = [];
    tableTitle:string = 'PURCHASE ORDER HISTORY';

    username = '';
    email = '';
    // todo: add pagination

    constructor(
        private navController: NavController,
        private accountingCategoryService: AccountingCategoryService,
        private toastCtrl: ToastController,
        public plt: Platform,
        public stepperConfigurationService:StepperConfigurationService
    ) {
        this.accountingCategories = [];

          // stepper
    let stepArray = [
      {
        id:1,
        title:'STEP 1',
        icon:'demo',
        showColor:false
      },
      {
        id:2,
        title:'STEP 2',
        icon:'demo',
        showColor:false
      },
      {
        id:3,
        title:'STEP 3',
        icon:'demo',
        showColor:false
      },
    ]
    let title = 'CREATE APPLICATION';
    this.stepperConfigurationService.setStepsArray(stepArray,title);
    }

    ionViewWillEnter() {
        // this.loadAll();
    this.setAll();

  

    }

    next(){
      this.stepperConfigurationService.setColorForStepsArray([{id:1}]);
      this.navController.navigateForward('/menu/tabs/entities/i-and-m/accounting/detail');
    }

    async loadAll(refresher?) {
        this.accountingCategoryService.query().pipe(
            filter((res: HttpResponse<AccountingCategory[]>) => res.ok),
            map((res: HttpResponse<AccountingCategory[]>) => res.body)
        )
        .subscribe(
            (response: AccountingCategory[]) => {
                this.accountingCategories = response;
                if (typeof(refresher) !== 'undefined') {
                    setTimeout(() => {
                        refresher.target.complete();
                    }, 750);
                }
            },
            async (error) => {
                console.error(error);
                const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
                toast.present();
            });
    }

    trackId(index: number, item: AccountingCategory) {
        return item.id;
    }

    new() {
        this.navController.navigateForward('/tabs/entities/accounting-category/new');
    }

    edit(item: IonItemSliding, accountingCategory: AccountingCategory) {
        this.navController.navigateForward('/tabs/entities/accounting-category/' + accountingCategory.id + '/edit');
        item.close();
    }

    async delete(accountingCategory) {
        this.accountingCategoryService.delete(accountingCategory.id).subscribe(async () => {
            const toast = await this.toastCtrl.create(
                {message: 'AccountingCategory deleted successfully.', duration: 3000, position: 'middle'});
            toast.present();
            this.loadAll();
        }, (error) => console.error(error));
    }

    view(accountingCategory: AccountingCategory) {
        this.navController.navigateForward('/tabs/entities/accounting-category/' + accountingCategory.id + '/view');
    }

    
  // setAll
  setAll(){
    this.setTableData();
    this.setTableMetaData();
    this.setTableGlobalFilterFields();
    this.showTable = true; // table gets inside DOM because of this.
  }

  // TABLE META DATA
  setTableMetaData(){
    // header means name(en.json orar.json name)
      this.tableMetaData = [
        { field: 'facility', header: 'FACILITY', headerType: 'text', bodyType: 'text' },
        { field: 'poDate', header: 'PO DATE', headerType: 'date', bodyType: 'dateText'  },
        { field: 'poAmount', header: 'PO AMOUNT', headerType: 'text', bodyType: 'currencyText'  },
        { field: 'lastShipmentdate', header: 'LAST SHIPMENTDATE', headerType: 'date', bodyType: 'dateText'  },
        { field: 'status', header: 'STATUS', headerType: 'dropdown', bodyType: 'statusText'  },
    ];
  
    }

    // TABLE GLOBAL SEARCH
    setTableGlobalFilterFields(){
      this.tableGlobalFilterFields = [];
      this.tableGlobalFilterFields = ['facility','poDate','poAmount.currencyValue','poAmount.currencyLabel','lastShipmentdate','status'];
    }

    // TABLE DUMMYDATA
    
  setTableData(){
    this.tableData = [];
    this.tableData = [
      {
        "id": 1000,
        "facility": "PO 100",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
      },
      {
        "id": 1001,
        "facility": "PO 101",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
      },
      {
        "id": 1002,
        "facility": "PO 102",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
      },
      {
        "id": 1003,
        "facility": "PO 103",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
      },
      {
        "id": 1004,
        "facility": "PO 104",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
      },
      {
        "id": 1005,
        "facility": "PO 105",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
      },
      {
        "id": 1006,
        "facility": "PO 106",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
      },
      {
        "id": 1007,
        "facility": "PO 107",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
      },
      {
        "id": 1008,
        "facility": "PO 108",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
      },
      {
        "id": 1009,
        "facility": "PO 109",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
      },
      {
        "id": 10010,
        "facility": "PO 110",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "12345678",
          "currencyLabel": "USD"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "active",
      },
      {
        "id": 10011,
        "facility": "PO 111",
        "poDate": "02-15-2021",
        "poAmount": {
          "currencyValue": "987654446",
          "currencyLabel": "INR"
        },
        "lastShipmentdate": "02-15-2021",
        "status": "inactive",
      },
    ] 
    }

    onEdit(data){
        var url = "/menu/tabs/entities/i-and-m/accounting/5/edit";
        this.navController.navigateRoot(url);
        // var url = "/menu/tabs/entities/i-and-m/accounting/new";
        
    }
    onAdd(){
        var url = "/menu/tabs/entities/i-and-m/accounting/new";
        // var url = "/menu/tabs/entities/i-and-m/accounting/new";
        this.navController.navigateRoot(url);
    }
}
