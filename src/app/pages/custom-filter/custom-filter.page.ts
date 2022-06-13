import { Component, OnInit, Input } from '@angular/core';
import { UserLogin } from '../../../model/login.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilityService } from 'src/app/services/shared/utility/utility.service';
import { saveAs } from 'file-saver';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';

@Component({
    selector: 'app-custom-filter',
    templateUrl: './custom-filter.page.html',
    styleUrls: ['./custom-filter.page.scss'],
})
export class CustomFilterPage implements OnInit {
    CustomFilterform: FormGroup;
    cityData: any = [];
    columnNameDroupdownData: any = [];
    tableNameDroupdownData: any = [];
    tableData: any = {};
    showTable = false;
    downloadData: any = [];

    @Input() apiUrl: any;

    // data: data = null;
    data: any;
    constructor(private fb: FormBuilder, private utilityService: UtilityService,
        private appConfig : AppConfigService
        ) {
        this.CustomFilterform = this.fb.group({
            tableName: [null],
            columnName: [null],
            eventType: [null],
            newDate: [null],
            newUsername: [null],
        });
    }

     doDownloadToCsv() {
            let options = { selectionOnly: true };
            // this.table.columns = this.columns;
            this.tableData.exportCSV(options);
        }

    ngOnInit() {

        // this.data.username =  'admin@digitalsystem.com';
        // this.data.PASSWORD =  'Admin@123';
        // this.data.city = null;
        // this.data.username = null;
        // this.data.PASSWORD = null;
        // this.data.city = null;
        this.createTableJson();

        this.gettableNameDroupdownData()
        this.getcolumnNameDroupdownData()
        this.cityApi();
    }

    // setDownloadedData(data, obj) {
    //     obj.downloadData = obj.tableData;
    //     let filterData: any = []
    //     console.log("downloadData", this.downloadData)
    //   }
    // downloadFile(data: any) {
    //     const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    //     const header = Object.keys(data[0]);
    //     const csv = data.map((row) =>
    //       header
    //         .map((fieldName) => JSON.stringify(row[fieldName], replacer))
    //         .join(',')
    //     );
    //     csv.unshift(header.join(','));
    //     const csvArray = csv.join('\r\n');
      
    //     const a = document.createElement('a');
    //     const blob = new Blob([csvArray], { type: 'text/csv' });
        
    //     const url = window.URL.createObjectURL(blob);
      
    //     a.href = url;
    //     a.download = 'myFile.csv';
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove();
    //   }
      downloadFile(data: any) {
        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        let csvArray = csv.join('\r\n');
    
        var blob = new Blob([csvArray], {type: 'text/csv' })
        saveAs(blob, "AuditTrail.csv");
    }

    gettableNameDroupdownData() {
        let url = "querydata-by-queryid-metadata";
        let reqObject:any  = {
            queryId: "212",
            // transactionId: "1234",
        }
        reqObject.randomKey = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
        reqObject.transactionId = this.utilityService.getTRNTimestamp();
        reqObject.userId = this.appConfig.getUserData().userId;

        let crudObj2 :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, reqObject);
      crudObj2['encryptedRequest'] = newData;
      crudObj2['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj2 = reqObject;
      crudObj2['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }

        this.utilityService.callPostApi(crudObj2, url).then((resp: any) => {
              // decryption logic
    if (this.appConfig.getEncryptDatabool()) {
        let decryptedData = this.appConfig.decrypt(
              this.appConfig.secretKey,
              resp.encryptedResponse
            );
            let fullResponse = JSON.parse(decryptedData);
            resp = fullResponse;
      } 

            this.tableNameDroupdownData = resp.result;
        }, err => {
            alert("getting dropdown data json error" + JSON.stringify(err));
        })
    }

    getcolumnNameDroupdownData() {
        let url = "querydata-by-queryid-metadata";
        let reqObject :any = {
            queryId: "213",
            // transactionId: "1234"
        }
        reqObject.randomKey = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
        reqObject.transactionId = this.utilityService.getTRNTimestamp();
        reqObject.userId = this.appConfig.getUserData().userId;

        let crudObj2 :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, reqObject);
      crudObj2['encryptedRequest'] = newData;
      crudObj2['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj2 = reqObject;
      crudObj2['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }
        this.utilityService.callPostApi(crudObj2, url).then((resp: any) => {
            if (this.appConfig.getEncryptDatabool()) {
                let decryptedData = this.appConfig.decrypt(
                      this.appConfig.secretKey,
                      resp.encryptedResponse
                    );
                    let fullResponse = JSON.parse(decryptedData);
                    resp = fullResponse;
              } 
        
            this.columnNameDroupdownData = resp.result;
        }, err => {
            alert("getting dropdown data json error" + JSON.stringify(err));
        })
    }

    cityApi() {
        let url = "querydata-by-queryid-metadata";
        let reqObject:any = {
            queryId: "214",
            // transactionId: "1234"
        }
        reqObject.randomKey = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
        reqObject.transactionId = this.utilityService.getTRNTimestamp();
        reqObject.userId = this.appConfig.getUserData().userId;

        let crudObj2 :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, reqObject);
      crudObj2['encryptedRequest'] = newData;
      crudObj2['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj2 = reqObject;
      crudObj2['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }
        this.utilityService.callPostApi(crudObj2, url).then((resp: any) => {
            if (this.appConfig.getEncryptDatabool()) {
                let decryptedData = this.appConfig.decrypt(
                      this.appConfig.secretKey,
                      resp.encryptedResponse
                    );
                    let fullResponse = JSON.parse(decryptedData);
                    resp = fullResponse;
              } 
        
            this.cityData = resp.result;
        }, err => {
            alert("getting dropdown data json error" + JSON.stringify(err));
        })
        // call api



        //     this.cityData = [
        //       {
        //  id:1,
        //  label:'one'
        //       }
        //     ]

    }



    onLoginFunc() {

        // check null and form object 
        let obj: any = {};
        if (this.CustomFilterform.controls["tableName"].value != null) {
            obj["tableName"] = this.CustomFilterform.controls["tableName"].value
        }
        if (this.CustomFilterform.controls["columnName"].value != null) {
            obj["columnName"] = this.CustomFilterform.controls["columnName"].value
        }
        if (this.CustomFilterform.controls["eventType"].value != null) {
            obj["eventType"] = this.CustomFilterform.controls["eventType"].value
        }
        if (this.CustomFilterform.controls["newDate"].value != null) {
            obj["newDate"] = this.CustomFilterform.controls["newDate"].value
        }
        if (this.CustomFilterform.controls["newUsername"].value != null) {
            obj["newUsername"] = this.CustomFilterform.controls["newUsername"].value
        }
        obj["queryId"] = "215" // pass prper query id
        this.getData(obj)
    }

    ClearForm()
    {
        this.CustomFilterform.reset();
    }

    getData(reqObject) {
        // call api 
        reqObject.randomKey = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
        reqObject.transactionId = this.utilityService.getTRNTimestamp();
        reqObject.userId = this.appConfig.getUserData().userId;

        let crudObj2 :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, reqObject);
      crudObj2['encryptedRequest'] = newData;
      crudObj2['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj2 = reqObject;
      crudObj2['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }

        let url = 'custom-filter';
        this.utilityService.callPostApi(crudObj2, url).then((resp: any) => {
            if (this.appConfig.getEncryptDatabool()) {
                let decryptedData = this.appConfig.decrypt(
                      this.appConfig.secretKey,
                      resp.encryptedResponse
                    );
                    let fullResponse = JSON.parse(decryptedData);
                    resp = fullResponse;
              } 
        
            if (resp.result && resp.result.length > 0) {
                this.showTable = true;
                this.tableData= resp.result
            } else {
                this.tableData =[];
                this.utilityService.showToast('error', 'Data is not found');
            }

        });

        // let resonsee =
        //     [
        //         {
        //             "sNo": "1",
        //             "tableName": "KDB_GENERIC",
        //             "columnName": "REMARKS",
        //             "oldValue": "",
        //             "oldUsername": "1",
        //             "oldDate": "2021-09-27",
        //             "newValue": "2",
        //             "newUsername": "1",
        //             "newDate": "2021-09-27"
        //         },
        //         {
        //             "sNo": "2",
        //             "tableName": "KDB_GENERIC",
        //             "columnName": "REMARKS",
        //             "oldValue": "",
        //             "oldUsername": "1",
        //             "oldDate": "2021-09-27",
        //             "newValue": "2",
        //             "newUsername": "1",
        //             "newDate": "2021-09-27"
        //         },
        //         {
        //             "sNo": "3",
        //             "tableName": "KDB_GENERIC",
        //             "columnName": "REMARKS",
        //             "oldValue": "",
        //             "oldUsername": "1",
        //             "oldDate": "2021-09-27",
        //             "newValue": "2",
        //             "newUsername": "1",
        //             "newDate": "2021-09-27"
        //         },
        //         {
        //             "sNo": "4",
        //             "tableName": "KDB_GENERIC",
        //             "columnName": "REMARKS",
        //             "oldValue": "",
        //             "oldUsername": "1",
        //             "oldDate": "2021-09-27",
        //             "newValue": "2",
        //             "newUsername": "1",
        //             "newDate": "2021-09-27"
        //         },
        //         {
        //             "sNo": "5",
        //             "tableName": "KDB_GENERIC",
        //             "columnName": "REMARKS",
        //             "oldValue": "",
        //             "oldUsername": "1",
        //             "oldDate": "2021-09-27",
        //             "newValue": "1",
        //             "newUsername": "1",
        //             "newDate": "2021-09-27"
        //         }
        //     ];// data comes here from api
        // this.tableData.jsonTableData = resonsee;
    }




    createTableJson() {
        let reqObject :any = {
            "gridId": "",
            "langId": this.appConfig.getLanguageId(),
            "menuconId": 127
        }
        reqObject.randomKey = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
        reqObject.transactionId = this.utilityService.getTRNTimestamp();
        reqObject.userId = this.appConfig.getUserData().userId;

        let crudObj2 :any = {};
    if (this.appConfig.getEncryptDatabool()) {
      let newData = this.appConfig.encrypt(this.appConfig.secretKey, reqObject);
      crudObj2['encryptedRequest'] = newData;
      crudObj2['randomKey'] = this.appConfig.rsa_encrypt(this.appConfig.getSecret());
    } else {
      crudObj2 = reqObject;
      crudObj2['encryptedRequest'] = null;
      // crudObj['randomKey'] = null;
    }

        let url = "datagrid";
        this.utilityService.callPostApi(crudObj2, url).then((resp: any) => {
            if (this.appConfig.getEncryptDatabool()) {
                let decryptedData = this.appConfig.decrypt(
                      this.appConfig.secretKey,
                      resp.encryptedResponse
                    );
                    let fullResponse = JSON.parse(decryptedData);
                    resp = fullResponse;
              } 
        
            this.tableData= resp.result;
        });
        // this.tableData =
        //     {
        //         "tableMetaData": [
        //             {
        //                 "field": "tableName",
        //                 "header": "",
        //                 "headerType": "text",
        //                 "bodyType": "text"
        //             },
        //             {
        //                 "field": "columnName",
        //                 "header": "",
        //                 "headerType": "text",
        //                 "bodyType": "text"
        //             },
        //             {
        //                 "field": "eventType",
        //                 "header": "",
        //                 "headerType": "text",
        //                 "bodyType": "statusText"
        //             },

        //             {
        //                 "field": "oldValue",
        //                 "header": "",
        //                 "headerType": "text",
        //                 "bodyType": "text"
        //             },
        //             {
        //                 "field": "oldDate",
        //                 "header": "",
        //                 "headerType": "date",
        //                 "bodyType": "dateText"
        //             },
        //             {
        //                 "field": "oldUsername",
        //                 "header": "",
        //                 "headerType": "text",
        //                 "bodyType": "text"
        //             },

        //             {
        //                 "field": "newValue",
        //                 "header": "",
        //                 "headerType": "text",
        //                 "bodyType": "text"
        //             },
        //             {
        //                 "field": "newDate",
        //                 "header": "",
        //                 "headerType": "date",
        //                 "bodyType": "dateText"
        //             },
        //             {
        //                 "field": "newUsername",
        //                 "header": "",
        //                 "headerType": "text",
        //                 "bodyType": "text"
        //             },
        //             { "field": "status", "header": "", "headerType": "text", "bodyType": "statusText" }
        //         ],
        //         "tableMetaDataFieldNameLang": [
        //             {
        //                 "field": "tableName",
        //                 "header": "Table Name"
        //             },
        //             {
        //                 "field": "columnName",
        //                 "header": "Column Name"
        //             },
        //             {
        //                 "field": "eventType",
        //                 "header": "Event Type"
        //             },
        //             {
        //                 "field": "oldValue",
        //                 "header": "Original Value "
        //             },
        //             {
        //                 "field": "oldDate",
        //                 "header": "Created On"
        //             },
        //             {
        //                 "field": "oldUsername",
        //                 "header": "Created By"
        //             },
        //             {
        //                 "field": "newValue",
        //                 "header": "Modified Value"
        //             },
        //             {
        //                 "field": "newDate",
        //                 "header": "Modified On "
        //             },
        //             {
        //                 "field": "newUsername",
        //                 "header": "Modifited By"
        //             },
        //             { "field": "status", "header": "Status" }
        //         ],
        //         "filterData": [],
        //         "filterData1": [
        //             {
        //                 "title": "",
        //                 "placeholder": "",
        //                 "type": "dropdown",
        //                 "value": null,
        //                 "tableMetaDataField": "tableName",
        //                 "maxLength": "200"
        //             },
        //             {
        //                 "title": "",
        //                 "placeholder": "",
        //                 "type": "text",
        //                 "value": null,
        //                 "tableMetaDataField": "columnName",
        //                 "maxLength": "200"
        //             },
        //             {
        //                 "title": "",
        //                 "placeholder": "",
        //                 "type": "text",
        //                 "value": null,
        //                 "tableMetaDataField": "eventType",
        //                 "maxLength": "1"
        //             },
        //             {
        //                 "title": "",
        //                 "placeholder": "",
        //                 "type": "date",
        //                 "value": null,
        //                 "tableMetaDataField": "newDate",
        //                 "maxLength": "100"
        //             },
        //             {
        //                 "title": "",
        //                 "placeholder": "",
        //                 "type": "text",
        //                 "value": null,
        //                 "tableMetaDataField": "newUsername",
        //                 "maxLength": "150"
        //             }
        //         ],
        //         "filterDataFieldNameLang": [],
        //         "filterDataFieldNameLang1": [
        //             {
        //                 "tableMetaDataField": "tableName",
        //                 "title": "Table Name",
        //                 "placeholder": "Enter Table Name"
        //             },
        //             {
        //                 "tableMetaDataField": "columnName",
        //                 "title": "Column Name",
        //                 "placeholder": "Column Name"
        //             },
        //             {
        //                 "tableMetaDataField": "eventType",
        //                 "title": "Event Type",
        //                 "placeholder": "Enter Event Type"
        //             },
        //             {
        //                 "tableMetaDataField": "newDate",
        //                 "title": "Modified On ",
        //                 "placeholder": "Enter Modified On"
        //             },
        //             {
        //                 "tableMetaDataField": "newUsername",
        //                 "title": "Modifited By",
        //                 "placeholder": "Enter Modifited By"
        //             }
        //         ],
        //         "tableTitle": "DATABASE -list of audit trail",
        //         "commonLangConfiguration": {
        //             "searchPlaceholder": "Global Search"
        //         },
        //         "tableConfigurationData": {
        //             "changeModalTitle": true,
        //             "modalTitle": "audit search",
        //             "showDownLoadFlag": true,
        //             "showDownLoadPdf": true,
        //             "showDownLoadExcel": true,
        //             "showDownLoadCsv": true,
        //             "showSearchBar": true,
        //             "showCustomFilter": true,
        //             "showSerialNumber": true,
        //             "showPaginator": true,
        //             "showSortIcon": true,
        //             "showActionsAdd": false,
        //             "showEditNOTINUSE": true,
        //             "showDeleteNOTINUSE": true,
        //             "showActions": true,
        //             "downloadData": [],
        //             "filteredTableData": [],
        //             "rowsPerPageOptions": [
        //                 10,
        //                 25,
        //                 50
        //             ],
        //             "rows": "5",
        //             "dataKey": "id",
        //             "kastle/AuditTrail/AuditTrail/AuditTrail_ADD": "key-value-screen",
        //             "apiUrlAdd": "screenconfig",
        //             "apiUrlAddReqMetaData": {
        //                 "screenConfigId": 0,
        //                 "langId": null
        //             },
        //             "apiUrlEdit_DELETE_IT_LATER": "key-value-edit-screen",
        //             "apiUrlEdit": "screenconfig",
        //             "apiUrlEditReqMetaData": {
        //                 "screenConfigId": 0,
        //                 "langId": null
        //             },
        //             "apiUrlEditSavedData": "querydata-by-queryid-multiple-metadata",
        //             "apiUrlEditReqSavedData": [
        //                 {
        //                     "queryId": 0,
        //                     "transactionId": "1234"
        //                 }
        //             ],
        //             "apiUrlEditReqSavedDataMetaData": [
        //                 {
        //                     "fieldMapping": "id",
        //                     "value": "",
        //                     "reqKeyName": ":id"
        //                 }
        //             ],
        //             "apiSaveDataUrl": "querydata-save",
        //             "apiSaveDataUrlReqData": {
        //                 "queryId": 0,
        //                 "queryId2": 0,
        //                 "transactionId": "123456"
        //             },
        //             "apiUpdateDataUrl": "querydata-update",
        //             "apiUpdateDataUrlReqData": {
        //                 "queryId": 0,
        //                 "queryId2": 0,
        //                 "queryId3": 0,
        //                 "transactionId": "123456"
        //             },
        //             "apiDeleteDataUrl": "querydata-update",
        //             "apiDeleteDataUrlReqData": {
        //                 "queryId": 0,
        //                 "transactionId": "123456"
        //             },

        //             "apiUrlCustomSearch": "screenconfig",
        //             "apiUrlCustomSearchReqMataData": {
        //                 "screenConfigId": 64,
        //                 "langId": null
        //             },
        //             "apiCustomSearchDataUrl": "custom-filter",
        //             "apiCustomSearchDataUrlReqData": {
        //                 "queryId": "40",
        //                 "queryId2": 0,
        //                 "transactionId": "123456"
        //             },
        //             "dependantGrid": false,
        //             "dependantGridMetaData": null,
        //             "dependantGridReqObj": null,
        //             "dependantGridUrl": null
        //         },
        //         "jsonTableData": []
        //     }

    }

}
