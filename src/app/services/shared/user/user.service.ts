import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { share } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { LoginService } from '../login/login.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: any;

  constructor(public apiService: ApiService, public loginService: LoginService, public http: HttpClient) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    this.loginService
      .login(accountInfo)
      .then((res) => {
        this.loggedIn(res);
        return of(res);
      })
      .catch((err) => {
        console.error('ERROR', err);
        return throwError(err);
      });
  }

  findAll(): Observable<any> {
    return this.apiService.get('users');
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    return this.apiService.post('register', accountInfo, { responseType: 'text' as 'text' }).pipe(share());
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.loginService.logout();
    this.user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  private loggedIn(resp) {
    this.user = resp.user;
  }
  verifyOtpRiya(accountInfo: any): Observable<any> {

    // return this.apiService.post('verify-otp', accountInfo, { responseType: 'text' as 'text' }).pipe(share());
    return this.http.post<any>(ApiService.API_URL + '/' + 'customers/verifyOTP', accountInfo, { observe: 'response' });
  }
  verifyOtp(accountInfo: any): Observable<any> {

    // return this.apiService.post('verify-otp', accountInfo, { responseType: 'text' as 'text' }).pipe(share());
    return this.http.post<any>(ApiService.API_URL + '/' + 'verify-otp', accountInfo, { observe: 'response' });
  }
  verifyOtpTemp(accountInfo: any): Observable<any> {

    return of(accountInfo);
  }
  // changePassword(accountInfo: any) {
  //   return this.apiService.post('set-password', accountInfo, { responseType: 'text' as 'text' }).pipe(share());
  // }
  resendOtp(accountInfo: any): Observable<any> {

    // if(accountInfo.isRegister){ 
    // return of(accountInfo) ;
    //   }else{
    return this.http.post<any>(ApiService.API_URL + '/' + 'resend-otp', accountInfo, { observe: 'response' });
    //  return this.apiService.post('resend-otp', accountInfo, { responseType: 'text' as 'text' }).pipe(share());
    // }
  }
  resendOtpRiya(accountInfo: any): Observable<any> {

    // if(accountInfo.isRegister){ 
    // return of(accountInfo) ;
    //   }else{
    return this.http.post<any>(ApiService.API_URL + '/' + 'customers/resendOTP', accountInfo, { observe: 'response' });
    //  return this.apiService.post('resend-otp', accountInfo, { responseType: 'text' as 'text' }).pipe(share());
    // }
  }

  validateLogin(accountInfo: any) {
    // return of(accountInfo) ;
    return this.http.post<any>(ApiService.API_URL + '/' + 'validate-login', accountInfo, { observe: 'response' });
    //  return this.apiService.post('validate-login', accountInfo, { responseType: 'text' as 'text' }).pipe(share());
  }

  changePassword(accountInfo: any): Observable<any> {

    // if(accountInfo.isRegister){ 
    // return of(accountInfo) ;
    // }else{
    // return this.apiService.post('set-password', accountInfo, { responseType: 'text' as 'text' }).pipe(share());
    return this.http.post<any>(ApiService.API_URL + '/' + 'set-password', accountInfo, { observe: 'response' })
    // }
  }
  // getHeroes(): Observable<Hero[]> {
  //   return of(HEROES);
  // }
  register1(accountInfo: any): Observable<any> {
    return this.apiService.post('customers/validateCustomer', accountInfo, { responseType: 'text' as 'text' }).pipe(share());

    // return this.http.post<any>('customers/validateCustomer', body, { observe: 'response'});
    // return of(accountInfo) ;
  }
  register(accountInfo: any): Observable<any> {
    // return this.apiService.post('customers/validateCustomer', accountInfo, { responseType: 'text' as 'text' }).pipe(share());
    // return this.http.post<any>('customers/validateCustomer', accountInfo, { observe: 'response'});
    return this.http.post<any>(ApiService.API_URL + '/' + 'customers/validateCustomer', accountInfo, { observe: 'response' });
    // return of(accountInfo) ;
  }
  updateCustomer(accountInfo: any): Observable<any> {
    // return this.apiService.post('customers/validateCustomer', accountInfo, { responseType: 'text' as 'text' }).pipe(share());
    // return this.http.post<any>('customers/validateCustomer', accountInfo, { observe: 'response'});
    return this.http.post<any>(ApiService.API_URL + '/' + 'customers/updateCustomer', accountInfo, { observe: 'response' });
    // return of(accountInfo) ;
  }
  saveMobileInfo(mobileInfo: any): Observable<any> {

    return this.http.post<any>(ApiService.API_URL + '/' + 'kdb-user-mobile-dtls', mobileInfo, { observe: 'response' });
  }

  setUserLog(accountInfo: any) {
    // accountInfo.id = this.appConfigService.getUserId();

    return this.http.post<any>(ApiService.API_URL + '/' + 'user-log-onlogout', accountInfo, { observe: 'response' });
    // return this.apiService.post('user-log-onlogout', accountInfo,sessionId, { responseType: 'text' as 'text' }).pipe(share());
  }
}
