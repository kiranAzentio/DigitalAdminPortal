import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthExpiredInterceptor } from './interceptors/auth-expired.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { SharedComponentsModule } from './components/shared-components.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { Sim } from '@ionic-native/sim/ngx';
import { DataGridPage } from './pages/util/data-grid/data-grid.page';
import { PrimengComponentsModule } from './components/primeng-components/primeng-components.module';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { Market } from '@ionic-native/market/ngx';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent,DataGridPage],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    IonicModule.forRoot(),
    SuperTabsModule.forRoot(),
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
    AppRoutingModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    IonicSelectableModule,
    NgSelectModule,
    BrowserAnimationsModule,
    SharedComponentsModule,
    PrimengComponentsModule,
    IonicStorageModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FingerprintAIO,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
    FileOpener,
    FileChooser,
    IOSFilePicker,
    FileTransfer,
    FilePath,
    File,
    InAppBrowser,
    LaunchNavigator,
    Diagnostic,
    Uid,
    AndroidPermissions,
    Sim,
    DocumentViewer,
    Market,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
