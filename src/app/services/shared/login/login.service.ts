import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../auth/account.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { ApiService } from '../api/api.service';
import { share } from 'rxjs/operators';
import { SessionStorageService } from 'ngx-webstorage';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
const { Device } = Plugins;
import { DeviceInfo } from '@capacitor/core';
import { AppConfigService } from '../app-configuration/app-config.service';
// import { UserService } from '../user/user.service';
// import { Device } from '@ionic-native/device/ngx';


@Injectable({
  providedIn: 'root',
})
export class LoginService {
  mobileInfo: any = {};
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider,
    private translate: TranslateService,
    private apiService: ApiService,
    private appConfigService: AppConfigService,
    private $sessionStorage: SessionStorageService,
    private storage: Storage,
    public http: HttpClient,
    // private userService : UserService
    // private device: DeviceInfo
  ) { }

  login(credentials, callback?) {
    const cb = callback || function () { };

    return new Promise((resolve, reject) => {


      this.authServerProvider.login(credentials).subscribe(
        (data) => {
          this.accountService.identity(true).then((account) => {
            // After the login the language will be changed to
            // the language selected by the user during his registration
            if (account !== null) {
              // save user account details in appconfig
              //  console.log('Device UUID is: ' + this.device.uuid);
              this.storage.set('sessionId', account.extra4);
              this.appConfigService.setUserLoggedIn(true);
              this.appConfigService.setLoggedInUserId(account.id);
              let userData = this.appConfigService.getUserData();
              account.idType = userData.idType;
              account.idNumber = userData.idNumber;
              this.appConfigService.assignUserData(account);
              this.translate.use(account.langKey);
            }
            // resolve(data);
            resolve(account);
          });
          return cb();
        },
        (err) => {
          this.logout();
          reject(err);
          return cb(err);
        }
      );
    });
  }

  loginWithToken(jwt, rememberMe) {
    return this.authServerProvider.loginWithToken(jwt, rememberMe);
  }

  logout() {

    this.authServerProvider.logout().subscribe();
    this.accountService.authenticate(null);
  }
  // setUserLog(accountInfo: any) {
  //   // accountInfo.id = this.appConfigService.getUserId();

  //   return this.http.post<any>(ApiService.API_URL + '/' + 'user-log-onlogout', accountInfo, { observe: 'response' });
  //   // return this.apiService.post('user-log-onlogout', accountInfo,sessionId, { responseType: 'text' as 'text' }).pipe(share());
  // }
}
