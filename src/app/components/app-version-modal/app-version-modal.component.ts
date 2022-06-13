import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Market } from '@ionic-native/market/ngx';

@Component({
  selector: 'digital-app-app-version-modal',
  templateUrl: './app-version-modal.component.html',
  styleUrls: ['./app-version-modal.component.scss'],
})
export class AppVersionModalComponent implements OnInit {
  constructor(private modalCtrl: ModalController, private market: Market) {}

  ngOnInit() {}

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  openMarket() {
    this.market.open('your.package.name');
  }
}
