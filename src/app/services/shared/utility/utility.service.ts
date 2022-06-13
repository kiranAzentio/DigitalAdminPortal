import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class UtilityService {

  public static API_URL = environment.apiUrl;


  private internalServerErrorMessage = 'Internal Server Error';
  private recordSuccess = 'Record saved successfully';
  private toast_duration: number = 2000;
  private toast_postion: any = "bottom";
  private toast_success_color: string = 'success';
  private toast_error_color: string = 'danger';

  public isLoading: boolean = false;

  loadingMessage: string = 'Loading...'

  private loadCount: number = 0;
  loadState: BehaviorSubject<boolean> = new BehaviorSubject(false);

  userDataKey: string = 'userData';
  userRoleKey: string = 'userRole';
  userNotAuthorizedMsg = "User is not authorized";
  jsonTableSubject: BehaviorSubject<any> = new BehaviorSubject([])

  constructor(
    private toastCtrl: ToastController,
    public http: HttpClient,
    private loadingCtrl: LoadingController,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private router: Router
  ) {
  }
  public getJSON(): Observable<any> {
    return this.http.get('../../../../assets/JsonData/MetaDataJson/kastle/AuditTrail/AuditTrail/customSearchFilter.json');
  }

  setJsonTableData(data){
    this.jsonTableSubject.next(data)
  }

  // LOADER
  async showLoaderOld(message?: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        message: message ? message : this.loadingMessage,
      })
      .then((loader) => {
        loader.present().then(() => {
          if (!this.isLoading) {
            loader.dismiss();
          }
        });
      });
  }

  showLoader() {
    // this.loadCount+=1;
    this.loadState.next(true);
  }

  hideLoader() {
    // this.loadCount = (this.loadCount ? --this.loadCount : 0);
    // if (!this.loadCount) this.loadState.next(false);
    this.loadState.next(false);
  }

  async hideLoaderOld() {
    this.isLoading = false;
    this.loadingCtrl.getTop().then((loader) => {
      if (loader) {
        loader.dismiss();
      }
    });
  }

  closToast() {
    this.toastCtrl.dismiss().catch(() => {
      console.log("close toast error block")
    });
  }
  async showToast(status: string, message?: string, metaObj?: any) {
    let btnsArr = [];
    let duration = null;
    if (metaObj) {
      duration = 10000; // 20000 -> 10 seconds
      btnsArr = [
        {
          side: 'end',
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log("toast closed manually");
          }
        }
      ]
    }
    // this.hideLoader();      
    var defaultMsg = '';
    defaultMsg = status == 'error' ? this.internalServerErrorMessage : this.recordSuccess;
    const toast = await this.toastCtrl.create({
      message: message ? message : defaultMsg,
      duration: duration == null ? this.toast_duration : duration,
      position: this.toast_postion,
      color: status == 'error' ? this.toast_error_color : this.toast_success_color,
      cssClass: 'toastclass',
      buttons: btnsArr
    });
    toast.present();
  }

  encrypt(dataObj) {
    return null;
  }

  decrypt(dataObj) {
    return null;
  }

  convertDateToYMD(date) {
    // alert("date"+date);
    // let day = date.getUTCDate() + 1;
    let day = date.getUTCDate();
    let month = date.getUTCMonth() + 1;
    let year = date.getUTCFullYear();
    // alert("day"+day+"---month---"+month+"----year---"+year);

    if (Number(day) < 10) {
      day = "0" + day;
    }
    if (Number(month) < 10) {
      month = "0" + month;
    }
    return `${year}-${month}-${day}` + "";
  }

  convertYMDToDate(ymdDate) {
    var newDate = new Date();
    var hours = newDate.getHours();
    var minutes = newDate.getMinutes();
    var seconds = newDate.getSeconds();
    var ms = newDate.getMilliseconds();

    var year = parseInt(ymdDate.toString().substring(0, 4));
    var month = parseInt(ymdDate.toString().substring(5, 7)) - 1;
    var day = parseInt(ymdDate.toString().substring(8, 10));

    return new Date(year, month, day, hours, minutes, seconds, ms);


  }


  assignYMDDateForPlatform(ymdDate, platformMobile) {
    if (platformMobile) {
      return ymdDate;
    } else {
      return new Date(ymdDate);
    }
  }

  callPostApiOLd(reqObject, url, errorHandlingObj?) {
    this.showLoader();
    console.log('--------------------REQUEST---------------');
    console.log('--------------------REQUEST---------------');
    console.log('--------------------REQUEST---------------');
    console.log('                                           ');
    console.log('--------------------API URL---------------');
    console.log('                                           ');
    console.log(' ' + ApiService.API_URL + '/' + url);
    console.log('                                           ');
    console.log('--------------------API URL---------------');

    console.log("REQUEST", JSON.stringify(reqObject, null, 2))

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.hideLoader();
        reject({})
      }, 100);

      // this.http.post<any>(ApiService.API_URL + '/' + url, reqObject, { observe: 'response' }).subscribe(res=>{
      //   this.hideLoader();
      //   console.log("response .log", JSON.stringify(res));



      //   resolve(res)
      // },err=>{
      //   this.hideLoader();

      //   let obj = {}
      //   reject(obj)
      // })
    })
  }
  callPostApi(reqObject, url, errorHandlingObj?) {
    this.showLoader();
    console.log('--------------------REQUEST---------------');
    console.log('                                           ');
    console.log('--------------------API URL---------------');
    console.log('                                           ');
    console.log(' ' + ApiService.API_URL + '/' + url);
    console.log('                                           ');


    console.log("REQUEST", JSON.stringify(reqObject, null, 2))
// reqObject should be incripted 

    return new Promise((resolve, reject) => {
      this.http.post<any>(ApiService.API_URL + '/' + url, reqObject, { 
        headers: new HttpHeaders({'transactionId': this.getTRNTimestamp(),
        'hashCode': this.hmac(JSON.stringify(reqObject))}),
        observe: 'response' 
      })
        // .post(url, requestObj)
        // .pipe(
        // filter((res: HttpResponse<any>) => res.ok),
        // filter((res: HttpResponse<any>) => res.status === 200),
        // map((res: HttpResponse<any>) => res.body)
        // )
        .subscribe(
          async (response: any) => {

            // response should be decript 
            
            this.hideLoader();
            console.log('-----RESPONSE-SUCCESS------------');
            console.log('                                  ');
            console.log("---API SUCCESS RESPONSE---", JSON.stringify(response, null, 2));
            console.log('                                  ');
            resolve(response.body)
            // resolve(response)
          },
          async (error) => {
            this.hideLoader();
            console.log('-------RESPONSE-ERROR-----');
            console.log('                                  ');
            console.log('ERROR RESPONSE' + JSON.stringify(error, null, 2));
            console.log('                                  ');
            console.log('ERROR status ' + error.status);
            // console.log('ERROR status stringify ' + JSON.stringify(error.status,null,2));
            switch (error.status) {
              case 400: {
                console.log("400 error block");
                // alert("400 error block");
                if (errorHandlingObj == undefined) {
                  this.showToast('error', 'Internal server error');
                }
                reject(error);
                break;
              }
              case 403: {
                console.log("403 error block");
                // alert("403 error block");
                if (errorHandlingObj == undefined) {
                  this.showToast('error', 'Internal server error');
                }
                reject(error);
                break;
              }
              case 500: {
                console.log("500 error block");
                if (errorHandlingObj == undefined) {
                  this.showToast('error', 'Internal server error');
                }
                // alert("500 error block");
                reject(error);
                break;
              }
              case 419: {
                console.log("419 error block - Authorization token expired");
                this.showToast('error', this.userNotAuthorizedMsg);
                this.storagelogout().subscribe();
                this.router.navigateByUrl('login');
                reject(error);
                break;
              }

              default: {
                if (errorHandlingObj == undefined) {
                  this.showToast('error', 'Internal server error');
                }
                reject(error)
                break;
              }
            }
            // this.showToast('error');
            // reject(error)
          }
        )

    })


  }

  getTRNTimestamp() {
    let date = new Date();
    let timestamp = date.getTime();
    return 'TRN' + timestamp;
    //  return '1';
  }
  getPRNTimestamp() {
    let date = new Date();
    let timestamp = date.getTime();
    return 'PRN' + timestamp;
    //  return '1';
  }

  hmac(data) {
    let key = "secret";
    let jsonObj = data.replace(" ","")
    console.log(jsonObj)    
    var hash = CryptoJS.HmacSHA256(jsonObj, key);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    return hashInBase64;
   }

  async get(endpoint: string, reqParams?: any) {
    this.showLoader();
    return new Promise((resolve, reject) => {

      // params = { userId: '1' }

      let searchParam: any = {};

      if (reqParams) {
        searchParam = reqParams;
        console.log("searchParam--" + searchParam);
      }
      this.http.get(ApiService.API_URL + '/' + endpoint, { params: searchParam })
        .subscribe(
          async (response: any) => {
            this.hideLoader();
            console.log('-----RESPONSE-SUCCESS------------');
            console.log('-----RESPONSE-SUCCESS------------');
            console.log('-----RESPONSE-SUCCESS------------');
            console.log('-----RESPONSE-SUCCESS------------');
            console.log("---API SUCCESS RESPONSE---", JSON.stringify(response, null, 2));
            resolve(response)
            // resolve(response)
          },
          async (error) => {
            this.hideLoader();
            console.log('-------RESPONSE-ERROR-----');
            console.log('-------RESPONSE-ERROR-----');
            console.log('-------RESPONSE-ERROR-----');
            console.log('API ERROR RESPONSE' + JSON.stringify(error, null, 2));
            switch (error.status) {
              case 419: {
                console.log("419 error block - Authorization token expired");
                this.showToast('error', this.userNotAuthorizedMsg);
                this.storagelogout().subscribe();
                this.router.navigateByUrl('login');
                reject(error);
                break;
              }
              default: {
                reject(error);
                break;
              }
            }
          });
    }
    );

  }

  // get json data from assets
  getJsonData(url?: string): Observable<HttpResponse<any[]>> {
    console.log("===========================================");
    console.log("============GET JSON DATA from assets============");
    console.log("===========================================");
    // this.hideLoader();
    return this.http.get<any[]>(`assets/JsonData/${url}.json`, { observe: 'response' });
  }

  getUserAccountData(obj): Observable<any> {
    let url= "account"
    return this.http.post(ApiService.API_URL + '/' + url, obj)
  }

  getFilterScreenData(url?: string){
    this.showLoader();
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(ApiService.API_URL+ '/' + url, { observe: 'response' })
        .subscribe(
          async (response: any) => {
            this.hideLoader();
            console.log('-----RESPONSE-SUCCESS------------');
            console.log("---API SUCCESS RESPONSE---", JSON.stringify(response, null, 2));
            console.log('                                  ');
            //  resolve(response.body);
            setTimeout(() => {
              resolve(response.body);
            }, 100);
            //  setTimeout(resolve, 2000);
            // resolve(response)
          },
          async (error) => {
            this.hideLoader();
            console.log('-------RESPONSE-ERROR-----');
            console.log('                                  ');
            console.log('ERROR RESPONSE' + JSON.stringify(error, null, 2));
            console.log('                                  ');
            console.log('ERROR status ' + error.status);
            reject(error);
            // console.log('ERROR status stringify ' + JSON.stringify(error.status,null,2));
          }
        )

    })
  }

  // get json data from assets
  getJsonDataPROMISE(url?: string) {
    console.log("============ GET JSON DATA from assets from PROMISE ============");
    this.showLoader();
    console.log(' ' + `assets/JsonData/${url}.json`);

    return new Promise((resolve, reject) => {
      this.http.get<any[]>(`assets/JsonData/${url}.json`, { observe: 'response' })
        .subscribe(
          async (response: any) => {
            this.hideLoader();
            console.log('-----RESPONSE-SUCCESS------------');
            console.log("---API SUCCESS RESPONSE---", JSON.stringify(response, null, 2));
            console.log('                                  ');
            //  resolve(response.body);
            setTimeout(() => {
              resolve(response.body);
            }, 100);
            //  setTimeout(resolve, 2000);
            // resolve(response)
          },
          async (error) => {
            this.hideLoader();
            console.log('-------RESPONSE-ERROR-----');
            console.log('                                  ');
            console.log('ERROR RESPONSE' + JSON.stringify(error, null, 2));
            console.log('                                  ');
            console.log('ERROR status ' + error.status);
            reject(error);
            // console.log('ERROR status stringify ' + JSON.stringify(error.status,null,2));
          }
        )

    })

  }

  // camelCase to Senetence case e.g helloThereMister ==> Hello There Mister

  changeCamelCaseToSentence(text) {
    let finalResult = "";
    if (text != null && text != "") {
      let result = text.replace(/([A-Z])/g, " $1");
      finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      console.log("Sentence Case " + finalResult);
    }
    return finalResult;
  }

  storagelogout() {
    return new Observable((observer) => {
      this.localStorage.clear('authenticationToken');
      this.sessionStorage.clear('authenticationToken');
      this.localStorage.clear(this.userDataKey);
      this.sessionStorage.clear(this.userDataKey);
      observer.complete();
    });
  }

  // convert base64 to type
  convertBase64Data(mimeType, base64String) {
    // this.imgPath = `data:image/**;base64,${responseData[0].promimg}`;
    return `data:${mimeType};base64,${base64String}`;
  }

}