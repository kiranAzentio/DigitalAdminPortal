import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {DialogModule} from 'primeng/dialog';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {InputTextModule} from 'primeng/inputtext';
import {ProgressBarModule} from 'primeng/progressbar';
import {DropdownModule} from 'primeng/dropdown';
import { PrimeTable } from './prime-table/prime-table.component';
import {TabViewModule} from 'primeng/tabview';
import {StepsModule} from 'primeng/steps';
import {FileUploadModule} from 'primeng/fileupload';

import { SharedComponentsModule } from '../shared-components.module';

@NgModule({
  declarations: [
    PrimeTable,
  ],
  imports: [
    CommonModule,
    TableModule,
    CalendarModule,
		SliderModule,
		DialogModule,
		MultiSelectModule,
		ContextMenuModule,
		DropdownModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    ProgressBarModule,
    SharedComponentsModule,
    TabViewModule,
    StepsModule,
    FileUploadModule
    // CalendarModule, //added in shared already
    ],
  exports: [
    PrimeTable,
    TableModule,
    CalendarModule,
		SliderModule,
		DialogModule,
		MultiSelectModule,
		ContextMenuModule,
		DropdownModule,
		ButtonModule,
		ToastModule,
    InputTextModule,
    ProgressBarModule,
    TabViewModule,
    StepsModule,
    FileUploadModule
    // CalendarModule, //added in shared already
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrimengComponentsModule {}
