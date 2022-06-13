import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}



// fname : string = '';
// ngCurr2: string = '';
// dynamicForm: FormGroup;
// constructor(private formBuilder: FormBuilder) { 
//   // alert('in');
//   this.dynamicForm = this.formBuilder.group({
//     fname1: ['', Validators.required],
//     emailAddress: ['', Validators.required],
//     amountCurrency: ['', Validators.required],
//     currency: ['123456785', Validators.required],
// });
// }

// ngOnInit() {
// }


// amountcontinousEntered(val){
//   console.log("on enter "+val);
// }
// amountcontinousEnteredOnBlur(val){
//   console.log("on blur "+val);
// }
// }

// DYNAMIC REACTIVE FORM

// https://stackblitz.com/edit/dynamic-form-generate-from-json-angular-2-reactive-form