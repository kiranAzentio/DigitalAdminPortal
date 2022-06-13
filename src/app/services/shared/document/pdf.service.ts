import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { AppConfigService } from '../app-configuration/app-config.service';
import { UtilityService } from '../utility/utility.service';
const { Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(
    private platform: Platform,
    private apiService: ApiService,
    private appConfig: AppConfigService,
    private fileOpener: FileOpener,
    private document: DocumentViewer,
    private file: File,
    private utilityService: UtilityService
  ) {}

  getPdf(postEndpoint: any, object?: any) {
    var responseObj: any = null;

    // var docObj = {
    //   doccode: 'SCHCHG',
    //   languageId: 1,
    //   companyId: 1,
    //   transactionId: '1',
    //   channel: '1',
    //   reuqestedOn: '09-02-2021',
    // };

    var docObj = object;

    var requestObj: any = {};

    if (this.appConfig.getEncryptDatabool()) {
      // ENCRYPTION MODE
      let newData = this.utilityService.encrypt(docObj);
      requestObj['encryptedRequest'] = newData;
    } else {
      // NORMAL MODE
      requestObj = docObj;
      requestObj['encryptedRequest'] = null;
    }

    this.utilityService.showLoader();
    this.apiService
      // .post('customers/uploadDocuments', requestObj)
      .post(postEndpoint, requestObj)
      .pipe(
        filter((res: HttpResponse<any>) => res.ok),
        map((res: HttpResponse<any>) => res.body)
      )
      .subscribe(
        async (response: any) => {
          this.utilityService.hideLoader();
          if (response.hasOwnProperty('result')) {
            if (this.appConfig.getEncryptDatabool()) {
              // encryption
              let decryptedData = this.utilityService.decrypt(response.result.encryptedResponse);
              responseObj = JSON.parse(decryptedData);
            } else {
              // normal
              responseObj = response.result;
            }
            console.log('yakeen id confirmation responseObj data' + JSON.stringify(responseObj));
            if (responseObj.message == 'SUCCESS') {
              if (responseObj.documentList != null && responseObj.documentList.length > 0) {
                // responseObj.documentList[0].document; // document, // docname, // documnetmime
                const mimeType = 'application/pdf';
                const name = 'file-sample.pdf';
                // this.downloadToDevice(responseObj.documentList[0].document, mimeType, name);
                let options: DocumentViewerOptions = {
                  title: 'Document',
                };
                let base64String = `data:${mimeType};base64,${responseObj.documentList[0].document}`;
                try {
                  // alert('Opening PDF ...');
                  this.openPdf(responseObj.documentList[0].document, responseObj.documentList[0].docname);
                  // this.document.viewDocument(base64String, 'application/pdf', options);
                } catch {
                  alert('Something went wrong!');
                }
              }
            } else if (responseObj.message == 'FAIL') {
              this.utilityService.showToast('error', responseObj[this.appConfig.getFailMessageIdentifier()]);
            } else if (responseObj.message == 'EXCEPTION') {
              this.utilityService.showToast('error', responseObj[this.appConfig.getFailMessageIdentifier()]);
            }
          } else {
            this.utilityService.showToast('error');
          }
        },
        async (error) => {
          this.utilityService.hideLoader();
          console.error('YAKEEN confirmation error' + error);
          this.utilityService.showToast('error');
        }
      );
  }

  async openPdf(pdf: string, filename: string,mimetype?:string) {
    var fullMimeTypeName = null;
    var shortMimeTypeName = null;
    if(mimetype == undefined){
      fullMimeTypeName = 'data:application/pdf;base64';
      shortMimeTypeName = 'application/pdf';
    }else{
      fullMimeTypeName = `data:${mimetype};base64`;
      shortMimeTypeName = mimetype;
    }
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    this.file
      // .writeFile(writeDirectory, filename, this.convertBase64ToBlob(pdf, 'data:application/pdf;base64'), { replace: true })
      .writeFile(writeDirectory, filename, this.convertBase64ToBlob(pdf, fullMimeTypeName), { replace: true })
      .then((res) => {
        console.log('Inside file OPEN PDF');

        // this.fileOpener.open(writeDirectory + filename, 'application/pdf').catch(() => {
        this.fileOpener.open(writeDirectory + filename, shortMimeTypeName).catch(() => {
          console.log('Error opening pdf file');
        });
      })
      .catch(() => {
        console.error('Error writing pdf file');
      });
  }

  convertBase64ToBlob(base64Data: any, contentType: any): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    base64Data = base64Data.replace(/^[^,]+,/, '');
    base64Data = base64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  async downloadToDevice(base64, mimeType, name) {
    var base64String = `data:${mimeType};base64,${base64}`;
    const savedFile = await Filesystem.writeFile({
      path: name,
      data: base64String,
      directory: FilesystemDirectory.Documents, // Documents/watever,pdf
    });
    const path = savedFile.uri;
    // const mimeType = "application/pdf";
    this.fileOpener
      .open(path, mimeType)
      .then(() => {
        console.log('file is opened');
      })
      .catch((err) => {
        console.log('Error opening file');
        alert('Error opening file ' + JSON.stringify(err));
      });
  }
}
