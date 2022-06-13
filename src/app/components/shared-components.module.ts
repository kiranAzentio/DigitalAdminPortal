import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonHeaderComponent } from './common-header/common-header.component';
import { DateComponent } from './date/date.component';
import { IonicModule } from '@ionic/angular';
import { LoginLayout1Page } from './login-layout-1/login-layout-1.page';
import { SelectLayout1Page } from './select-layout-1/select-layout-1.page';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SliderComponent } from './slider/slider.component';
import { SwipeToDismissListLayout1Page } from './swipe-to-dismiss-list-layout-1/swipe-to-dismiss-list-layout-1.page';
import { MomentPipePipe } from '../shared/moment-pipe.pipe';
import { RadioButtonLayout1Page } from './radio-button-layout-1/radio-button-layout-1.page';
import { NewPasswordLayout1Page } from './new-password-layout-1/new-password-layout-1.page';
import { NumberInputComponent } from './number-input/number-input.component';
import { SearchBarLayout1Page } from './search-bar-layout-1/search-bar-layout-1.page';
import { FilterPipe } from './pipes/FilterPipe';
import { CheckBoxLayout1Page } from './check-box-layout-1/check-box-layout-1.page';
import { ProfileLayout5Page } from './profile-layout-5/profile-layout-5.page';
import { RegistrationLayoutPage } from './registration-layout/registration-layout.page';
import { FooterComponent } from './footer/footer.component';
import { CommonPopupComponent } from './common-popup/common-popup.component';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { SplashScreenLayout3Page } from './splash-screen-layout-3/splash-screen-layout-3.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { CustomCurrencyPipe } from './pipes/CustomCurrencyPipe';
import { DefaultBackComponent } from './default-back/default-back.component';
import { MpinScreenLayoutComponent } from './mpin-screen-layout/mpin-screen-layout.component';
import { OtpScreenLayoutComponent } from './otp-screen-layout/otp-screen-layout.component';
import { WizardLayout1Page } from './wizard-layout-1/wizard-layout-1.page';
import { AppVersionModalComponent } from './app-version-modal/app-version-modal.component';
import { AccordianPage } from './accordian/accordian.page';
import { datagridRoute } from '../pages/util/data-grid/data-grid.route';
import { RouterModule } from '@angular/router';
import { StepperHeaderComponent } from './stepper-header/stepper-header.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { StepperButtonsComponent } from './stepper-buttons/stepper-buttons.component';
import {AccordionModule} from 'primeng/accordion';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { RestrictSpecialCharactersDirective } from './directives/restrict-special-characters.directive';
import { ContextMenuCheckDirective } from './directives/context-menu-check.directive';
import { RestrictCommentsSpecialCharactersDirective } from './directives/restrict-comments-special-characters.directive';
import { CurrencyMaskDirective } from './directives/currency-mask.directive';
import { UsdOnlyDirective } from './directives/usd-only-directive';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { BlockCopyCutPasteDirective } from './directives/block-copy-cut-paste.directive';
const DATAGRID_ROUTES = [...datagridRoute];

@NgModule({
  declarations: [
    CommonHeaderComponent,
    DateComponent,
    LoginLayout1Page,
    SliderComponent,
    NewPasswordLayout1Page,
    SwipeToDismissListLayout1Page,
    SelectLayout1Page,
    MomentPipePipe,
    RadioButtonLayout1Page,
    NumberInputComponent,
    SearchBarLayout1Page,
    FilterPipe,
    CheckBoxLayout1Page,
    ProfileLayout5Page,
    RegistrationLayoutPage,
    FooterComponent,
    CommonPopupComponent,
    SkeletonComponent,
    SplashScreenLayout3Page,
    CustomCurrencyPipe,
    DefaultBackComponent,
    AccordianPage,
    MpinScreenLayoutComponent,
    OtpScreenLayoutComponent,
    WizardLayout1Page,
    AppVersionModalComponent,
    StepperHeaderComponent,
    TextBoxComponent,
    StepperButtonsComponent,
    NumberOnlyDirective,
    RestrictSpecialCharactersDirective,
    ContextMenuCheckDirective,
    RestrictCommentsSpecialCharactersDirective,
    CurrencyMaskDirective,
    UsdOnlyDirective,
    DynamicFormComponent,
    BlockCopyCutPasteDirective
  ],
  imports: [
    RouterModule.forChild(DATAGRID_ROUTES),
    CommonModule, IonicModule, FormsModule,ReactiveFormsModule, 
    TranslateModule, IonicSelectableModule, NgSelectModule, CalendarModule,
    AccordionModule],
  exports: [
    CommonHeaderComponent,
    DateComponent,
    LoginLayout1Page,
    ProfileLayout5Page,AccordionModule,

    RegistrationLayoutPage,
    FormsModule,
    ReactiveFormsModule,
    CommonPopupComponent,
    TranslateModule,
    SliderComponent,
    SwipeToDismissListLayout1Page,
    SelectLayout1Page,
    MomentPipePipe,
    NewPasswordLayout1Page,
    RadioButtonLayout1Page,
    NumberInputComponent,
    SearchBarLayout1Page,
    FilterPipe,
    CheckBoxLayout1Page,
    FooterComponent,
    SkeletonComponent,
    SplashScreenLayout3Page,
    CustomCurrencyPipe,
    DefaultBackComponent,
    AccordianPage,
    MpinScreenLayoutComponent,
    OtpScreenLayoutComponent,
    WizardLayout1Page,
    AppVersionModalComponent,
    StepperHeaderComponent,
    TextBoxComponent,
    StepperButtonsComponent,
    NumberOnlyDirective,
    RestrictSpecialCharactersDirective,
    ContextMenuCheckDirective,
    RestrictCommentsSpecialCharactersDirective,
    CurrencyMaskDirective,
    UsdOnlyDirective,
    DynamicFormComponent,
    BlockCopyCutPasteDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedComponentsModule {}
