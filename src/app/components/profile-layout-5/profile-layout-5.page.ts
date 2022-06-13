import { Component, Output, EventEmitter, Input, OnChanges, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs/operators';
import { HttpResponse,HttpErrorResponse } from '@angular/common/http';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { ApiService } from 'src/app/services/shared/api/api.service';


const { Camera } = Plugins;

@Component({
  selector: 'digital-cs-profile-layout-5',
  templateUrl: 'profile-layout-5.page.html',
  styleUrls: ['profile-layout-5.page.scss'],
})
export class ProfileLayout5Page  {
 
}
