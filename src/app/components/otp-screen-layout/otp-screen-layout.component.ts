import { Component, Output,OnInit, EventEmitter, ViewChild,SimpleChanges,Input, OnChanges, AfterViewInit,forwardRef, ChangeDetectorRef } from '@angular/core';
import { IonInput, Platform, NavController, ToastController } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { CustomCurrencyPipe } from '../pipes/CustomCurrencyPipe';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'src/app/services/shared/login/login.service';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { UserService } from 'src/app/services/shared/user/user.service';
declare var SMSReceive: any;

@Component({
  selector: 'digital-app-otp-screen-layout',
  templateUrl: './otp-screen-layout.component.html',
  styleUrls: ['./otp-screen-layout.component.scss'],
  
})
export class OtpScreenLayoutComponent{
  
}
