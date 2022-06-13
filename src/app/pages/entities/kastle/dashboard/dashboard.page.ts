import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { Chart } from 'chart.js';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';
import * as moment from 'moment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild('barchart') barchart;

  lines: any;
  bars: any;

  colorArray = [
    {
      bgColor: 'bgcolor1',
      countColor: 'color1',
    },
    {
      bgColor: 'bgcolor2',
      countColor: 'color2',
    },
    {
      bgColor: 'bgcolor3',
      countColor: 'color3',
    },
    {
      bgColor: 'bgcolor4',
      countColor: 'color4',
    },
    {
      bgColor: 'bgcolor5',
      countColor: 'color5',
    },
    {
      bgColor: 'bgcolor6',
      countColor: 'color6',
    },
    {
      bgColor: 'bgcolor1',
      countColor: 'color1',
    },
    {
      bgColor: 'bgcolor2',
      countColor: 'color2',
    },
    {
      bgColor: 'bgcolor3',
      countColor: 'color3',
    },
    {
      bgColor: 'bgcolor4',
      countColor: 'color4',
    },
    {
      bgColor: 'bgcolor5',
      countColor: 'color5',
    },
    {
      bgColor: 'bgcolor6',
      countColor: 'color6',
    },
  ];
apiResponse = null;
  apiResponse_OLD = {
    totalUser: 260,
    labels: ['Admin', 'Prospect', 'Customer', 'Sales', 'Field Collector', 'Verification'],
    datasets: [
      {
        label: 'Active Users',
        data: [172, 800, 526, 512, 2264, 1764],
        backgroundColor: ['#f26522', '#00aeef', '#92278f', '#ed145b', '#00a651', '#754c24'],
        fill: true,
      },
    ],
  };

  // apiResponseUpper = [
  //   {
  //     role: 'Admin',
  //     count: 54,
  //     countColor: 'color1',
  //     bgColor: 'bgcolor1',
  //     img: 'assets/img/icons/admin.png',
  //     active: 27,
  //     inActive: 27,
  //     width: '20%',

  //   },
  //   {
  //     role: 'Prospect',
  //     count: 70,
  //     countColor: 'color2',
  //     bgColor: 'bgcolor2',
  //     img: 'assets/img/icons/prospect.png',
  //     active: 25,
  //     inActive: 45,
  //     width: '10%',
  //   },
  //   {
  //     role: 'Customer',
  //     count: 15,
  //     countColor: 'color3',
  //     bgColor: 'bgcolor3',
  //     img: 'assets/img/icons/customer.png',
  //     active: 9,
  //     inActive: 6,
  //     width: '90%',
  //   },
  //   {
  //     role: 'Sales',
  //     count: 250,
  //     countColor: 'color4',
  //     bgColor: 'bgcolor4',
  //     img: 'assets/img/icons/sales.png',
  //     active: 180,
  //     inActive: 70,
  //     width: '60%',
  //   },
  //   {
  //     role: 'Field Collector',
  //     count: 90,
  //     countColor: 'color5',
  //     bgColor: 'bgcolor5',
  //     img: 'assets/img/icons/fieldcollector.png',
  //     active: 45,
  //     inActive: 45,
  //     width: '50%',
  //   },
  //   {
  //     role: 'Verification',
  //     count: 150,
  //     countColor: 'color6',
  //     bgColor: 'bgcolor6',
  //     img: 'assets/img/icons/verification.png',
  //     active: 90,
  //     inActive: 60,
  //     width: '30%',
  //   },
  // ];
  apiResponseUpper = [];

  apiResponseUpper_OLD = [
    {
      role: 'Admin',
      count: 54,
      img: 'admin.png',
      active: 27,
      inActive: 27,
    },
    {
      role: 'Prospect',
      count: 70,
      img: 'prospect.png',
      active: 25,
      inActive: 45,
    },
    {
      role: 'Customer',
      count: 15,
      img: 'customer.png',
      active: 9,
      inActive: 6,
    },
    {
      role: 'Sales',
      count: 250,
      img: 'sales.png',
      active: 180,
      inActive: 70,
    },
    {
      role: 'Field Collector',
      count: 90,
      img: 'fieldcollector.png',
      active: 45,
      inActive: 45,
    },
    {
      role: 'Verification',
      count: 150,
      img: 'verification.png',
      active: 90,
      inActive: 60,
    },
  ];
  date = new Date();
  ngOnInit() {
    // this.modifyUpperApiResponse();
    this.dashboard1();
  }

  modifyUpperApiResponse() {
    for (let index = 0; index < this.apiResponseUpper.length; index++) {
      const element = this.apiResponseUpper[index];
      for (let index2 = 0; index2 < this.colorArray.length; index2++) {
        const element2 = this.colorArray[index];
        element['bgColor'] = element2.bgColor;
        element['countColor'] = element2.countColor;
        element['width']=(element.active * 100)/element.count
       }
    }
  }
  languageData = [
    {
      id: 'HINDI',
      label: 'HINDI',
    },
    {
      id: 'ENGLISH',
      label: 'ENGLISH',
    },
    {
      id: 'ARABIC',
      label: 'ARABIC',
    },
  ];
  data = {
    companies: [
      {
        company: 'COUNTRY',
        projects: [
          {
            projectName: 'देश',
            projectLanguage: 'HINDI',
          },
          {
            projectName: 'Country',
            projectLanguage: 'ENGLISH',
          },
        ],
      },
    ],
  };

  maxDateValue = new Date();

  myForm: FormGroup;

  constructor(private fb: FormBuilder, public appConfigService: AppConfigService,
    private utilityService : UtilityService
    ) {
    this.myForm = this.fb.group({
      companies: this.fb.array([]),
    });

    this.setCompanies();
  }

  ionViewWillEnter() {
    console.log('dashboard ionview enter');
    // this.createBarChart();
  }

  get companiesFormArr(): FormArray {
    return this.myForm.get('companies') as FormArray;
  }

  addNewCompany() {
    this.companiesFormArr.push(
      this.fb.group({
        company: [''],
        // projects: this.fb.array([]) // no nested form array
        projects: this.addDefaultNestedControl(), // add default single nested form array
      })
    );
  }

  addDefaultNestedControl() {
    let arr = new FormArray([]);
    arr.push(
      this.fb.group({
        projectName: '',
        projectLanguage: '',
      })
    );
    return arr;
  }

  deleteCompany(index) {
    this.companiesFormArr.removeAt(index);
  }

  addNewProject(control) {
    control.push(
      this.fb.group({
        projectName: [''],
        projectLanguage: [''],
      })
    );
  }

  deleteProject(control, index) {
    control.removeAt(index);
  }

  setCompanies() {
    this.data.companies.forEach((x) => {
      this.companiesFormArr.push(
        this.fb.group({
          company: x.company,
          projects: this.setProjects(x),
        })
      );
    });
  }

  setProjects(x) {
    let arr = new FormArray([]);
    x.projects.forEach((y) => {
      arr.push(
        this.fb.group({
          projectName: y.projectName,
          projectLanguage: y.projectLanguage,
        })
      );
    });
    return arr;
  }

  createBarChart() {
    this.bars = new Chart(this.barchart.nativeElement, {
      type: 'bar',

      data: {
        labels: this.apiResponse.labels,
        datasets: this.apiResponse.datasets,
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              barPercentage: 0.4,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
    });
    // this.lines = new Chart( {
    //   type: 'doughnut',
    //   data: {
    //     labels: ['Q2 2019', 'Q3 2019'],
    //     datasets: [{
    //       label: 'Viewers in millions',
    //       data: [39000000, 12000000],
    //       backgroundColor: ['rgb(38, 194, 129),rgb(255, 99, 132)'], // array should have same number of elements as number of dataset
    //       borderColor: ['rgb(38, 194, 129),rgb(255, 99, 132)'],// array should have same number of elements as number of dataset
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     legend: {
    //       display: true,
    //       labels: {
    //         fontColor: 'rgb(255, 99, 132)'
    //       }
    //     }
    //   }
    // });
    // this.lines = new Chart( {
    //   type: 'polarArea',
    //   data: {
    //     labels: ['Purchase','Sale'],
    //     datasets: [{
    //       label: 'EUR',
    //       data: [12000000, -100000],
    //       backgroundColor: 'rgb(10, 86, 124)', // array should have same number of elements as number of dataset
    //       borderColor: 'rgb(10, 86, 124)',// array should have same number of elements as number of dataset
    //       borderWidth: 1
    //     },
    //     {
    //       label: 'GBP',
    //       data: [18000000, -300000],
    //       backgroundColor: 'rgb(39, 173, 235)', // array should have same number of elements as number of dataset
    //       borderColor: 'rgb(39, 173, 235)',// array should have same number of elements as number of dataset
    //       borderWidth: 1
    //     },
    //     {
    //       label: 'USD',
    //       data: [9000000, -180000],
    //       backgroundColor: 'rgb(173, 229, 254)', // array should have same number of elements as number of dataset
    //       borderColor: 'rgb(173, 229, 254)',// array should have same number of elements as number of dataset
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     legend: {
    //       display: true,
    //       labels: {
    //         fontColor: 'rgb(255, 99, 132)'
    //       }
    //     }
    //   }
    // });
  }

  async dashboard1() {
    let req = {
      "langId":this.appConfigService.getLanguageId(),
      "randomKey" : this.appConfigService.rsa_encrypt(this.appConfigService.getSecret()),
      "transactionId" : this.utilityService.getTRNTimestamp(),
      "userId" : this.appConfigService.getUserData().userId
    };
    let url = "querydata-dashboard1";
    let crudObj :any = {};
    if (this.appConfigService.getEncryptDatabool()) {
      let newData = this.appConfigService.encrypt(this.appConfigService.secretKey, req);
      crudObj['encryptedRequest'] = newData;
      crudObj['randomKey'] = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
    } else {
      crudObj = req;
      crudObj['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }
    

   let d1 = await this.utilityService.callPostApi(crudObj, url).then((resp: any) => {
     debugger;
      // decryption logic
      if (this.appConfigService.getEncryptDatabool()) {
        let decryptedData = this.appConfigService.decrypt(
              this.appConfigService.secretKey,
              resp.encryptedResponse
            );
            let fullResponse = JSON.parse(decryptedData);
            resp = fullResponse;
      } 

     let res = resp.result;
    this.dashboard2();
        /* -- To get Active users - Role wise
        REFER -->  activeUsersList

        ---- To get Inactive users - Role wise
        REFER -->  inactiveUsersList

        -- To get Prospect users - Registration in process
        REFER --> prospectUsersList

        - To get all configured users in the application
        REFER --> allUsersList

       */

        
      //api response
      /* {
        "prospectUsersList": [
          {
            "count": 2,
            "role": "Prospect"
          }
        ],
        "allUsersList": [
          {
            "count": 4
          }
        ],
        "inactiveUsersList": [
          {
            "count": 1,
            "role": "Administrator"
          }
        ],
        "activeUsersList": [
          {
            "count": 1,
            "role": "Administrator"
          }
        ]
      }
      */
      console.log("KASTLE dashboard1 " + JSON.stringify(res));
      this.setDashboard1Data(res);
    }, err => {
      debugger;
      console.log("error while fetching screen data");
    });
  }


  adminDashboard1Obj = null;
  prospectDashboard1Obj = null;
  customerDashboard1Obj = null;
  salesDashboard1Obj = null;
  fieldCollectorDashboard1Obj = null;
  verficationDashboard1Obj = null;

  adminPresent:boolean = false;
  prospectPresent:boolean = false;
  customerPresent:boolean = false;
  salesPresent:boolean = false;
  fieldCollectorPresent:boolean = false;
  verficationPresent:boolean = false;

  totalUser = 0;

  dashboard1FinalData = [];

  setDashboard1Data(resp){
    this.adminDashboard1Obj = {};
      this.prospectDashboard1Obj = {};
      this.customerDashboard1Obj = {};
      this.salesDashboard1Obj = {};
      this.fieldCollectorDashboard1Obj = {};
      this.verficationDashboard1Obj = {};
      
      // ACTIVE USERS
      resp.activeUsersList.forEach(element => {
        if(element.role == "Administrator"){ // check roleId
          this.adminPresent = true;
          this.setActiveData(this.adminDashboard1Obj,element);
        }
        if(element.role == "Individual Prospect"){ // check roleId
          this.prospectPresent = true;
          this.setActiveData(this.prospectDashboard1Obj,element);
        }
        if(element.role == "Customer"){ // check roleId
          this.customerPresent = true;
          this.setActiveData(this.customerDashboard1Obj,element);
        }
        if(element.role == "Sales User"){ // check roleId
          this.salesPresent = true;
          this.setActiveData(this.salesDashboard1Obj,element);
        }
        if(element.role == "Field Collector"){ // check roleId
          this.fieldCollectorPresent = true;
          this.setActiveData(this.fieldCollectorDashboard1Obj,element);
        }
        if(element.role == "Verification"){ // check roleId
          this.verficationPresent = true;
          this.setActiveData(this.verficationDashboard1Obj,element);
        }
      });

       // INACTIVE USERS
       resp.inactiveUsersList.forEach(element => {
        if(element.role == "Administrator"){ // check roleId
          this.adminPresent = true;
          this.setInActiveData(this.adminDashboard1Obj,element);
        }
        if(element.role == "Individual Prospect"){ // check roleId
          this.prospectPresent = true;
          this.setInActiveData(this.prospectDashboard1Obj,element);
        }
        if(element.role == "Customer"){ // check roleId
          this.customerPresent = true;
          this.setInActiveData(this.customerDashboard1Obj,element);
        }
        if(element.role == "Sales User"){ // check roleId
          this.salesPresent = true;
          this.setInActiveData(this.salesDashboard1Obj,element);
        }
        if(element.role == "Field Collector"){ // check roleId
          this.fieldCollectorPresent = true;
          this.setInActiveData(this.fieldCollectorDashboard1Obj,element);
        }
        if(element.role == "Verification"){ // check roleId
          this.verficationPresent = true;
          this.setInActiveData(this.verficationDashboard1Obj,element);
        }
      });

        // PROSPECT (it doenst give active or inactive)
        resp.prospectUsersList.forEach(element => {
          if(element.role == "Individual Prospect"){ // check roleId
          this.prospectPresent = true;
          this.setCount(this.prospectDashboard1Obj,element)
          // this.setActiveData(this.prospectDashboard1Obj,element);
          // this.setInActiveData(this.prospectDashboard1Obj,element);
          }
        });

        //all users
        if(resp.allUsersList.length > 0){
          this.totalUser = resp.allUsersList[0].count;
        }
    

    if(this.adminPresent){
      this.adminDashboard1Obj['role'] = 'Administrator'; // use translation acc to  language
      this.adminDashboard1Obj['img'] = "admin.png";

      if(!this.adminDashboard1Obj.hasOwnProperty('active')){
        this.adminDashboard1Obj['active'] = 0;
      }
      if(!this.adminDashboard1Obj.hasOwnProperty('inActive')){
        this.adminDashboard1Obj['inActive'] = 0;
      }
      this.adminDashboard1Obj['count'] = this.adminDashboard1Obj['active'] + this.adminDashboard1Obj['inActive'];
      this.dashboard1FinalData.push(this.adminDashboard1Obj);
    }

    if(this.prospectPresent){
      this.prospectDashboard1Obj['role'] = 'Individual Prospect'; // use translation acc to  language
      this.prospectDashboard1Obj['img'] = "prospect.png"; 
      if(!this.prospectDashboard1Obj.hasOwnProperty('active')){
        this.prospectDashboard1Obj['active'] = 0;
      }
      if(!this.prospectDashboard1Obj.hasOwnProperty('inActive')){
        this.prospectDashboard1Obj['inActive'] = 0;
      }
      // this.prospectDashboard1Obj['count'] = this.prospectDashboard1Obj['active'] + this.prospectDashboard1Obj['inActive'];
      this.dashboard1FinalData.push(this.prospectDashboard1Obj);
    }
  

    if(this.customerPresent){
      this.customerDashboard1Obj['role'] = 'Customer'; // use translation acc to  language
      this.customerDashboard1Obj['img'] = "customer.png";
      if(!this.customerDashboard1Obj.hasOwnProperty('active')){
        this.customerDashboard1Obj['active'] = 0;
      }
      if(!this.customerDashboard1Obj.hasOwnProperty('inActive')){
        this.customerDashboard1Obj['inActive'] = 0;
      }
      this.customerDashboard1Obj['count'] = this.customerDashboard1Obj['active'] + this.customerDashboard1Obj['inActive'];
      this.dashboard1FinalData.push(this.customerDashboard1Obj);
    }

    if(this.salesPresent){
      this.salesDashboard1Obj['role'] = 'Sales User'; // use translation acc to  language
      this.salesDashboard1Obj['img'] = "sales.png";
      if(!this.salesDashboard1Obj.hasOwnProperty('active')){
        this.salesDashboard1Obj['active'] = 0;
      }
      if(!this.salesDashboard1Obj.hasOwnProperty('inActive')){
        this.salesDashboard1Obj['inActive'] = 0;
      }
      this.salesDashboard1Obj['count'] = this.salesDashboard1Obj['active'] + this.salesDashboard1Obj['inActive'];
      this.dashboard1FinalData.push(this.salesDashboard1Obj);
    }

    if(this.fieldCollectorPresent){
      this.fieldCollectorDashboard1Obj['role'] = 'Field Collector'; // use translation acc to  language
      this.fieldCollectorDashboard1Obj['img'] = "fieldcollector.png";
      if(!this.fieldCollectorDashboard1Obj.hasOwnProperty('active')){
        this.fieldCollectorDashboard1Obj['active'] = 0;
      }
      if(!this.fieldCollectorDashboard1Obj.hasOwnProperty('inActive')){
        this.fieldCollectorDashboard1Obj['inActive'] = 0;
      }
      this.fieldCollectorDashboard1Obj['count'] = this.fieldCollectorDashboard1Obj['active'] + this.fieldCollectorDashboard1Obj['inActive'];
      this.dashboard1FinalData.push(this.fieldCollectorDashboard1Obj);
    }

    if(this.verficationPresent){
      this.verficationDashboard1Obj['role'] = 'Verfication'; // use translation acc to  language
      this.verficationDashboard1Obj['img'] = "verfication.png";
      if(!this.verficationDashboard1Obj.hasOwnProperty('active')){
        this.verficationDashboard1Obj['active'] = 0;
      }
      if(!this.verficationDashboard1Obj.hasOwnProperty('inActive')){
        this.verficationDashboard1Obj['inActive'] = 0;
      }
      this.verficationDashboard1Obj['count'] = this.verficationDashboard1Obj['active'] + this.verficationDashboard1Obj['inActive'];
      this.dashboard1FinalData.push(this.verficationDashboard1Obj);
    }
   
    debugger;
    console.log("dashboard1FinalData "+JSON.stringify(this.dashboard1FinalData,null,2))
      this.apiResponseUpper = this.dashboard1FinalData;
    this.modifyUpperApiResponse();
  }
  setActiveData(obj,element){
    obj['active'] = element.count; 
  }
  setInActiveData(obj,element){
    obj['inActive'] = element.count; 
  }
  setCount(obj,element){
    obj['count'] = element.count; 
  }


  onChange(data){
   this.dashboard2(); 
  }

  dashboard2() {
    debugger;
    let yyyy = moment(this.date).format('YYYY');
    let mmVal = moment(this.date).format('MM');
    let mm = this.returnMonthName(mmVal)
    let date = `'${mm}-${yyyy}'`;

    let req = {
      "date":date,
      "langId":this.appConfigService.getLanguageId(),
      "randomKey" : this.appConfigService.rsa_encrypt(this.appConfigService.getSecret()),
      "transactionId" : this.utilityService.getTRNTimestamp(),
      "userId" : this.appConfigService.getUserData().userId
    };
    let url = "querydata-dashboard2";
    let crudObj :any = {};
    if (this.appConfigService.getEncryptDatabool()) {
      let newData = this.appConfigService.encrypt(this.appConfigService.secretKey, req);
      crudObj['encryptedRequest'] = newData;
      crudObj['randomKey'] = this.appConfigService.rsa_encrypt(this.appConfigService.getSecret());
    } else {
      crudObj = req;
      crudObj['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }
    this.utilityService.callPostApi(crudObj, url).then((resp: any) => {

      // decryption logic
      if (this.appConfigService.getEncryptDatabool()) {
        let decryptedData = this.appConfigService.decrypt(
              this.appConfigService.secretKey,
              resp.encryptedResponse
            );
            let fullResponse = JSON.parse(decryptedData);
            resp = fullResponse;
      } 

      let res = resp.result;
      

      // To get all dashboard data

      /*{
        "allDashboardData": [
          {
            "count": 2,
            "role": "Prospect"
          }
        ]
        */
let labels = [];
let data = [];
if(res.allDashboardData.length > 0){
  res.allDashboardData.forEach(element => {
    labels.push(element.role);
    data.push(element.count);
});
}
      debugger;
      console.log("KASTLE dashboard2 " + JSON.stringify(res));
      this.apiResponse = {
        totalUser: this.totalUser,
        labels1: ['Admin', 'Prospect', 'Customer', 'Sales', 'Field Collector', 'Verification'],
        labels:labels,
        datasets: [
          {
            label: 'Active Users',
            data1: [172, 800, 526, 512, 2264, 1764],
            data: data,
            backgroundColor: ['#f26522', '#00aeef', '#92278f', '#ed145b', '#00a651', '#754c24'],
            fill: true,
          },
        ],
      }

      this.createBarChart();
    }, err => {
      debugger;
      console.log("error while fetching screen data");
    });
  }

  returnMonthName(val){
    let ans = null;
    switch (val) {
      case "01":
        ans = "JAN";
      break;
      case "02":
        ans = "FEB";
      break;
      case "03":
        ans = "MAR";
      break;
      case "04":
        ans = "APR";
      break;
      case "05":
        ans = "MAY";
      break;
      case "06":
        ans = "JUN";
      break;
      case "07":
        ans = "JUL";
      break;
      case "08":
        ans = "AUG";
      break;
      case "09":
        ans = "SEP";
      break;
      case "10":
        ans = "OCT";
      break;
      case "11":
        ans = "NOV";
      break;
      default:
        ans = "DEC";
        break;
    }
    return ans;
  }

}

//////////////////////////////////////////  to add more bar chart in bar chart
// ,{
//   label: 'Viewers in millions',
//   data: [-10000000, -12000000,-1200000],
//   backgroundColor: '#b5f519', // array should have same number of elements as number of dataset
// }
