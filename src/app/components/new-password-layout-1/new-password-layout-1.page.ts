import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';



@Component({
  selector: 'digital-cs-new-password-layout-1',
  templateUrl: 'new-password-layout-1.page.html',
  styleUrls: ['new-password-layout-1.page.scss'],
})
export class NewPasswordLayout1Page implements OnChanges {
  @Input() data: any;

  @Output() onDone = new EventEmitter();

  // item = {
  //   'password': '',
  //   'oldPassword': '',
  //   'confrimPassword': '',
  //   'userid':'',
  //   'isHidden':''
  // };
  bgImg : string ='assets/img/background/logo.svg'
  private isConfrimValid = true;
  private isPasswordValid = true;

  constructor(public translateService: TranslateService, public appConfigService: AppConfigService ) { }
TranslateServiceTranslateService

  ngOnChanges(changes: { [propKey: string]: any }) {
    this.data = changes['data'].currentValue;
    console.log("dataaaa-----"+this.data)
  }

  onDoneFunc(): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.validate()) {
      this.onDone.emit(this.data);
    }
  }

  validate(): boolean {
    this.isConfrimValid = true;
    this.isPasswordValid = true;

    if (!this.data.password || this.data.password.length === 0) {
      this.isPasswordValid = false;
    }

    if (!this.data.confrimPassword || this.data.confrimPassword.length === 0) {
      this.isConfrimValid = false;
    }

    if (this.data.password !== this.data.confrimPassword) {
      this.isConfrimValid = false;
      // this.appConfigService.showToast('error','New Password and Confirm Password do not match.');
    }

    return this.isPasswordValid && this.isConfrimValid;
  }
}
