import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { UserLogin } from 'src/model/login.model';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';
import { ApiService } from '../../../services/shared/api/api.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { AuthServerProvider } from '../../../services/shared/auth/auth-jwt.service';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { ModalController } from '@ionic/angular';
import { AuthInterceptor } from '../../../interceptors/auth.interceptor';
import * as moment from "moment";
import { Plugins } from '@capacitor/core';
const { Device } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userLogin: UserLogin = null;
  // ip:any = null;
  ip: any = "103.97.98.55";
  newObjforAccount: any;
  constructor(
    private router: Router,
    public appConfig: AppConfigService,
    private utilityservice: UtilityService,
    private navController: NavController,
    private apiService: ApiService,
    private authServerProvider: AuthServerProvider,
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    public modalController: ModalController,
    // public AuthInterceptor :AuthInterceptor
  ) { }

  ngOnInit() {
    console.log('login onInit');
    this.utilityservice.hideLoader();
  }


  loanPurposeDropdownArr: any[] = [];
  showLogin: boolean = false;

  ionViewWillEnter() {
    this.showLogin = false;
    setTimeout(() => {
      console.log('login ionview enter');
      this.showLogin = true;
      this.utilityservice.hideLoader();
      //  this.userLogin = new UserLogin('', '',false);
      this.userLogin = new UserLogin('admin@digitalsystem.com', 'Admin@123', false);
      // this.userLogin = new UserLogin('admin@digitalsystem.com', 'Admin@123', false);

      this.appConfig.logout();
      // check here if user is present in localstorage and navigate accordingly
      // const userDataKey = this.localStorage.retrieve(this.appConfig.getUserDataKey());
      // if(!!userDataKey){
      //   let decryptedData = this.appConfig.decrypt(userDataKey);
      //   let fullResponse = JSON.parse(decryptedData);
      //   this.setUserDataAndRoute(fullResponse)
      //   console.log("localstorage has user data key");
      // }else{
      //   console.log("first time user");
      //   // first time user - get public key
      //   // I&M pending *** - uncomment below
      //   // this.getPublicKey();
      // }    
    }, 100);

  }
  onLogin(data) {
    console.log('on login submit' + JSON.stringify(data));
    this.CallApi(data);
  }

  CallApi(data) {
    // let url = 'validate-userId-password';
    let url = 'login';
    // let url = 'loginone';
    this.utilityservice.closToast();
    // AES encryption
    // let encryptedPassword = this.appConfig.encrypt(data.password);
    // console.log("ARS encrypted password "+encryptedPassword);

    // RES encryption

    // I&M pending*** - RSA

    // if(this.appConfig.pubkey == null || this.appConfig.pubkey == ""){
    //   this.utilityservice.showToast('error','Internal Server Error - Please refresh the page and try again');
    //   return;
    // }
    // let encryptedPassword = this.appConfig.rsa_encrypt(data.password);
    // console.log("RSA encrypted password "+encryptedPassword);

    // let decryptedPassword = this.appConfig.rsa_decrypt(encryptedPassword);
    // console.log("RSA decrypted password "+decryptedPassword);

    //  AES plain
    // let encryptedPassword = null;
    // let decryptedPassword = null;
    // // encryptedPassword = this.appConfig.encryptPlain(data.password);
    // let extendedPassword = data.password+"***"+this.appConfig.getTimeStap()+"***"
    // encryptedPassword = this.appConfig.encryptPlain(extendedPassword);
    // console.log("AES encrypted password "+encryptedPassword);
    // decryptedPassword = this.appConfig.decrypt(encryptedPassword);
    // console.log("AES decrypted password "+decryptedPassword);

    // return;


    // let ldapObj =  {
    //   userName: '',
    //   password: data.password,
    //   // password: encryptedPassword,
    //   channel: this.appConfig.getChannel(),
    //   sessionId:this.appConfig.getTRNTimestamp(),
    //   clientIP: this.ip,
    //   machineName: '',
    //   transactionId: this.appConfig.getTRNTimestamp(),
    //   reqid: 'string',
    //   // loginUserId: data.username.toUpperCase(),
    //   loginUserId: data.username,
    //   loginDateTime: this.appConfig.getDateTime(),
    //   requestedOn: this.appConfig.getDateTime(),
    // };

    data.sessionId = this.appConfig.getTimeStap() + "";

    // let extendedPassword = data.password+"("+this.appConfig.getTimeStap()+")"
    let extendedPassword = data.password;

    let ldapObj = {
      username: data.username,
      password: extendedPassword,
      transactionId: this.utilityservice.getTRNTimestamp()
      // sessionId:data.sessionId // use this for logging out
      // "rememberMe":true,
      // "companyId": null,
      // "language":this.appConfig.getLanguage(),
      // "transactionId":this.appConfig.getTRNTimestamp(),
      // "channel":"2",
      // "requestedOn":moment(new Date()).format('DD-MM-YYYY HH:mm:ss')
    };

    var newObj: any = {};

    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, ldapObj);
      newObj['encryptedRequest'] = newData;
      newObj['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      newObj = ldapObj;
      newObj['encryptedRequest'] = null;
      newObj['randomKey'] = null;
    }

    //   //encrypting data along with randomkey
    //   let newData = this.appConfig.encrypt(this.appConfig.secretKey,ldapObj);
    //   newObj['encryptedRequest'] = newData;
    //   newObj['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    // this.newObjforAccount = newObj;

    this.newObjforAccount = ldapObj // new
    // this.newObjforAccount = newObj; // old

    let errorHandlingObj = {
      returnToParent: true
    };

    // let decryptedData = this.appConfig.decrypt(
    //       this.appConfig.secretKey,
    //       newObj.encryptedRequest
    //     );
    //     let fullResponse = JSON.parse(decryptedData);
    //   console.log("after decrption"+fullResponse);

    this.utilityservice
      .callPostApi(
        newObj,
        url,
        errorHandlingObj
      )
      .then(
        (resp: any) => {
          console.log("before decrption"+resp);

          // decryption logic
          if (this.appConfig.getEncryptDatabool()) {
            let decryptedData = this.appConfig.decrypt(
                  this.appConfig.secretKey,
                  resp.encryptedResponse
                );
                let fullResponse = JSON.parse(decryptedData);
                resp = fullResponse;
          } 

          // decryption logic
          //   let decryptedData = this.appConfig.decrypt(
          //     this.appConfig.secretKey,
          //     resp.encryptedResponse
          //   );
          //   let fullResponse = JSON.parse(decryptedData);
          //   resp = fullResponse;
          // console.log("after decrption"+resp);
          // decryption logic  ends

          if (resp.id_token) {
            this.authServerProvider.storeAuthenticationToken(resp.id_token, true); // SET TOKEN - true means localstorage
            this.getUserAccountData(this.newObjforAccount);
          } else {
            if (resp.title == "Unauthorized" && resp.status == "401") {
              this.utilityservice.showToast('error', 'User not found in the database');

            }else if (resp.title == "Unauthorized" && resp.status == "409") {
              this.utilityservice.showToast('error', 'User is already in active state');

            }
             else if (resp.title == "Internal Server Error" && resp.status == "500") {
              // this.utilityservice.showToast('error', 'INVALID_CREDENTIALS');
              this.utilityservice.showToast('error', 'Please Enter correct username or password');
              // alert("1")
              // this.userLogin = new UserLogin('', '',false);
            }else{
              this.utilityservice.showToast('error', 'User is already logged in from other device.');
            }
          }
        },
        (err) => {
          if (err.error.title == "Unauthorized" && err.error.status == "401") {
            this.utilityservice.showToast('error', 'User not found in the database');
          } 
          else if (err.error.title == "Unauthorized" && err.error.status == "409") {
            this.utilityservice.showToast('error', 'User is already in active state');

          }
          else if (err.error.title == "Internal Server Error" && err.error.status == "500") {
            // this.utilityservice.showToast('error', 'INVALID_CREDENTIALS');
            this.utilityservice.showToast('error', 'Please Enter correct username or password');
            // alert("2" + JSON.stringify(this.userLogin.password))
            // this.userLogin = new UserLogin('', '',false);
          }else{
            this.utilityservice.showToast('error', 'User is already logged in from other device.');
          }
        }
      );
  }

  storeBrowserDetails(resp){
    Device.getInfo().then((val) => {
    let mobileInfo :any = {};
      console.log('device info' + JSON.stringify(val));
      mobileInfo.kdbuserid = +resp.id;
      mobileInfo.appversion = val.appVersion;
      mobileInfo.deviceosversion = val.osVersion;
      // mobileInfo.deviceby = val.manufacturer; // NA in java
      // mobileInfo.devicemodel = val.model; // A in java, but gives error
      mobileInfo.deviceos = val.operatingSystem;
      mobileInfo.deviceid = val.uuid;
      mobileInfo.imeinumber = null;
      mobileInfo.language = this.appConfig.getLanguageId(); // check
      mobileInfo.transactionId = this.appConfig.getTRNTimestamp()
      mobileInfo.channel = "1"
      // mobileInfo.requestedOn = moment(new Date()).format('DD-MM-YYYY HH:mm:ss')

      debugger;
      // call api
      let crudObj :any = {};
      if (this.appConfig.getEncryptDatabool()) {
        let newData = this.appConfig.encrypt(this.appConfig.secretKey, mobileInfo);
        crudObj['encryptedRequest'] = newData;
        crudObj['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
      } else {
        crudObj = mobileInfo;
        crudObj['encryptedRequest'] = null;
        // crudObj['randomKey'] = null;
      }

      let url = "kdb-user-mobile-dtls";
      this.utilityservice.callPostApi(crudObj, url).then((resp: any) => {
          // decryption logic
          // if (this.appConfig.getEncryptDatabool()) {
          //   let decryptedData = this.appConfig.decrypt(
          //         this.appConfig.secretKey,
          //         resp.encryptedResponse
          //       );
          //       let fullResponse = JSON.parse(decryptedData);
          //       resp = fullResponse;
          // } 
  
        if (resp) {
          console.log("resp "+resp);
        }
      }, err => {
        console.log("error in saving browser data " + JSON.stringify(err));
      })
  });

}

  getUserAccountData(newObj) {
    // do enryption here
    let req: any = {};
    // req['encryptedRequest'] = newObj.encryptedRequest;
    req['language'] = 'en_US';
    req['channel'] = '1';
    req['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    req['transactionId'] = this.utilityservice.getTRNTimestamp();
    req['userid'] = newObj.username

    let crudObj :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, req);
      crudObj['encryptedRequest'] = newData;
      crudObj['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj = req;
      crudObj['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }
    

    let url = "account";
    this.utilityservice.callPostApi(crudObj, url).then((resp: any) => {
        // decryption logic
        if (this.appConfig.getEncryptDatabool()) {
          let decryptedData = this.appConfig.decrypt(
                this.appConfig.secretKey,
                resp.encryptedResponse
              );
              let fullResponse = JSON.parse(decryptedData);
              resp = fullResponse;
        } 

      if (resp) {
        this.storeBrowserDetails(resp);
        let res: any = {};
        res.loginDtl = [
          {
            id: resp.id,
            loginId: resp.username,
            userId: resp.userid,
            employeeId: '', // chnge it latre ok - 
            loginDateTime: this.appConfig.getDateTime(),
            sessionId: resp.extra2,
            lastLoginTime: null,
            fullName: resp.firstName + '' + resp.middleName + '' + resp.lastName,
            firstName: resp.firstName,
            middleName: resp.middleName,
            lastName: resp.lastName,
            // check for this also - it is not needed but check -
            branch: [
              { branchCode: '909392', branchName: 'HYDERABAD  Z E COUNTER' },
            ],
          }
        ]
        // alert(res.roleid)
        if (resp.roleid == 1) {
          res.loginDtl[0]['roles'] = [
            { roleCode: 'ADMIN', roleName: 'admin' },
          ]
        } else if (resp.roleid == 2) {
          res.loginDtl[0]['roles'] = [
            { roleCode: 'PROSPECT', roleName: 'prospect' },
          ]
        } else if (resp.roleid == 3) {
          res.loginDtl[0]['roles'] = [
            { roleCode: 'CUSTOMER', roleName: 'customer' },
          ]
        } else if (resp.roleid == 4) {
          res.loginDtl[0]['roles'] = [
            { roleCode: 'SALES', roleName: 'sales' },
          ]
        }

        // alert("res.loginDtl" + JSON.stringify(res.loginDtl[0]))
        this.setUserObject(res.loginDtl[0], newObj);

      }
    }, err => {
      console.log("error in user data " + JSON.stringify(err));
    })

  }


  setUserObject(data, reqData) {
    console.log('login data ' + JSON.stringify(data));
    let appUserObj: any = {};

    // Add variables here, which can be consumed throughout the application
    appUserObj.id = +data.id;
    appUserObj.userId = data.loginId;
    appUserObj.sessionId = data.sessionId;
    appUserObj.userId = data.userId;
    appUserObj.lastlogin = data.lastLoginTime,
    appUserObj.name = data.fullName;
    appUserObj.firstName = data.firstName;
    appUserObj.middleName = data.middleName;
    appUserObj.lastName = data.lastName;
    appUserObj.employeeId = data.employeeId;
    appUserObj.rolesArr = data.roles;
    appUserObj.role = '';
    appUserObj.loginUserId = reqData.username;
    // appUserObj.token = token;
    appUserObj.loginData = data;
    appUserObj.branchCode = '';
    appUserObj.branchName = '';
    if (data.branch != undefined && data.branch != null && data.branch.length > 0) {
      appUserObj.branchCode = data.branch[0].branchCode;
      appUserObj.branchName = data.branch[0].branchName;
    }
    this.setUserDataAndRoute(appUserObj);
  }

  setUserDataAndRoute(userObj) {
    console.log('before routing ' + JSON.stringify(userObj));
    if (userObj.rolesArr != null && userObj.rolesArr.length > 0) {
      let roleSales = false;
      let roleBm = false;
      let roleEnquiry = false;
      let roleAdmin = false;

      userObj.rolesArr.forEach(element => {
        if (element.roleCode == "CC") { // Customer Service
          roleEnquiry = true;
        }
        if (element.roleCode == "BRNMGR") { // Branch Manager
          roleBm = true;
        }
        if (element.roleCode == "SALESTF") { // Sales
          roleSales = true;
        }
        if (element.roleCode == "ADMIN") { // ADMIN
          roleAdmin = true;
        }
      });
      // assign data
      if (roleSales) {
        userObj.role = 'sales';
        this.setAppDataAndToken(userObj);

        this.router.navigateByUrl('/menu/tabs/entities/i-and-m/dashboard');
      } else if (roleBm) {
        userObj.role = 'branchManager';
        this.setAppDataAndToken(userObj);
        this.router.navigateByUrl('/menu/tabs/entities/i-and-m/dashboard');
      } else if (roleEnquiry) {
        userObj.role = 'enquiry';
        this.setAppDataAndToken(userObj);
        this.router.navigateByUrl('/menu/tabs/entities/i-and-m/application-summary');
      } else if (roleAdmin) {
        userObj.role = 'admin';
        this.setAppDataAndToken(userObj);
        this.router.navigateByUrl('/menu/tabs/entities/kastle/dashboard');
      }
      else {
        this.utilityservice.showToast('error', 'No roles found', {});
      }
    } else {
      this.utilityservice.showToast('error', 'No roles found', {});
    }
  }

  setAppDataAndToken(userObj) {
    this.appConfig.assignUserData(userObj);
    this.storeUserDataInStorage(userObj); // store user data in localstorage
    // this.authServerProvider.storeAuthenticationToken(userObj.token, true); // SET TOKEN - true means localstorage
    // this.getUserAccountData(this.newObjforAccount);
  }

  decryptData() {
    let obj = {};
    let decryptedData = this.appConfig.decrypt(this.appConfig.secretKey, obj);//check result varaible****
    var fullResponse = JSON.parse(decryptedData);
  }

  storeUserDataInStorage(userObj) {
    let encyptedData = this.appConfig.encrypt(this.appConfig.secretKey, userObj);
    this.authServerProvider.storeDataInStorage(encyptedData, this.appConfig.getUserDataKey(), true);
  }


  english() {
    // document.getElementsByTagName('html')[0].setAttribute('dir', true ? 'rtl' : 'ltr');
    document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
  }

  arabic() {
    document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
  }

  

}
