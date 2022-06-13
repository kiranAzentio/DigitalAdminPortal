import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { UtilityService } from '../../../services/shared/utility/utility.service';
import { NavController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import JSEncrypt from 'node_modules/jsencrypt/lib';
import * as moment from "moment";
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';


const { Storage } = Plugins;


@Injectable({
  providedIn: 'root',
})
export class AppConfigService {

  public engish_lang="en-US";
  public arabic_lang ="ar-AR";
  public hindi_lang ="hi-IN";

  public engish_lang_meta="engish_lang";
  public arabic_lang_meta ="arabic_lang";
  public hindi_lang_meta ="hindi_lang";

  public userObj: any = null;
  private userLoggedIn = new Subject<boolean>();
  private userId: number = null;
  private roleId: number = 1;
  private language = "";
  private languageId = 1;
  // private language = null;
  private failMessageIdentifier: string = 'failMessage';
  private platform: string = '';
  private platformMobile: boolean = false;
  private domCurrencyLabel = 'KES';
  private currencyPipeLimit = '0.0-10';
  private currencyPipeDisplay = 'symbol';
  // regex 8 instead of both 10
  public customNumericWithDecimal = /^[-+]?[0-9]{0,10}(\.)?([0-9]{1,10})?$/;
  public emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // DATE
  // private dateTypeFormat: string = 'mediumDate';
  private dateTypeFormat: string = 'dd/MM/yyyy HH:MM:SS a' 
  private dateDisplayFormat: string = 'DD/MM/YYYY'; //mobile calendar
  private dateDisplaySmallFormat: string = 'dd/mm/yy'; //desktop calendar
  private apiDateFormat:string = 'YYYY-MM-DD';
  private dateDisplayMonthDay: string = 'MMM d';
  private timeFormat: string = 'HH:mm:ss';
  private titleText: string = '';
  private titleBackUrl: string = '';
  private showTitleImage: boolean = false;
  public showMenu: boolean = true;
  public showTitleBackButton: boolean = false;

  private currencyInfo = [];

  // inputstyle
  labelPosition = "floating";
  // public labelPosition="stacked";

  // testing failure conditions
  showSelectProductScreenDuplicateError: boolean = false;
  showLoanScreenPrelimError: boolean = false;
  showAdditionalScreeneligibilityError: boolean = false;
  showDocumentsScreenApplicationPending: boolean = false;

  private channel :any = '03';
  private dateTime :any = null;

  // TESTING MODE -
  public testingMode:boolean = false;

  
  /////encryption
  private _keySize;
  public _ivSize;
  private encryptDatabool: boolean = false;
  // private secretKey: string = 'secret'
  public _iterationCount;

  journeyData:any = {};

maxFileSize:number = 2; // in MB
minFileSize:number = 1; // in MB

// pvtkey =
// 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDAyuhyslEYBWVCx1poYj6rhMi8VYU1Fw0KVfea1wrXnBhgRWi+iIaqi3IeuW91jgD0oRr/Ww/JAF3YVi4B2o6UzP0pX3AL1/0r24V1H/ui++J9IuxpWvlceqp0eQ9YyBKXnV1QvFop9PxMuI4BGXkGRru6dx0wa643GlEBUNpxuFJ0H+RT+ndiIAkUA8tT5b7TWMS/RKwFXLh453FF/Snb4lknyWU7q5bvHBep2gFC+VAq8RQzMEYB8rIfNJ1yD9XQQfXTAZJrIYVW8tWtl++c9Citv8fRI8M+yepzypsOp9yDqGvfOe0XlnjXKXAqyQxnBZDZdI47+rvgUnMvOSJjAgMBAAECggEAPC6bBULYwbDdfU0R0cfpXE1lBDWGEZ6SeYmAc5txTQDzMwo3ulKQByjkhObJ/l5HuhWYgeIBOXOd1+x/DCEXpSegV4vtRCU2aLxsGrXTLXuHphyCxBicAtxf3V/1BHfgJef/uzYwxywsnh52Za139Becfoa0W+shRR437zs4FYszpVX4p6b1gyVziPvYNWUWBOPeJyGXu07m72VyS0ZNSAPX0rcKwrZcUd7vyL/ou+IDc3i6VEiD0a2Kml4cfm11KNL/oTagO7hgvPUP5miob6fQially5/Ems1jiPQE0dx37r+gryZEaMcwlgZnaA3hp7YbM4YljnnYkWX/zeCr0QKBgQDjTfNkEnCxFiOC93+3ILIFNZmCteHvwbHVY56C0yUzx007yL019qoi0qRgMgiSmjT0QUAn39NdgpM6n8tuPpgrvVFLpReK005yQN4V3iFd9CujonPTXzBWBAxjxqBCEBUthyaIbHs8SHm8dMbD4wsbHgTFbGgaEshkrJptWISI3QKBgQDZIZlEmLyW8dPYvqXZq/DJFUbj/4c9JDnQAkjioHw0qy4hkZ24+HWdjYX8fwEwpS3H1dFJEAewvDilhfV/1Ldc6Z5lTX6yPz8o8WtOeGM81trJcvvgKRpkAy5EmeZ6QbQ43ofaGnz5v9NqQYND3MLNJsTxpYrgRO8UkJyNotgEPwKBgFq9/MNfhTN85hJbodXGrKrdufnviFIBnm/UxCvwBPMFxnRub/LCFSuvscVhVADKpQc5oVYJycST4xjNQBYz0OXtPy4Wqy5VqwR7lu1d7y4l0uIRcXHZl19PYG7YlZOp/fpd8OkXfZ8UQ90TNWJwGjfqJPd3jpuSEgP2z/OFGevVAoGAbyGyN5jRFZTKb+oMKt/FCrZYJUPY7SNIb71rnoqzZ6Who87K4ixQzoXr6PL8IfC5AMngJzwMI5oCiD2LDJVMEEMGLiU+zm5unj8KRAx8BlyVeHvgjLec6UlzeesnOrW8T0seTzQ1eQKEa6MCU05/ac8JCAFJlkXR9D2b0yZg17MCgYAWooe01h4i2V1a4smGVBO8she1tnT1j/39HltzSlZMGtsWdr3udu7YT3rxn1AZmmJ3eVJYp0Nbadu1GooUQ9Y6KvgG1XaeFD+WUJdirV6oj/gkLPFif43Kp9LHaK71h0ToXmPHbF3WsYxSJCPNjNc7rAe64gi9kQUPiZoscIuhRA==';

// pubkey =
// 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwMrocrJRGAVlQsdaaGI+q4TIvFWFNRcNClX3mtcK15wYYEVovoiGqotyHrlvdY4A9KEa/1sPyQBd2FYuAdqOlMz9KV9wC9f9K9uFdR/7ovvifSLsaVr5XHqqdHkPWMgSl51dULxaKfT8TLiOARl5Bka7uncdMGuuNxpRAVDacbhSdB/kU/p3YiAJFAPLU+W+01jEv0SsBVy4eOdxRf0p2+JZJ8llO6uW7xwXqdoBQvlQKvEUMzBGAfKyHzSdcg/V0EH10wGSayGFVvLVrZfvnPQorb/H0SPDPsnqc8qbDqfcg6hr3zntF5Z41ylwKskMZwWQ2XSOO/q74FJzLzkiYwIDAQAB';
//     // ROLES

pvtkey = 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDAyuhyslEYBWVCx1poYj6rhMi8VYU1Fw0KVfea1wrXnBhgRWi+iIaqi3IeuW91jgD0oRr/Ww/JAF3YVi4B2o6UzP0pX3AL1/0r24V1H/ui++J9IuxpWvlceqp0eQ9YyBKXnV1QvFop9PxMuI4BGXkGRru6dx0wa643GlEBUNpxuFJ0H+RT+ndiIAkUA8tT5b7TWMS/RKwFXLh453FF/Snb4lknyWU7q5bvHBep2gFC+VAq8RQzMEYB8rIfNJ1yD9XQQfXTAZJrIYVW8tWtl++c9Citv8fRI8M+yepzypsOp9yDqGvfOe0XlnjXKXAqyQxnBZDZdI47+rvgUnMvOSJjAgMBAAECggEAPC6bBULYwbDdfU0R0cfpXE1lBDWGEZ6SeYmAc5txTQDzMwo3ulKQByjkhObJ/l5HuhWYgeIBOXOd1+x/DCEXpSegV4vtRCU2aLxsGrXTLXuHphyCxBicAtxf3V/1BHfgJef/uzYwxywsnh52Za139Becfoa0W+shRR437zs4FYszpVX4p6b1gyVziPvYNWUWBOPeJyGXu07m72VyS0ZNSAPX0rcKwrZcUd7vyL/ou+IDc3i6VEiD0a2Kml4cfm11KNL/oTagO7hgvPUP5miob6fQially5/Ems1jiPQE0dx37r+gryZEaMcwlgZnaA3hp7YbM4YljnnYkWX/zeCr0QKBgQDjTfNkEnCxFiOC93+3ILIFNZmCteHvwbHVY56C0yUzx007yL019qoi0qRgMgiSmjT0QUAn39NdgpM6n8tuPpgrvVFLpReK005yQN4V3iFd9CujonPTXzBWBAxjxqBCEBUthyaIbHs8SHm8dMbD4wsbHgTFbGgaEshkrJptWISI3QKBgQDZIZlEmLyW8dPYvqXZq/DJFUbj/4c9JDnQAkjioHw0qy4hkZ24+HWdjYX8fwEwpS3H1dFJEAewvDilhfV/1Ldc6Z5lTX6yPz8o8WtOeGM81trJcvvgKRpkAy5EmeZ6QbQ43ofaGnz5v9NqQYND3MLNJsTxpYrgRO8UkJyNotgEPwKBgFq9/MNfhTN85hJbodXGrKrdufnviFIBnm/UxCvwBPMFxnRub/LCFSuvscVhVADKpQc5oVYJycST4xjNQBYz0OXtPy4Wqy5VqwR7lu1d7y4l0uIRcXHZl19PYG7YlZOp/fpd8OkXfZ8UQ90TNWJwGjfqJPd3jpuSEgP2z/OFGevVAoGAbyGyN5jRFZTKb+oMKt/FCrZYJUPY7SNIb71rnoqzZ6Who87K4ixQzoXr6PL8IfC5AMngJzwMI5oCiD2LDJVMEEMGLiU+zm5unj8KRAx8BlyVeHvgjLec6UlzeesnOrW8T0seTzQ1eQKEa6MCU05/ac8JCAFJlkXR9D2b0yZg17MCgYAWooe01h4i2V1a4smGVBO8she1tnT1j/39HltzSlZMGtsWdr3udu7YT3rxn1AZmmJ3eVJYp0Nbadu1GooUQ9Y6KvgG1XaeFD+WUJdirV6oj/gkLPFif43Kp9LHaK71h0ToXmPHbF3WsYxSJCPNjNc7rAe64gi9kQUPiZoscIuhRA==';
pubkey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwMrocrJRGAVlQsdaaGI+q4TIvFWFNRcNClX3mtcK15wYYEVovoiGqotyHrlvdY4A9KEa/1sPyQBd2FYuAdqOlMz9KV9wC9f9K9uFdR/7ovvifSLsaVr5XHqqdHkPWMgSl51dULxaKfT8TLiOARl5Bka7uncdMGuuNxpRAVDacbhSdB/kU/p3YiAJFAPLU+W+01jEv0SsBVy4eOdxRf0p2+JZJ8llO6uW7xwXqdoBQvlQKvEUMzBGAfKyHzSdcg/V0EH10wGSayGFVvLVrZfvnPQorb/H0SPDPsnqc8qbDqfcg6hr3zntF5Z41ylwKskMZwWQ2XSOO/q74FJzLzkiYwIDAQAB';

public secretKey = 'secretazentio'; //

private isAdminUser :boolean = false;
private isSalesUser :boolean = false;
private isBranchManagerUser :boolean = false;
private isEnquiryUser :boolean = false;

public setTimer:1000;


private productType :string = "01" //Product Type - 01 *(by default) - Loan, 02 - Deposit

private approveMatch:string = "ACCEPT" //"APPROVE";
private referMatch:string = "REFER";
private declineMatch:string = "DECLINED"; // I&M pending

private saveAndNextLabel:string = "SAVE & NEXT";
private nextLabel:string = "NEXT";


private userDataKey:string = 'userData';
private userRoleKey:string = 'userRole';

private userNotAuthorizedMsg = "User is not authorized";

private inactivityTimerSeconds:number = 300;//300 ==>  5 minutes


  constructor(
    private utilityService: UtilityService,
    private navController: NavController,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private router:Router
  ) {
    this.language =  this.hindi_lang;
    this._keySize = 256;
    this._ivSize = 128;
    this._iterationCount = 1989;
    
    //currency info
    this.currencyInfo = [
      { id: 1, code: 'USD', decimalsLimit: 2 },
      { id: 2, code: 'AED', decimalsLimit: 2 },
      { id: 3, code: 'GBP', decimalsLimit: 3 },
      { id: 4, code: 'EUR', decimalsLimit: 3 },
      { id: 5, code: 'INR', decimalsLimit: 3 },
      { id: 6, code: 'KES', decimalsLimit: 0 },

    ]
  }

  getInactivityTimerSeconds(){
    return this.inactivityTimerSeconds;
  }

  getApiDateFormat(){
    return this.apiDateFormat;
  }

  getLanguageId(){
    return this.languageId;
  }

  getUserNotAuthMsg(){
    return this.userNotAuthorizedMsg;
  }
  getUserDataKey(){
    return this.userDataKey;
  }
  
  getUserRoleKey(){
    return this.userRoleKey;
  }

  getMaxFileSize(){
    return this.maxFileSize;
  }

  getMinFileSize(){
    return this.minFileSize;
  }

  getSaveAndNextLabel(){
    return this.saveAndNextLabel;
  }

  getNextLabel(){
    return this.nextLabel;
  }
getApproveMatch(){
  return this.approveMatch;
}
getReferMatch(){
  return this.referMatch;
}
getDeclineMatch(){
  return this.declineMatch;
}
  getProductType(){
    return this.productType;
  }

  getIsAdminUser(){
    return this.isAdminUser;
  }

  setIsAdminUser(bool){
    this.isAdminUser = bool;
  }

getIsSalesUser(){
  return this.isSalesUser;
}


setIsSalesUser(bool){
  this.isSalesUser = bool;
}

setIsBranchManager(bool){
  this.isBranchManagerUser = bool;
}

setIsEnquiry(bool){
  this.isEnquiryUser = bool;
}

resetRoles(){
  this.isSalesUser = false;
  this.isBranchManagerUser = false;
  this.isEnquiryUser = false;
  this.isAdminUser = false;
}

getIsBranchManager(){
  return this.isBranchManagerUser;
}

getIsEnquiryUser(){
  return this.isEnquiryUser;
}

  getTitletext() {
    return this.titleText;
  }

  // SHOW TITLE IMAGE
  assignShowTitleImage() {
    console.log('<<<<< SHOW TITLE IMAGE >>>>');
    this.showTitleImage = true;
    this.titleText = '';
    this.titleBackUrl = '';
    this.assignHideTitleBackButton();
  }

  assignCompanyTitle() {
    this.titleText = 'COMPANY_TITLE';
    this.titleBackUrl = '';
    this.assignHideTitleBackButton();
    this.showMenuBar();
  }

  assignOnlyTitle(title) {
    this.titleText = title;
    this.titleBackUrl = '';
    this.assignHideTitleBackButton();
    this.showMenuBar();
  }

  // show menu
  showMenuBar() {
    this.showMenu = true;
  }
  // hide meu
  hideMenuBar() {
    this.showMenu = false;
  }

  getMenuBarBool() {
    return this.showMenu;
  }

  getShowTitleBackButton() {
    return this.showTitleBackButton;
  }

  // HIDE TITLE IMAGE AND SHOW TEXT WITH BACK BUTTON
  assignHideTitleImageWithTextUrl(titleText: string, titleBackUrl: string) {
    console.log('<<<<< HIDE TITLE IMAGE and SHOW TITLE with  BACK BUTTON >>>>');
    this.showTitleImage = false;
    this.titleText = titleText;
    this.titleBackUrl = titleBackUrl;
    this.assignShowTitleBackButton();
    this.hideMenuBar();
  }

  assignHideTitleBackButton() {
    this.showTitleBackButton = false;
  }

  assignShowTitleBackButton() {
    this.showTitleBackButton = true;
  }

  titleBackRoute() {
    if (this.titleBackUrl == null || this.titleBackUrl == '') {
      window.history.back();
    } else {
      console.log('<<<< navigating back to this.titleBackUrl');
      // this.router.navigateByUrl(this.titleBackUrl);
      this.navController.navigateBack(this.titleBackUrl);
    }
  }

  getDateTypeFormat() {
    // this.ConvertedselectedFromDate = moment(selectedFromDate).format('DD/MM/YYYY');
    // return moment(this.dateTypeFormat).format('DD/MM/YYYY');
    return this.dateTypeFormat;
  }
  getDateDisplayFormat() {
    return this.dateDisplayFormat
  }
  getDateDisplaySmallFormat() {
    return this.dateDisplaySmallFormat;
  }
  getdateDisplayMonthDay() {
    return this.dateDisplayMonthDay;
  }
  getTimeFormat() {
    return this.timeFormat;
  }

  getCurrencyPipeLimit() {
    return this.currencyPipeLimit;
  }
  getDomesticCurrencyLabel() {
    return this.domCurrencyLabel;
  }

  getCurrencyPipeDisplay() {
    return this.currencyPipeDisplay;
  }

  setPlatform(platform) {
    this.platform = platform
  }

  getPlatform() {
    return this.platform;
  }

  setPlatformMobile(platformMobile) {
    this.platformMobile = platformMobile;

  }

  getPlatformMobile() {
    return this.platformMobile;
  }

  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  getLoggedInUserId() {
    return this.userId;
  }

  setLoggedInUserId(id) {
    this.userId = id;
  }

  //ASSIGN USER OBJECT
  assignUserData(data) {
    this.userObj = {};
    this.userObj = data;
  }

  //CLEAR USER OBJECT
  clearUserData() {
    this.userObj = {};
  }

  // GET USER DATA
  getUserData() {
    return this.userObj;
  }

  // ASSIGN UER DATA BY KEY,VALUE
  assignUserDataByKeyVal(key, value) {
    this.userObj[key] = value;
  }

  public async getUserId(key) {
    return await Storage.get({ key })
      .then((data) => {
        let decryptedUserId = this.utilityService.decrypt(data.value);
        let toReturnDecryptUserId = decryptedUserId.replace(/['"]+/g, '');
        return toReturnDecryptUserId;
      })
      .catch((error) => {
        return error;
      });
  }

  getEncryptDatabool() {
    return this.encryptDatabool;
  }

  getSecret() {
    return this.secretKey;
  }

  getRoleId() {
    return this.roleId;
  }

  getFailMessageIdentifier() {
    return this.failMessageIdentifier;
  }

  getFailMessage(dataObj: any) {
    return dataObj[this.failMessageIdentifier];
  }

  getLanguage() {

    return this.language;
  }

  setLanguage(language){
    this.language = language;
  }
  getTRNTimestamp() {
    let date = new Date();
    let timestamp = date.getTime();
    return 'TRN' + timestamp;
    //  return '1';
  }

  // getTRNTimestamp() {
  //   // let date = new Date();
  //   // let timestamp = date.getTime();
  //   // return timestamp+"";
  //   let fivedigNum = Math.floor(Math.random()*90000) + 10000;
  //   return fivedigNum+"";
  // }

  getTimeStap(){
     let date = new Date();
    let timestamp = date.getTime();
    return timestamp+"";
  }

  getChannel() {
    return this.channel;
  }
// remove
  getDateRemove() {
    let date = new Date();
    let day = date.getUTCDate();
    let month = date.getUTCMonth() + 1;
    let year = date.getUTCFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    let d1 = day.toString();
    let m1 = month.toString();
    let h1 = hours.toString();
    let min1 = minutes.toString();
    let s1 = seconds.toString();
    if (day < 10) {
      d1 = '0' + day;
    }
    if (month < 10) {
      m1 = '0' + month;
    }
    if (hours < 10) {
      h1 = '0' + hours;
    }
    if (minutes < 10) {
      min1 = '0' + minutes;
    }
    if (seconds < 10) {
      s1 = '0' + seconds;
    }
    return `${d1}-${m1}-${year}` + ' ' + `${h1}:${min1}:${s1}`;
  }

  // TOFIXED  according to currency selected
  valueToFixedOnCurrency(value, currencycode?) {

    var currcode = this.domCurrencyLabel;
    if (currencycode) {
      currcode = currencycode;
    }
    var newValue = null;

    if (value == undefined || value == null || value == "") {
      return null;
    }

    if (this.currencyInfo.length > 0) {

      this.currencyInfo.forEach(element => {
        if (element.code == currcode) {
          newValue = Number(value).toFixed(element.decimalsLimit)
          return;
        }
      });
    } else {
      alert("no currency data present in appConfig");
      return null;
    }
    return newValue;
  }

  generateKey_NA(salt, passPhrase) {
    return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      keySize: this._keySize / 32,
      iterations: this._iterationCount,
    });
  }

  encryptWithIvSalt_NA(salt, iv, passPhrase, plainText) {
    let key = this.generateKey(salt, passPhrase);
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(plainText), key, { iv: CryptoJS.enc.Hex.parse(iv) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  // for plain texts
  encryptWithIvSaltPlain(salt, iv, passPhrase, plainText) {
    let key = this.generateKey(salt, passPhrase);
    let encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: CryptoJS.enc.Hex.parse(iv) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }
  
  encryptPlain(plainText) {
    let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
    let salt = CryptoJS.lib.WordArray.random(this._keySize / 8).toString(CryptoJS.enc.Hex);
    let cipherText = this.encryptWithIvSaltPlain(salt, iv, this.secretKey, plainText);
    return salt + iv + cipherText;
  }

  decryptWithIvSalt_NA(salt, iv, passPhrase, cipherText) {
    let key = this.generateKey(salt, passPhrase);
    let cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText),
    });
    let decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: CryptoJS.enc.Hex.parse(iv) });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  encrypt_NA(plainText) {
    let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
    let salt = CryptoJS.lib.WordArray.random(this._keySize / 8).toString(CryptoJS.enc.Hex);
    let cipherText = this.encryptWithIvSalt(salt, iv, this.secretKey, plainText);
    return salt + iv + cipherText;
  }

  decrypt_NA(cipherText) {
    let ivLength = this._ivSize / 4;
    let saltLength = this._keySize / 4;
    let salt = cipherText.substr(0, saltLength);
    let iv = cipherText.substr(saltLength, ivLength);
    let encrypted = cipherText.substring(ivLength + saltLength);
    let decrypted = this.decryptWithIvSalt(salt, iv, this.secretKey, encrypted);
    return decrypted;
  }

  rsa_encrypt_NA(datatoEncrypt) {
    console.log('DATA TO ENCRYPT ==> ' + datatoEncrypt);
    let encrypt = new JSEncrypt({});
    encrypt.setPublicKey(this.pubkey);
    // var encrypted = encrypt.encrypt("this is normal text");
    let encrypted = encrypt.encrypt(datatoEncrypt);
    console.log('DATA ENCRYPTED ==> ' + encrypted);
    return encrypted;
  }

  rsa_decrypt_NA(encrypted) {
    // Decrypt with the private key...
    var decrypt = new JSEncrypt({});
    decrypt.setPrivateKey(this.pvtkey);
    var uncrypted = decrypt.decrypt(encrypted.toString());
    console.log(encrypted, uncrypted);
    return uncrypted;
  }

  getDate(){
   let currDate = moment().format('DD/MM/YYYY');
return currDate;
  }
  getDateTime(){
  //  let currentTime: string = moment().format('DD/MM/YYYY hh:mm:ss');
   let currentTime = "2021-06-05T14:51:02.153Z";
  // yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
  //  let currentTime: string = moment().format('YYYY/MM/DD hh:mm:ss');
  //  let currentTime: string = moment().format('YYYY/MM/DD hh:mm:ss');

  //  console.log("utc hh mm ss "+moment().format('YYYY/MM/DD hh:mm:ss'));
  //  console.log("utc hh mm ss TZ "+moment().format('YYYY/MM/DD T hh:mm:ss Z'));
  //  console.log("utc hh mm ss TZZZ "+moment().format('YYYY-MM-DDThh:mm:ssZ'));
  //  console.log("utc hh mm ss TZZZ "+moment().format('YYYY-MM-DDThh:mm:ssZZ'));

// moment.utc().format();
// moment().parseZone().utc(true).format();
// console.log("------------A-----------"+moment.utc().format());
// console.log("-------------AA----------"+moment().parseZone().utc(true).format());

    return currentTime;
  }

  logout(){
    // clear stuff here
    this.resetRoles();
    this.clearJourneyData();
    this.clearUserData();
  }

  setInitialJourneyData(){
    this.journeyData = {};
    this.journeyData = {
      createApplicationFlow:false,
      inboxFlow:false,
      inboxFlowFirstTime:false,
      createApplicationPage: {
        createApplicationData:null,
        previousPageRoute:null,
        appRefId:null
      },
      selectProductPage:{
        selectProductData:null,
        isFormSubmitted:false,
        previousPageRoute:null,
        initStratergyChecked:false,
      },
      loanDataPage:{
        loanData:null,
        isFormSubmitted:false,
        previousPageRoute:null,
        firsTimeEmiCalculated:false,
        isEmiCalculated:false,
        makeBackJourneyApiCall:false
      },
      additionalDataPage:{
        additionalData:null,
        isFormSubmitted:false,
        previousPageRoute:null,
        showSupplemnetaryBool:false,
        productIsCreditCard:false,
        applicationSubmitted:false,
        applicationStatus:null
      },
      documentsDataPage:{
        documentsData:null,
        isFormSubmitted:false,
        previousPageRoute:null,
        documentSubmitted:false
      },
      finalOfferDataPage:{
        finalOfferData:null,
        previousPageRoute:null
      }
    }
  }

  setJourneyData(keyName,dataToAssign){
    this.journeyData[keyName] = dataToAssign;
  }

  setInnerJourneyData(keyName,innerKeyName,dataToAssign){
    this.journeyData[keyName][innerKeyName] = dataToAssign;
  }

  getJourneyData(keyName){
    return this.journeyData[keyName];
  }
  getInnerJourneyData(keyName,innerKeyName){
    return this.journeyData[keyName][innerKeyName];
  }

  checkJourneyFirstTimeMode(keyName,innerKeyName){
    if(this.journeyData[keyName][innerKeyName] == null){
      return true;
    }else{
      return false;
    }
  }

  checkJourneyIsTrueMode(keyName,innerKeyName){
    if(this.journeyData[keyName][innerKeyName]){
      return true;
    }else{
      return false;
    }
  }

  clearJourneyData(){
    this.journeyData = null;
  }
  
  reloadSetAppConfig(){
    if(this.userObj == null || Object.keys(this.userObj).length == 0){
      const userDataKey = this.localStorage.retrieve(this.getUserDataKey());
      if(!!userDataKey){
        let decryptedData = this.decrypt(this.secretKey,userDataKey);
        let fullResponse = JSON.parse(decryptedData);
        this.assignUserData(fullResponse);
        console.log("localstorage has user data key");
        // this.assignMenuByRoles();
      }else{
     this.utilityService.showToast('error', this.getUserNotAuthMsg());

    //  alert('User is not authorized');
        console.log("localstorage  does not have user data key - do logout");
        this.logout();
        this.storagelogout().subscribe();
        this.router.navigateByUrl('login');
      }
    }
    
  }
  

  storagelogout(){
    return new Observable((observer) => {
      this.localStorage.clear('authenticationToken');
      this.sessionStorage.clear('authenticationToken');
      this.localStorage.clear(this.userDataKey);
      this.sessionStorage.clear(this.userDataKey);
      observer.complete();
    });
  }
  
  rsa_encrypt(datatoEncrypt) {

    let encrypt = new JSEncrypt({});

    encrypt.setPublicKey(this.pubkey);

    // var encrypted = encrypt.encrypt("this is normal text");

    let encrypted = encrypt.encrypt(datatoEncrypt);

    return encrypted;

  }



  rsa_decrypt(encrypted) {

    // Decrypt with the private key...

    var decrypt = new JSEncrypt({});

    decrypt.setPrivateKey(this.pvtkey);

    var uncrypted = decrypt.decrypt(encrypted.toString());

    return uncrypted;

  }

  encrypt(passPhrase, plainText) {
    let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(
      CryptoJS.enc.Hex
    );
    let salt = CryptoJS.lib.WordArray.random(this._keySize / 8).toString(
      CryptoJS.enc.Hex
    );
    let cipherText = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
    return salt + iv + cipherText;
  }



  decrypt(passPhrase, cipherText) {
    let ivLength = this._ivSize / 4;
    let saltLength = this._keySize / 4;
    let salt = cipherText.substr(0, saltLength);
    let iv = cipherText.substr(saltLength, ivLength);
    let encrypted = cipherText.substring(ivLength + saltLength);
    let decrypted = this.decryptWithIvSalt(salt, iv, passPhrase, encrypted);
    return decrypted;
  }

  encryptWithIvSalt(salt, iv, passPhrase, plainText) {
    let key = this.generateKey(salt, passPhrase);
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(plainText), key, {
      iv: CryptoJS.enc.Hex.parse(iv),
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  decryptWithIvSalt(salt, iv, passPhrase, cipherText) {
    let key = this.generateKey(salt, passPhrase);
    let cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText),
    });
    let decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  generateKey(salt, passPhrase) {
    return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      keySize: this._keySize / 32,
      iterations: this._iterationCount,
    });
  }
}

