import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { AppConfigService } from '../app-configuration/app-config.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServerProvider {
  constructor(
    private http: HttpClient,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService,
    private appConfigService: AppConfigService,
    private utilityService: UtilityService
    ) {}

  getToken() {
    return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken');
  }

  getAuthToken():string {
    return this.$localStorage.retrieve('token')|| this.$sessionStorage.retrieve('token');
    }

  login(credentials): Observable<any> {
   

    const data = {
      username: credentials.username,
      password: credentials.password,
      rememberMe: credentials.rememberMe,
    };

     var newObj: any = {};
     if (this.appConfigService.getEncryptDatabool()) {
       let newData = this.utilityService.encrypt( data);
       newObj['encryptedRequest'] = newData;
       // newObj = null;
     } else {
       newObj['encryptedRequest'] = null;
       newObj = data;
     }

    //  alert(JSON.stringify(newObj));

    return this.http.post(ApiService.API_URL + '/login', data, { observe: 'response' }).pipe(map(authenticateSuccess.bind(this)));

    function authenticateSuccess(resp) {
      const bearerToken = resp.headers.get('Authorization');
      if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
        const jwt = bearerToken.slice(7, bearerToken.length);
        this.storeAuthenticationToken(jwt, credentials.rememberMe);
        return jwt;
      }
    }
  }

  loginWithToken(jwt, rememberMe) {
    if (jwt) {
      this.storeAuthenticationToken(jwt, rememberMe);
      return Promise.resolve(jwt);
    } else {
      return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
    }
  }

  storeAuthenticationToken(jwt, rememberMe) {
    if (rememberMe) {
      this.$localStorage.store('authenticationToken', jwt);
    } else {
      this.$sessionStorage.store('authenticationToken', jwt);
    }
  }

  storeDataInStorage(data,key,localStorage){
    if (localStorage) {
      this.$localStorage.store(key, data);
    } else {
      this.$sessionStorage.store(key, data);
    }
  }

  logout(): Observable<any> {
    return new Observable((observer) => {
      this.$localStorage.clear('authenticationToken');
      this.$sessionStorage.clear('authenticationToken');
      this.$localStorage.clear(this.appConfigService.getUserDataKey());
      this.$sessionStorage.clear(this.appConfigService.getUserDataKey());
      observer.complete();
    });
  }
  logout1() {
      this.$localStorage.clear('authenticationToken');
      this.$sessionStorage.clear('authenticationToken');
      this.$localStorage.clear(this.appConfigService.getUserDataKey());
      this.$sessionStorage.clear(this.appConfigService.getUserDataKey());
  }


}
