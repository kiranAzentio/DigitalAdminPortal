import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../api/api.service';
import { filter, map } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AppConfigService } from '../app-configuration/app-config.service';
import { UtilityService } from '../utility/utility.service';

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private router: Router,
    private appconfig: AppConfigService,
    public toastController: ToastController,
    private apiService: ApiService,
    private utilityService: UtilityService
    ) { }


  // https://devdactic.com/push-notifications-ionic-capacitor/               
  // Trigger the push NOTIFICATIONS setup    
  initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    } else {
      console.log("web do not support push notification")
      // this.appconfig.showToast('error', 'Web Platform is not supported for Push Notification')
      // alert("WEB PLATFORM DOESNOT SUPPORT REGISTERING PUSH NOTIFICATION TOKEN");
    }
  }

  private registerPush() {
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        // alert("permission for push granted- now register with android and ios");          
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        alert("Permission for push notifications has not been granted");
        // No permission for push granted
      }
    });

    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        console.log('My token: ' + JSON.stringify(token));
        // alert("Token generated"+JSON.stringify(token));
        // this.appconfig.notificationtoken = token.value;

        // ***IMP CHANGE NOTE - currently set as "notificationTokenId",later change it 
        var notificationToken = null;
        notificationToken = token.value;
        // 

        var requestObj: any = {};
        requestObj.userid = this.appconfig.getLoggedInUserId() + "";
        // requestObj.userid = this.appconfig.userId+"";        
        requestObj.notificationTokenId = notificationToken + "";
        requestObj.languageId = 1 + "";
        requestObj.language = "";
        requestObj.transactionId = this.appconfig.getTRNTimestamp();
        requestObj.channel = this.appconfig.getChannel();
        requestObj.requestedOn = this.appconfig.getDateTime();

        // alert("requestObj.userid "+requestObj.userid);
        // alert("requestObj.notificationTokenId "+requestObj.notificationTokenId);   

        if (this.appconfig.getEncryptDatabool()) {
          // ENCRYPTION MODE
          let newData = this.utilityService.encrypt(requestObj)
          requestObj['encryptedRequest'] = newData;
        } else {
          // NORMAL MODE
          requestObj = requestObj;
          requestObj['encryptedRequest'] = null;
        }

        this.utilityService.showLoader();
        this.apiService.post('notifications/update-notification-token', requestObj).pipe(
          filter((res: HttpResponse<any>) => res.ok),
          map((res: HttpResponse<any>) => res.body)
        )
          .subscribe(
            async (response: any) => {
              console.error("==================================================================");
              console.error("===================================================================");
              console.error("===== PUSH NOTIFICATION TOKEN SAVED IN DATABASE SUCCESSFULLLY=======");
              console.error("===================================================================");
              console.error("===================================================================");
              this.utilityService.hideLoader();
              if (response.hasOwnProperty('result')) {
                this.utilityService.showToast('success', 'Successsfully saved push notification token');
                // alert("succesfully saved token in database")

                var responseData: any;

                if (this.appconfig.getEncryptDatabool()) {
                  // encryption
                  let decryptedData = this.utilityService.decrypt(response.result.encryptedResponse);
                  var fullResponse = JSON.parse(decryptedData);
                  responseData = fullResponse;
                } else {
                  // normal
                  responseData = response.result;
                }
                if (responseData.message == "SUCCESS") {
                  this.appconfig.assignUserDataByKeyVal('notificationTokenId', notificationToken);
                  console.log("responseData data" + JSON.stringify(responseData));
                } else {
                  this.appconfig.assignUserDataByKeyVal('notificationTokenId', null);
                  this.utilityService.showToast('error', 'Error while saving push notification token');
                }
                // console.log("responseData data"+JSON.stringify(responseData));

              } else {
                this.utilityService.showToast('error');
                this.appconfig.assignUserDataByKeyVal('notificationTokenId', null);
              }
            },
            async (error) => {
              console.error("push notification ERROR " + error);
              this.utilityService.showToast('error', 'Error while saving push notification token');
              // ***IMP CHANGE NOTE - currently set as "notificationTokenId",later change it               
              this.appconfig.assignUserDataByKeyVal('notificationTokenId', null)
            });
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
      alert("Push Notifications Registration Error" + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
        // alert("Push notification received: "+JSON.stringify(notification));  
        const toast = await this.toastController.create({
          header: notification.title,
          message: notification.body,
          position: 'top',
          buttons: [
            {
              side: 'start',
              icon: 'star',
              text: 'OK',
              handler: () => {
                console.log('Push notification action performed: ' + JSON.stringify(notification));
                // this.router.navigateByUrl(`/error-screen/${notification.data.detailsId}`);
              }
            }, {
              role: 'cancel',
              text: 'Cancel',
              handler: () => {
                console.log("toast cancelled");
              }
            }
          ]
        });
        toast.present();
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        // alert("Push notification action performed: "+JSON.stringify(notification.notification));         
        const data = notification.notification.data;
        console.log('Push notification Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          //   this.router.navigateByUrl(`/home/${data.detailsId}`);
          //   /tabs/menu/trx/reports
          // this.router.navigateByUrl(`/error-screen/${data.detailsId}`);
        }
      }
    );
  }
}

/* 
ionic - https://devdactic.com/push-notifications-ionic-capacitor/
java = https://springhow.com/spring-boot-firebase-push-notification/
https://github.com/springhow/spring-boot-firebase-demo/blob/master/src/main/java/com/springhow/examples/springbootfcmdemo/SpringBootFcmDemoApplication.java

STEPS TO ADD PUSH NOTIFIATION FOR ANDROID

ionic -build --prod
npx copy add android
go to android folder /app and paste google-services.json file (get this from firebase)
npx copy android
npx sync
*/