import { Component, Output, EventEmitter, SimpleChanges, Input, OnChanges, AfterViewInit, forwardRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';

@Component({
  selector: 'digital-cs-accordian',
  templateUrl: 'accordian.page.html',
  providers: [],
  styleUrls: ['accordian.page.scss'],
})
export class AccordianPage implements OnChanges {
  @Input() data: any;

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  @Output() userOpened: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() userOpenedData: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickedLink: EventEmitter<any> = new EventEmitter<any>();
  @Output() ratingResponseData: EventEmitter<any> = new EventEmitter<any>();

  @Input() isMenuOpen: boolean = false;
  @Output() goToServicePage: EventEmitter<any> = new EventEmitter<any>();

  constructor(public appConfigService: AppConfigService, private modalCtrl: ModalController) {}

  ngOnInit() {}
  ngOnChanges(changes: { [propKey: string]: any }) {
    // this.data = changes['data'].currentValue;
  }

  public toggleAccordion(): void {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.userOpened.emit(true);
    } else {
      this.userOpened.emit(false);
    }
    var newObj: any = {};
    newObj.isMenuOpen = this.isMenuOpen;
    newObj.data = this.data;
    this.userOpenedData.emit(newObj);
  }

  public broadcastName(data: any): void {
    this.change.emit(data);
  }

  clickableClicked(items, clickValue, clickValueIdentifier, id) {
    var obj: any = {};
    obj.items = items;
    obj.clickValue = clickValue;
    obj.clickValueIdentifier = clickValueIdentifier;
    obj.id = id;
    this.clickedLink.emit(obj);
  }

  serviceClicked(items) {
    // console.log(items);
    // this.presentModal(items);
    this.goToServicePage.emit(items);
  }

  ratingResponse(data) {
    this.ratingResponseData.emit(data);
  }

  // async presentModal(items) {
  //   const modal = await this.modalCtrl.create({
  //     component: SelectServiceConfirmationModalComponent,
  //     backdropDismiss: false,
  //     componentProps: {
  //       data: items,
  //     },
  //   });
  //   await modal.present();
  //   await modal.onDidDismiss().then((dataReturned) => {
  //     if (dataReturned != null && dataReturned.role != 'backdrop' && dataReturned['data'] != undefined) {
  //       console.log('Data Returned from Modal: ' + JSON.stringify(dataReturned));
  //       this.goToServicePage.emit(items);
  //     }
  //   });
  // }
}
