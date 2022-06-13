import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild('chiru') chiru;
  @ViewChild('barChart') barChart;
  @ViewChild('contractAmt') contractAmt;
  @ViewChild('fxSettlement') fxSettlement;
  @ViewChild('pendingContracts') pendingContracts;

  lines: any;
  bars: any;
  colorArray: any;
  role:string;
  fromCurrency:string;
  toCurrency:string

  ngOnInit() {
    console.log("dashboard onInit");
  }

  ionViewWillEnter() {
    console.log("dashboard ionview enter");
    this.createBarChart();
  }

  createBarChart() {
    this.lines = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['USD', 'EUR', 'GBP', 'AUD'],
        datasets: [{
          label: 'Viewers in millions',
          data: [39000000, 12000000, 10000000, 9000000],
          backgroundColor: '#13efb2f2', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: true,
          labels: {
            fontColor: 'rgb(255, 99, 132)'
          }
        }
      }
    });
    this.bars = new Chart(this.contractAmt.nativeElement, {
      type: 'bar',
      data: {
        labels: ['USD', 'EUR', 'GBP'],
        datasets: [{
          label: 'Viewers in millions',
          data: [39000000, 12000000, 10000000],
          backgroundColor: '#17a2b8', // array should have same number of elements as number of dataset
          // borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          // borderWidth: 1
        },
        {
          label: 'Viewers in millions',
          data: [-10000000, -12000000,-1200000],
          backgroundColor: '#b5f519', // array should have same number of elements as number of dataset
          // borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          // borderWidth: 1
        }]
        
      },
      options: {
        scales: {
          xAxes: [{
              stacked: true
          }],
          yAxes: [{
              stacked: true
          }]
      }
    }
    });
    this.lines = new Chart(this.fxSettlement.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Q2 2019', 'Q3 2019'],
        datasets: [{
          label: 'Viewers in millions',
          data: [39000000, 12000000],
          backgroundColor: ['rgb(38, 194, 129),rgb(255, 99, 132)'], // array should have same number of elements as number of dataset
          borderColor: ['rgb(38, 194, 129),rgb(255, 99, 132)'],// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: true,
          labels: {
            fontColor: 'rgb(255, 99, 132)'
          }
        }
      }
    });
    this.lines = new Chart(this.pendingContracts.nativeElement, {
      type: 'polarArea',
      data: {
        labels: ['Purchase','Sale'],
        datasets: [{
          label: 'EUR',
          data: [12000000, -100000],
          backgroundColor: 'rgb(10, 86, 124)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(10, 86, 124)',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'GBP',
          data: [18000000, -300000],
          backgroundColor: 'rgb(39, 173, 235)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(39, 173, 235)',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'USD',
          data: [9000000, -180000],
          backgroundColor: 'rgb(173, 229, 254)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(173, 229, 254)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: true,
          labels: {
            fontColor: 'rgb(255, 99, 132)'
          }
        }
      }
    });
  }
}
